angular.module('movieApp.services', [])
    .service('popupService', ['$window', function popupService($window) {
        this.showPopup = function showPopup(message) {
            return $window.confirm(message);
        };
    }])
    .factory('AuthService', ['$http', 'Session', function AuthService($http, Session) {
        const authService = {};

        authService.login = function login(credentials) {
            return $http({
                method: 'POST',
                url: '/rest-auth/login/',
                data: JSON.stringify(credentials),
            })
                .then(res => res.data);
        };

        authService.getUserStatus = function getUserStatus() {
            // Used on initial load of the app to get the user status (logged in or not)
            return $http({
                method: 'GET',
                url: '/api/user-status/',
            })
                .then(res => res.data);
        };

        authService.getUser = function getUser() {
            // Used to get user details from backend such as ID and username, and set the session
            return $http({
                method: 'GET',
                url: '/rest-auth/user/',
            })
                .then((res) => {
                    Session.create(res.data.pk, res.data.username);
                    return res.data;
                });
        };

        authService.isAuthenticated = function isAuthenticated() {
            return !!Session.userId;
        };

        authService.username = function username() {
            return Session.userName;
        };

        authService.userId = function userId() {
            return Session.userId;
        };

        authService.logout = function logout() {
            return $http({
                method: 'POST',
                url: '/rest-auth/logout/',
            })
                .then(() => {
                    Session.destroy();
                });
        };

        return authService;
    }])
    .service('Session', function Session() {
        // Stores the user id and the user name.
        this.create = function create(userId, userName) {
            this.userId = userId;
            this.userName = userName;
        };
        this.destroy = function destroy() {
            this.userId = null;
            this.userName = null;
        };
    });
