'use strict';

angular.module('movieApp.services', [])
    .service('popupService', function($window) {
        this.showPopup = function(message) {
            return $window.confirm(message);
        };
    })
    .factory('AuthService', function($http, Session) {
        var authService = {};

        authService.login = function(credentials) {
            return $http({
                    method: 'POST',
                    url: '/rest-auth/login/',
                    data: JSON.stringify(credentials),
                })
                .then(function(res) {
                    return res.data;
                });
        };

        authService.getUserStatus = function() {
            // Used on initial load of the app to get the user status (logged in or not)
            return $http({
                    method: 'GET',
                    url: '/api/user-status/',
                })
                .then(function(res) {
                    return res.data;
                });
        };

        authService.getUser = function() {
            // Used to get user details from backend such as ID and username, and set the session
            return $http({
                    method: 'GET',
                    url: '/rest-auth/user/',
                })
                .then(function(res) {
                    Session.create(res.data.pk, res.data.username);
                    return res.data;
                });
        };

        authService.isAuthenticated = function() {
            return !!Session.userId;
        };

        authService.username = function() {
            return Session.userName;
        };

        authService.userId = function() {
            return Session.userId;
        };

        authService.logout = function() {
            return $http({
                    method: 'POST',
                    url: '/rest-auth/logout/',
                })
                .then(function() {
                    Session.destroy();
                });
        };

        return authService;
    })
    .service('Session', function() {
        // Stores the user id and the user name.
        this.create = function(userId, userName) {
            this.userId = userId;
            this.userName = userName;
        };
        this.destroy = function() {
            this.userId = null;
            this.userName = null;
        };
    });