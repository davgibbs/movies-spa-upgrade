'use strict';

angular.module('movieApp.controllers', ['angularUtils.directives.dirPagination'])
    .controller('MovieListController', function($scope, popupService, $http, AuthService, AUTH_EVENTS) {

        $scope.movies = [];

        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.userId = AuthService.userId();
        $scope.$on(AUTH_EVENTS.loginSuccess, function() {
            $scope.loggedIn = true;
            $scope.userId = AuthService.userId();
        });
        $scope.$on(AUTH_EVENTS.logoutSuccess, function() {
            $scope.loggedIn = false;
            $scope.userId = null;
        });

        $scope.order_by_options = [{
            type: 'Title A-Z',
            id: 'title'
        }, {
            type: 'Title Z-A',
            id: '-title'
        }, {
            type: 'Lowest Rating',
            id: 'rating'
        }, {
            type: 'Highest Rating',
            id: '-rating'
        }, {
            type: 'Oldest Release',
            id: 'release_year'
        }, {
            type: 'Newest Release',
            id: '-release_year'
        }];
        // Default order is by title
        $scope.selectedOrder = {
            id: 'title'
        };

        // Ajax request to fetch data into movies
        $scope.loadMovies = function() {
            $http.get("/api/movies").then(
                function successCallback(response) {
                    $scope.movies = response.data;
                });
        };

        $scope.loadMovies();

        $scope.deleteMovie = function(movie) {
            if (popupService.showPopup('Really delete "' + movie.title + ' (' + movie.release_year + ')"?')) {
                $http.delete("/api/movies/" + movie.id)
                    .then(function successCallback() {
                        $scope.loadMovies();
                    }, function errorCallback(response) {
                        if (response.status == 403) {
                            alert('Not authorised to delete');
                        } else {
                            alert('Unexpected error ' + JSON.stringify(response));
                        }
                    });
            }
        };

    }).controller('MovieViewController', function($scope, $stateParams, $http, AuthService, AUTH_EVENTS) {

        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.userId = AuthService.userId();
        $scope.$on(AUTH_EVENTS.loginSuccess, function() {
            $scope.loggedIn = true;
            $scope.userId = AuthService.userId();
        });
        $scope.$on(AUTH_EVENTS.logoutSuccess, function() {
            $scope.loggedIn = false;
            $scope.userId = null;
        });

        $http.get("/api/movies/" + $stateParams.id)
            .then(function successCallback(response) {
                $scope.movie = response.data;
            });

    }).controller('MovieCreateController', function($scope, $state, $http, AuthService) {

        $scope.movie = {};

        // Default values
        $scope.movie.release_year = 2016;
        $scope.movie.rating = 3;

        $scope.genres = [];
        $http.get("/api/movies-genres")
            .then(function successCallback(response) {
                $scope.genres = response.data;

                // Set the default genre as the first returned
                $scope.movie.genre = response.data[0].id;
            });

        $scope.addMovie = function() {

            var file = ($scope.movie.myFile === undefined ? '' : $scope.movie.myFile);
            var director = ($scope.movie.director === undefined ? '' : $scope.movie.director);
            var summary = ($scope.movie.summary === undefined ? '' : $scope.movie.summary);

            var fd = new FormData();
            fd.append('image', file);
            fd.append('director', director);
            fd.append('release_year', $scope.movie.release_year);
            fd.append('title', $scope.movie.title);
            fd.append('summary', summary);
            fd.append('genre', $scope.movie.genre);
            fd.append('rating', $scope.movie.rating);
            fd.append('user', AuthService.userId());

            $http.post("/api/movies", fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(function successCallback(response) {
                $state.go('viewMovie', {
                    id: response.data.id
                });
            }, function errorCallback(response) {
                alert('Issue adding movie: ' + JSON.stringify(response.data));
            });
        };

    }).controller('MovieEditController', function($scope, $state, $stateParams, $http, AuthService) {

        $scope.updateMovie = function() {

            var file = ($scope.movie.myFile === undefined ? '' : $scope.movie.myFile);
            var director = ($scope.movie.director === undefined ? '' : $scope.movie.director);
            var summary = ($scope.movie.summary === undefined ? '' : $scope.movie.summary);

            var fd = new FormData();
            fd.append('image', file);
            fd.append('director', director);
            fd.append('release_year', $scope.movie.release_year);
            fd.append('title', $scope.movie.title);
            fd.append('summary', summary);
            fd.append('genre', $scope.movie.genre);
            fd.append('rating', $scope.movie.rating);
            fd.append('user', AuthService.userId());

            $http.put("/api/movies/" + $scope.movie.id, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .then(function successCallback() {
                    $state.go('viewMovie', {
                        id: $scope.movie.id
                    });
                }, function errorCallback(response) {
                    alert('Issue editing movie: ' + JSON.stringify(response.data));
                });

        };

        $scope.genres = [];
        $http.get("/api/movies-genres")
            .then(function successCallback(response) {
                $scope.genres = response.data;
            });

        $scope.loadMovie = function() {
            $http.get("/api/movies/" + $stateParams.id)
                .then(function successCallback(response) {
                    $scope.movie = response.data;
                });
        };

        $scope.loadMovie();

    }).controller('NavigationCtrl', function($scope, $rootScope, $location, $state, AuthService, AUTH_EVENTS) {

        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.$on(AUTH_EVENTS.loginSuccess, function() {
            $scope.loggedIn = true;
        });
        $scope.$on(AUTH_EVENTS.logoutSuccess, function() {
            $scope.loggedIn = false;
        });

        $scope.isCurrentPath = function(path) {
            // Not using $location.path().startsWith(path); as not supported in all browsers (phantomjs)
            // http://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string
            return ($location.path().substr(0, path.length) == path);
        };

        $scope.logout = function($event) {
            $event.preventDefault();
            AuthService.logout()
                .then(function successCallback() {
                    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                    $state.go('movies', {});
                });
        };

    }).controller('RatingController', function($scope) {
        $scope.max = 5;
        $scope.isReadonly = false;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };
    }).controller('UserViewController', function($scope, $rootScope, AuthService, AUTH_EVENTS) {

        AuthService.getUserStatus()
            .then(function successCallback(data) {
                $scope.loggedIn = data.loggedin;
                if ($scope.loggedIn === true) {
                    AuthService.getUser()
                        .then(function successCallback() {
                            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                        });
                }
            });

        $scope.$on(AUTH_EVENTS.loginSuccess, function() {
            $scope.userName = AuthService.username();
        });
        $scope.$on(AUTH_EVENTS.logoutSuccess, function() {
            $scope.userName = null;
        });

    }).controller('LoginController', function($scope, $rootScope, $state, AuthService, AUTH_EVENTS) {
        $scope.credentials = {
            username: '',
            password: ''
        };
        $scope.loginError = '';

        $scope.login = function(credentials) {
            $scope.loginError = '';
            AuthService.login(credentials)
                .then(function successCallback() {
                    AuthService.getUser()
                        .then(function successCallback() {
                            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                            $state.go('movies', {});
                        });
                }, function errorCallback(message) {
                    console.log(message)
                    $scope.loginError = message.data.non_field_errors[0];
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                });
        };

    });
