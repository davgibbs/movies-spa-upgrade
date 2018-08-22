# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-05 13:26
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='MovieGenre',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
            options={
                'verbose_name': 'Movie Genre',
                'verbose_name_plural': 'Movie Genres',
            },
        ),
        migrations.AlterField(
            model_name='movie',
            name='genre',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='movie_genre', to='movies.MovieGenre', verbose_name='Movie Genre'),
        ),
        migrations.AlterField(
            model_name='movie',
            name='release_year',
            field=models.PositiveIntegerField(),
        ),
    ]
