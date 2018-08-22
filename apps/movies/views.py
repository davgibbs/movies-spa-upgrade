from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .permissions import IsOwnerOrReadOnly, IsReadOnly
from .serializers import MovieGenreSerializer, MovieSerializer
from .models import Movie, MovieGenre


class MovieViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows movies to be viewed or edited.
    """
    permission_classes = (IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)
    queryset = Movie.objects.all().order_by('title')
    serializer_class = MovieSerializer


class MovieGenreViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows movie genres to be viewed.
    """
    permission_classes = (IsReadOnly, )
    queryset = MovieGenre.objects.all().order_by('name')
    serializer_class = MovieGenreSerializer


@api_view(['GET'])
@permission_classes((AllowAny, ))
def user_status(request):
    """
    API view to tell whether the current user session is logged in or not
    """
    if request.user.id is not None:
        return Response({'loggedin': True})
    return Response({'loggedin': False})
