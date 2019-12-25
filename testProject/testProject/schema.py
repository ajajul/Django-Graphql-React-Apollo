import graphene
import graphql_jwt
import film.schema
import user.schema

class Query(user.schema.Query, film.schema.Query, graphene.ObjectType):
    """
    Define all queries here to create schema
    """
    pass

class Mutation(user.schema.Mutation, film.schema.Mutation, graphene.ObjectType):
    """
    Define all mutatin here to create schema
    """
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)