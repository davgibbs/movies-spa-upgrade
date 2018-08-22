from __future__ import unicode_literals

from django.core.validators import MaxValueValidator
from django.db import models
from django.contrib.auth.models import User


class MovieGenre(models.Model):
    """ Movie Genre Information """
    name = models.CharField(max_length=100, unique=True)

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = 'Movie Genre'
        verbose_name_plural = 'Movie Genres'


class Movie(models.Model):
    """ Movie Information """
    title = models.CharField(max_length=100, unique=True)
    created_date = models.DateTimeField(auto_now_add=True)
    summary = models.TextField(max_length=400, blank=True, default='')
    release_year = models.PositiveIntegerField(default=2016)
    director = models.CharField(max_length=100, blank=True, default='')
    genre = models.ForeignKey(MovieGenre, related_name='movie_genre', default=1, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='movies/', default='movies/Movie.jpg')
    rating = models.PositiveIntegerField(validators=[MaxValueValidator(5)], default=3)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)

    def __unicode__(self):
        return self.title

    class Meta:
        verbose_name = 'Movie'
        verbose_name_plural = 'Movies'
