'use strict';

require('angular');
require('@uirouter/angularjs');
require('angular-ui-bootstrap');
require('angular-utils-pagination/dirPagination.js');

require('./controllers');
require('./services');
require('./directives');

require('../css/app.css');

var app = angular.module('movieApp', ['ui.router', 'ui.bootstrap', 'movieApp.controllers', 'movieApp.services', 'movieApp.directives']);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$interpolateProvider', function($stateProvider, $urlRouterProvider, $httpProvider, $interpolateProvider) {

        $stateProvider.
        state('movies', {
            url: '/movies',
            template: require("../partials/movies.html"),
            controller: 'MovieListController'
        }).state('viewMovie', {
            url: '/movies/:id/view',
            template: require("../partials/movie-view.html"),
            controller: 'MovieViewController'
        }).state('newMovie', {
            url: '/movies/new',
            template: require("../partials/movie-add.html"),
            controller: 'MovieCreateController'
        }).state('editMovie', {
            url: '/movies/:id/edit',
            template: require("../partials/movie-edit.html"),
            controller: 'MovieEditController'
        }).state('about', {
            url: '/about',
            template: require("../partials/about.html"),
        }).state('login', {
            url: '/login',
            template: require("../partials/login.html"),
            controller: 'LoginController'
        });

        // For any unmatched url, redirect to /movies
        $urlRouterProvider.otherwise('/movies');

        // django and angular both support csrf tokens. This tells angular which cookie to add to what header.
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
        notAuthorized: 'auth-not-authorized'
    });
