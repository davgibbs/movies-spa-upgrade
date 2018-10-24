from rest_framework import serializers
from django.contrib.auth.models import User

from .models import MovieGenre, Movie


class MovieGenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieGenre
        fields = ('id', 'name')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class MovieSerializer(serializers.ModelSerializer):
    genre_obj = MovieGenreSerializer(source='genre', read_only=True)
    user_obj = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Movie
        fields = ('id', 'title', 'summary', 'release_year', 'director', 'genre', 'genre_obj', 'image', 'rating',
                  'user', 'user_obj', 'small_image')
