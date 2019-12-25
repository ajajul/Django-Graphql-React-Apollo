import graphene
from graphene_django.types import DjangoObjectType, ObjectType
from .models import Actor, Movie
from user.schema import UserType

class ActorType(DjangoObjectType):
    """
    Create a GraphQL type for the actor model
    """
    class Meta:
        model = Actor


class MovieType(DjangoObjectType):
    """
    Create a GraphQL type for the movie model
    """
    class Meta:
        model = Movie


class Query(ObjectType):
    """
    Create a Query type
    """
    actor = graphene.Field(ActorType, id=graphene.Int()) # Get actor by id
    movie = graphene.Field(MovieType, id=graphene.Int()) # Get movie by id
    actors = graphene.List(ActorType) # Get all actors list
    movies= graphene.List(MovieType) # Get all movies list

    def resolve_actor(self, info, **kwargs):
        """
        To get particualr actor detail, but user need to be authenticated
        """
        user = info.context.user

        if user.is_anonymous:
            raise Exception('You must be logged to create Movie')

        id = kwargs.get('id')

        if id is not None:
            return Actor.objects.get(pk=id)

        return None

    def resolve_movie(self, info, **kwargs):
        """
        To get particualr movie detail, but user need to be authenticated
        """
        user = info.context.user

        if user.is_anonymous:
            raise Exception('You must be logged to create Movie')

        id = kwargs.get('id')

        if id is not None:
            return Movie.objects.get(pk=id)

        return None

    def resolve_actors(self, info, **kwargs):
        """
        To get all actors detail, but user need to be authenticated
        """
        user = info.context.user

        if user.is_anonymous:
            raise Exception('You must be logged to create Movie')

        return Actor.objects.all()

    def resolve_movies(self, info, **kwargs):
        """
        To get all movies detail, but user need to be authenticated
        """
        user = info.context.user

        if user.is_anonymous:
            raise Exception('You must be logged to create Movie')

        return Movie.objects.all()


class ActorInput(graphene.InputObjectType):
    """
    Define fields for Actor model
    """
    id = graphene.ID()
    name = graphene.String()

class MovieInput(graphene.InputObjectType):
    """
    Define fields for Movie models
    """
    id = graphene.ID()
    title = graphene.String()
    actors = graphene.List(ActorInput)
    year = graphene.Int()


class CreateActor(graphene.Mutation):
    """
    Create mutation for Actor to add new records in Actor model
    """
    class Arguments:
        input = ActorInput(required=True)

    ok = graphene.Boolean()
    actor = graphene.Field(ActorType)

    @staticmethod
    def mutate(root, info, input=None):
        """
        user need to be authenticated to creat record
        """
        user = info.context.user

        if user.is_anonymous:
            raise Exception('You must be logged to create Movie')

        ok = True
        actor_instance = Actor(name=input.name)
        actor_instance.save()
        return CreateActor(ok=ok, actor=actor_instance)


class UpdateActor(graphene.Mutation):
    """
    Update mutation to Update Actor details using Actor Id.
    """
    class Arguments:
        id = graphene.Int(required=True)
        input = ActorInput(required=True)

    ok = graphene.Boolean()
    actor = graphene.Field(ActorType)

    @staticmethod
    def mutate(root, info, id, input=None):
        """
        user need to be authenticated to update record
        """
        user = info.context.user

        if user.is_anonymous:
            raise Exception('You must be logged to create Movie')

        ok = False
        actor_instance = Actor.objects.get(pk=id)
        if actor_instance:
            ok = True
            actor_instance.name = input.name
            actor_instance.save()
            return UpdateActor(ok=ok, actor=actor_instance)
        return UpdateActor(ok=ok, actor=None)


class CreateMovie(graphene.Mutation):
    """
    Create Mutation for Movies to add Movies Records
    """
    class Arguments:
        input = MovieInput(required=True)

    ok = graphene.Boolean()
    movie = graphene.Field(MovieType)

    @staticmethod
    def mutate(root, info, input=None):
        """
        user need to be authenticated to creat record
        """
        user = info.context.user

        if user.is_anonymous:
            raise Exception('You must be logged to create Movie')

        ok = True
        actors = []
        for actor_input in input.actors:
          actor = Actor.objects.get(pk=actor_input.id)
          if actor is None:
            return CreateMovie(ok=False, movie=None)
          actors.append(actor)
        movie_instance = Movie(
          title=input.title,
          year=input.year
          )
        movie_instance.save()
        movie_instance.actors.set(actors)
        return CreateMovie(ok=ok, movie=movie_instance)


class UpdateMovie(graphene.Mutation):
    """
    Update Mutation To update Movie records using Movie Id.
    """
    class Arguments:
        id = graphene.Int(required=True)
        input = MovieInput(required=True)

    ok = graphene.Boolean()
    movie = graphene.Field(MovieType)

    @staticmethod
    def mutate(root, info, id, input=None):
        """
        user need to be authenticated to update record
        """
        user = info.context.user

        if user.is_anonymous:
            raise Exception('You must be logged to create Movie')

        ok = False
        movie_instance = Movie.objects.get(pk=id)
        if movie_instance:
            ok = True
            actors = []
            for actor_input in input.actors:
              actor = Actor.objects.get(pk=actor_input.id)
              if actor is None:
                return UpdateMovie(ok=False, movie=None)
              actors.append(actor)
            movie_instance.title=input.title
            movie_instance.year=input.year
            movie_instance.actors.set(actors)
            return UpdateMovie(ok=ok, movie=movie_instance)
        return UpdateMovie(ok=ok, movie=None)


class Mutation(graphene.ObjectType):
    """
    Add all mutation
    """
    create_actor = CreateActor.Field()
    update_actor = UpdateActor.Field()
    create_movie = CreateMovie.Field()
    update_movie = UpdateMovie.Field()
