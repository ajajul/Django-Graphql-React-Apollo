import graphene
import graphql_jwt
from graphene_django import DjangoObjectType
from graphene_file_upload.scalars import Upload
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
    email = graphene.String(required=True)
    password = graphene.String(required=True)
    photo = Upload(required=True)
    gender = graphene.String(required=True)
    country = graphene.String(required=True)
    state = graphene.String(required=True)
    city = graphene.String(required=True)
    phone = graphene.String(required=True)
    developer = graphene.Boolean(required=True)
    qa = graphene.Boolean(required=True)
    bde = graphene.Boolean(required=True)
    ba = graphene.Boolean(required=True)
    hr = graphene.Boolean(required=True)
    dob = graphene.types.datetime.Date(required=True)


class CreateUser(graphene.Mutation):
    """
    Create mutation for User to Register new user
    """
    ok = graphene.Boolean()
    user = graphene.Field(UserType)

    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        photo = Upload(required=True)
        gender = graphene.String(required=True)
        country = graphene.String(required=True)
        state = graphene.String(required=True)
        city = graphene.String(required=True)
        phone = graphene.String(required=True)
        developer = graphene.Boolean(required=True)
        qa = graphene.Boolean(required=True)
        bde = graphene.Boolean(required=True)
        ba = graphene.Boolean(required=True)
        hr = graphene.Boolean(required=True)
        dob = graphene.types.datetime.Date(required=True)

    @staticmethod
    def mutate(self, info, password, email):
        user = get_user_model()(
            # first_name=first_name,
            # last_name=last_name,
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
