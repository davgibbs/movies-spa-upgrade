from __future__ import unicode_literals
from PIL import Image
from io import BytesIO

from django.core.validators import MaxValueValidator
from django.core.files.base import ContentFile
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
    release_year = models.PositiveIntegerField(default=2018)
    director = models.CharField(max_length=100, blank=True, default='')
    genre = models.ForeignKey(MovieGenre, related_name='movie_genre', default=1, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='movies/', default='movies/Movie.jpg')
    small_image = models.ImageField(upload_to='movies/small/', default='movies/small/Movie.jpg')
    rating = models.PositiveIntegerField(validators=[MaxValueValidator(5)], default=3)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)

    def create_thumbnail(self):
        if self.image.name == 'movies/Movie.jpg':
            return

        output_size = (300, 150)  # image retain ratio and should be max (w, h)
        original_image_name = self.image.name
        pil_type = original_image_name.split('.')[-1].lower()
        if pil_type == 'jpg':
            pil_type = 'jpeg'

        image = Image.open(self.image)
        image.thumbnail(output_size, Image.ANTIALIAS)
        temp_handle = BytesIO()
        image.save(temp_handle, pil_type)

        self.small_image = ContentFile(temp_handle.read())
        self.small_image.name = original_image_name.split('/')[-1]
        self.image.close()
        self.save(thumbnail_saved=True)

    def save(self, *args, **kwargs):
        thumbnail_saved = kwargs.get('thumbnail_saved')
        if thumbnail_saved:
            kwargs.pop('thumbnail_saved')
        super().save(*args, **kwargs)  # Call the "real" save() method.
        if not thumbnail_saved:
            self.create_thumbnail()

    def __unicode__(self):
        return self.title

    class Meta:
        verbose_name = 'Movie'
        verbose_name_plural = 'Movies'
