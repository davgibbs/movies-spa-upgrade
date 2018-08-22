import os
from collections import OrderedDict

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from django.contrib.sessions.models import Session
from django.contrib.auth import SESSION_KEY
from django.conf import settings

from movies.models import Movie, MovieGenre


def is_user_authenticated(session_key):
    try:
        session = Session.objects.get(session_key=session_key)
        session.get_decoded()[SESSION_KEY]
        return True
    except (Session.DoesNotExist, KeyError):
        return False


class MoveTestTemplate(TestCase):
    def test_index_ok(self):
        response = self.client.get('')
        self.assertEqual(response.status_code, 200)
        self.assertTrue("Movie Gallery" in response.content.decode())


class MovieTestCase(TestCase):

    def test_list_movies(self):
        client = APIClient()
        response = client.get('/api/movies', {})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_list_movies_one(self):
        movie_genre = MovieGenre(name='Comedy')
        movie_genre.save()

        User.objects.create_user('admin', 'myemail@test.com', 'password123')
        movie = Movie(title="Movie 1")
        movie.save()

        client = APIClient()
        response = client.get('/api/movies', {})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [OrderedDict([('id', 1),
                                                      ('title', 'Movie 1'),
                                                      ('summary', ''),
                                                      ('release_year', 2016),
                                                      ('director', ''),
                                                      ('genre', 1),
                                                      ('genre_obj', OrderedDict([('id', 1),
                                                                                 ('name', 'Comedy')])),
                                                      ('image', 'http://testserver/media/movies/Movie.jpg'),
                                                      ('rating', 3),
                                                      ('user', 1),
                                                      ('user_obj', OrderedDict([('id', 1),
                                                                                ('username', 'admin')]))])])

    def test_add_movie(self):
        User.objects.create_user('admin', 'myemail@test.com', 'password123')

        client = APIClient()  # This handles including the sessionid each time
        client.login(username='admin', password='password123')

        response = client.post('/api/movies', {'title': 'Lion King',
                                               'summary': 'Lion Movie',
                                               'release_year': '1994',
                                               'rating': 2,
                                               'director': 'Roger Allers'})

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(Movie.objects.all()), 1)
        self.assertEqual(response.data, {'user': 1, 'rating': 2, 'genre_obj': None, 'id': 1, 'release_year': 1994,
                                         'image': 'http://testserver/media/movies/Movie.jpg', 'genre': 1,
                                         'title': 'Lion King',
                                         'user_obj': OrderedDict([('id', 1), ('username', 'admin')]),
                                         'summary': 'Lion Movie',
                                         'director': 'Roger Allers'})

    def test_add_movie_with_image(self):
        User.objects.create_user('admin', 'myemail@test.com', 'password123')

        client = APIClient()  # This handles including the sessionid each time
        client.login(username='admin', password='password123')

        # Make sure the media folder does not have an image of the same name - for checking response as string added
        try:
            os.remove(settings.BASE_DIR + '/media/movies/test-image.jpg')
        except FileNotFoundError:
            pass

        with open(settings.BASE_DIR + '/movies/test_images/test-image.jpg', 'rb') as fp:
            # Send a multipart request
            response = client.post('/api/movies', {'title': 'Lion King',
                                                   'summary': 'Lion Movie',
                                                   'release_year': '1994',
                                                   'rating': 2,
                                                   'director': 'Roger Allers',
                                                   'image': fp})

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(Movie.objects.all()), 1)
        self.assertEqual(response.data, {'user': 1, 'rating': 2, 'genre_obj': None, 'id': 1, 'release_year': 1994,
                                         'image': 'http://testserver/media/movies/test-image.jpg', 'genre': 1,
                                         'title': 'Lion King',
                                         'user_obj': OrderedDict([('id', 1), ('username', 'admin')]),
                                         'summary': 'Lion Movie',
                                         'director': 'Roger Allers'})

    def test_add_movie_same_title(self):
        User.objects.create_user('admin', 'myemail@test.com', 'password123')

        client = APIClient()  # This handles including the sessionid each time
        client.login(username='admin', password='password123')

        self.assertEqual(len(Movie.objects.all()), 0)
        response = client.post('/api/movies', {'title': 'Lion King',
                                               'summary': 'Lion Movie',
                                               'release_year': '1994',
                                               'rating': 2,
                                               'director': 'Roger Allers'})

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(Movie.objects.all()), 1)

        response = client.post('/api/movies', {'title': 'Lion King',
                                               'summary': 'Lion Movie',
                                               'release_year': '1994',
                                               'rating': 2,
                                               'director': 'Roger Allers'})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {'title': ['Movie with this title already exists.']})
        self.assertEqual(len(Movie.objects.all()), 1)

    def test_add_movie_incorrect_userid_format(self):
        User.objects.create_user('admin', 'myemail@test.com', 'password123')

        client = APIClient()  # This handles including the sessionid each time
        client.login(username='admin', password='password123')

        response = client.post('/api/movies', {'title': 'Lion King',
                                               'summary': 'Lion Movie',
                                               'release_year': '1994',
                                               'rating': 2,
                                               'director': 'Roger Allers',
                                               'user': 'admin2'})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {'user': ['Incorrect type. Expected pk value, received str.']})
        self.assertEqual(len(Movie.objects.all()), 0)

    def test_delete_movie(self):
        movie_genre = MovieGenre(name='Drama')
        movie_genre.save()

        movie = Movie(title="Movie 1")
        movie.save()

        User.objects.create_user('admin', 'myemail@test.com', 'password123')

        client = APIClient()
        client.login(username='admin', password='password123')
        response = client.delete('/api/movies/' + str(movie.id))

        self.assertEqual(response.status_code, 204)
        self.assertEqual(len(Movie.objects.all()), 0)

    def test_edit_movie(self):
        movie_genre = MovieGenre(name='Drama')
        movie_genre.save()

        movie = Movie(title="Movie 1")
        movie.save()

        User.objects.create_user('admin', 'myemail@test.com', 'password123')

        client = APIClient()
        client.login(username='admin', password='password123')
        response = client.put('/api/movies/' + str(movie.id), {'title': 'Movie 2',
                                                               'summary': 'Lion Movie',
                                                               'release_year': '1994',
                                                               'rating': 2,
                                                               'director': 'Roger Allers'})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(Movie.objects.all()), 1)
        self.assertEqual(Movie.objects.get(id=movie.id).title, 'Movie 2')

    def test_edit_movie_cannot_edit_id(self):
        movie_genre = MovieGenre(name='Drama')
        movie_genre.save()

        movie = Movie(title="Movie 1")
        movie.save()

        User.objects.create_user('admin', 'myemail@test.com', 'password123')

        client = APIClient()
        client.login(username='admin', password='password123')
        response = client.put('/api/movies/' + str(movie.id), {'id': 5,
                                                               'title': 'Movie 2',
                                                               'summary': 'Lion Movie',
                                                               'release_year': '1994',
                                                               'rating': 2,
                                                               'director': 'Roger Allers'})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(Movie.objects.all()), 1)
        self.assertEqual(Movie.objects.get(id=movie.id).title, 'Movie 2')
        self.assertEqual(Movie.objects.get(id=movie.id).id, 1)

    def test_delete_movie_not_logged_in(self):
        movie_genre = MovieGenre(name='Drama')
        movie_genre.save()

        movie = Movie(title="Movie 1")
        movie.save()

        client = APIClient()
        response = client.delete('/api/movies/' + str(movie.id))

        self.assertEqual(response.status_code, 403)
        self.assertEqual(len(Movie.objects.all()), 1)

    def test_add_movie_delete_different_user(self):
        User.objects.create_user('userA', 'myemailA@test.com', 'Apassword123')
        User.objects.create_user('userB', 'myemailB@test.com', 'Bpassword123')

        client = APIClient()
        client.login(username='userA', password='Apassword123')

        response = client.post('/api/movies', {'title': 'Lion King',
                                               'summary': 'Lion Movie',
                                               'release_year': '1994',
                                               'rating': 2,
                                               'director': 'Roger Allers'})
        movie_id = response.data['id']

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(Movie.objects.all()), 1)
        # Logout of user A
        client.post('/rest-auth/logout/', {})
        # Login as user B
        client.login(username='userB', password='Bpassword123')
        # Should only be possible to delete movies that you have added
        response = client.delete('/api/movies/' + str(movie_id))

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['detail'], 'You do not have permission to perform this action.')
        self.assertEqual(len(Movie.objects.all()), 1)

    def test_add_movie_edit_different_user(self):
        User.objects.create_user('userA', 'myemailA@test.com', 'Apassword123')
        User.objects.create_user('userB', 'myemailB@test.com', 'Bpassword123')

        client = APIClient()
        client.login(username='userA', password='Apassword123')

        response = client.post('/api/movies', {'title': 'Lion King',
                                               'summary': 'Lion Movie',
                                               'release_year': '1994',
                                               'rating': 2,
                                               'director': 'Roger Allers'})
        movie_id = response.data['id']

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(Movie.objects.all()), 1)
        # Logout of user A
        client.post('/rest-auth/logout/', {})
        # Login as user B
        client.login(username='userB', password='Bpassword123')
        # Should only be possible to edit movies that you have added
        response = client.put('/api/movies/' + str(movie_id), {'title': 'Lion King',
                                                               'summary': 'Lion and meerkat Movie',
                                                               'release_year': '1994',
                                                               'rating': 2,
                                                               'director': 'Roger Allers'})

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['detail'], 'You do not have permission to perform this action.')
        self.assertEqual(len(Movie.objects.all()), 1)
        self.assertEqual(Movie.objects.get(id=movie_id).summary, 'Lion Movie')


class MovieGenreTestCase(TestCase):

    def test_list_genres(self):
        movie_genre = MovieGenre(name='Comedy')
        movie_genre.save()

        client = APIClient()
        response = client.get('/api/movies-genres', {})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [OrderedDict([('id', 1), ('name', 'Comedy')])])

    def test_make_sure_read_only_delete(self):
        movie_genre = MovieGenre(name='Comedy')
        movie_genre.save()

        client = APIClient()
        response = client.delete('/api/movies-genres/' + str(movie_genre.id))
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data, {'detail': 'Authentication credentials were not provided.'})

        User.objects.create_user('admin-test', 'myemail@test.com', 'password1234')
        client.login(username='admin-test', password='password1234')
        response = client.delete('/api/movies-genres/' + str(movie_genre.id))
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data, {'detail': 'You do not have permission to perform this action.'})
        self.assertEqual(len(MovieGenre.objects.all()), 1)
        self.assertEqual(MovieGenre.objects.get(id=movie_genre.id).name, 'Comedy')


class UserLoginTestCase(TestCase):

    def test_user_login(self):
        user = User.objects.create_user('admin-test', 'myemail@test.com', 'password1234')
        self.assertEqual(len(Session.objects.all()), 0)

        client = APIClient()  # creates a session (non-authenicated)
        self.assertEqual(is_user_authenticated(client.session.session_key), False)

        # login user
        credentials = {'username': 'admin-test', 'password': 'password1234'}
        response = client.post('/rest-auth/login/', credentials)
        # just ignore token that is included in response
        self.assertEqual(response.status_code, 200)
        self.assertEqual(is_user_authenticated(client.session.session_key), True)
        self.assertEqual(len(Session.objects.all()), 1)
        self.assertEqual(Session.objects.all()[0].get_decoded().get('_auth_user_id'), str(user.id))
        self.assertEqual(Session.objects.all()[0].get_decoded().get('_auth_user_id'), str(user.id))

    def test_user_login_bad_username(self):
        User.objects.create_user('admin-test', 'myemail@test.com', 'password1234')
        self.assertEqual(len(Session.objects.all()), 0)

        client = APIClient()
        self.assertEqual(is_user_authenticated(client.session.session_key), False)

        # login user
        credentials = {'username': 'admin-test', 'password': 'password1234s'}
        response = client.post('/rest-auth/login/', credentials)
        # just ignore token that is included in response
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {'non_field_errors': ['Unable to log in with provided credentials.']})
        self.assertEqual(is_user_authenticated(client.session.session_key), False)
        self.assertEqual(len(Session.objects.all()), 1)
        self.assertEqual(Session.objects.all()[0].get_decoded().get('_auth_user_id'), None)

    def test_user_logout(self):
        user = User.objects.create_user('admin-test', 'myemail@test.com', 'password1234')
        self.assertEqual(len(Session.objects.all()), 0)

        client = APIClient()
        self.assertEqual(is_user_authenticated(client.session.session_key), False)

        # login user
        credentials = {'username': 'admin-test', 'password': 'password1234'}
        response = client.post('/rest-auth/login/', credentials)
        # just ignore token that is included in response
        self.assertEqual(response.status_code, 200)
        self.assertEqual('key' in response.data, True)
        self.assertEqual(is_user_authenticated(client.session.session_key), True)
        self.assertEqual(len(Session.objects.all()), 1)
        self.assertEqual(Session.objects.all()[0].get_decoded().get('_auth_user_id'), str(user.id))

        # Now logout
        response = client.post('/rest-auth/logout/', {})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'detail': 'Successfully logged out.'})

        self.assertEqual(len(Session.objects.all()), 0)
        self.assertEqual(is_user_authenticated(client.session.session_key), False)

    def test_get_session_loggedin_no(self):
        client = APIClient()
        response = client.get('/api/user-status/', {})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'loggedin': False})

    def test_get_session_loggedin_yes(self):
        User.objects.create_user('admin-test', 'myemail@test.com', 'password1234')
        client = APIClient()
        client.login(username='admin-test', password='password1234')
        response = client.get('/api/user-status/', {})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'loggedin': True})

    def test_get_user_info(self):
        user = User.objects.create_user('admin-test', 'myemail@test.com', 'password1234')
        client = APIClient()
        client.login(username='admin-test', password='password1234')
        response = client.get('/rest-auth/user/', {})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['username'], 'admin-test')
        self.assertEqual(response.data['pk'], user.id)

    def test_get_user_info_no_auth(self):
        User.objects.create_user('admin-test', 'myemail@test.com', 'password1234')
        client = APIClient()
        response = client.get('/rest-auth/user/', {})
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data, {'detail': 'Authentication credentials were not provided.'})
