import graphene
import graphql_jwt
from graphene_django import DjangoObjectType
from django.contrib.auth import get_user_model



class UserType(DjangoObjectType):
    """
    Create a GraphQL type for the user model
    """
    class Meta:
        model = get_user_model()


class Query(graphene.ObjectType):
    """
    Create a Query type
    """

    me = graphene.Field(UserType) # Get logined user means Get user by fetching the token
    user = graphene.Field(UserType, id=graphene.Int()) # Get user detail by Id
    users = graphene.List(UserType) # Get all user list


    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')

        return user


    def resolve_user(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return get_user_model().objects.get(pk=id)

        return None

    def resolve_users(self, info):
        return get_user_model().objects.all()


class UserInput(graphene.InputObjectType):
    """
    Define fields for User Register
    """
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    password = graphene.String(required=True)
    email = graphene.String(required=True)


class CreateUser(graphene.Mutation):
    """
    Create mutation for User to Register new user
    """
    ok = graphene.Boolean()
    user = graphene.Field(UserType)

    class Arguments:
        input = UserInput(required=True)

    @staticmethod
    def mutate(self, info, first_name, last_name, password, email):
        user = get_user_model()(
            first_name=first_name,
            last_name=last_name,
            email=email,
        )

        ok = True
        user.set_password(password)
        user.save()

        return CreateUser(ok=ok, user=user)


class Mutation(graphene.ObjectType):
    """
    Add all mutation
    """
    create_user = CreateUser.Field()
