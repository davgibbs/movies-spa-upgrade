require('angular');
require('@uirouter/angularjs');
require('angular-ui-bootstrap');
require('angular-utils-pagination/dirPagination.js');

require('./controllers');
require('./services');
require('./directives');

require('../css/app.css');

const moviesHtml = require('../partials/movies.html');
const movieViewHtml = require('../partials/movie-view.html');
const movieAddHtml = require('../partials/movie-add.html');
const movieEditHtml = require('../partials/movie-edit.html');
const aboutHtml = require('../partials/about.html');
const loginHtml = require('../partials/login.html');

const app = angular.module('movieApp', ['ui.router', 'ui.bootstrap', 'movieApp.controllers', 'movieApp.services',
    'movieApp.directives']);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$interpolateProvider',
    function setState($stateProvider, $urlRouterProvider, $httpProvider, $interpolateProvider) {
        $stateProvider.state('movies', {
            url: '/movies',
            template: moviesHtml,
            controller: 'MovieListController',
        }).state('viewMovie', {
            url: '/movies/:id/view',
            template: movieViewHtml,
            controller: 'MovieViewController',
        }).state('newMovie', {
            url: '/movies/new',
            template: movieAddHtml,
            controller: 'MovieCreateController',
        }).state('editMovie', {
            url: '/movies/:id/edit',
            template: movieEditHtml,
            controller: 'MovieEditController',
        })
            .state('about', {
                url: '/about',
                template: aboutHtml,
            })
            .state('login', {
                url: '/login',
                template: loginHtml,
                controller: 'LoginController',
            });

        // For any unmatched url, redirect to /movies
        $urlRouterProvider.otherwise('/movies');

        // django and angular both support csrf tokens. This tells angular which
        // cookie to add to what header.
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';

        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    }])
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized',
    });
