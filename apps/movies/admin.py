from django.contrib import admin

from .models import MovieGenre, Movie


class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'director', 'release_year', 'genre', 'image', 'rating', 'created_date', 'user')
    search_fields = ['title']
    list_display_links = ['title']


class MovieGenreAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ['name']
    list_display_links = ['name']
    ordering = ('name',)


admin.site.register(MovieGenre, MovieGenreAdmin)
admin.site.register(Movie, MovieAdmin)
