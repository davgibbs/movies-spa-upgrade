# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-04 15:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100, unique=True)),
                ('release_year', models.IntegerField(max_length=4)),
                ('director', models.CharField(max_length=100)),
                ('genre', models.CharField(choices=[('action', 'Action'), ('adventure', 'Adventure'), ('comedy', 'Comedy'), ('crime_gangster', 'Crime & Gangster'), ('drama', 'Drama'), ('historical', 'Historical'), ('horror', 'Horror'), ('musicals', 'Musicals'), ('science_fiction', 'Science Fiction'), ('war', 'War'), ('westerns', 'Westerns')], max_length=100)),
            ],
            options={
                'verbose_name': 'Movie',
                'verbose_name_plural': 'Movies',
            },
        ),
    ]
