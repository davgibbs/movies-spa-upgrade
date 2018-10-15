describe('Hello world', () => {
    it('says hello', () => {
        expect('Hello world!').toEqual('Hello world!');
    });
});


describe('MovieViewController Tests', () => {
    beforeEach(angular.mock.module('movieApp.controllers'));

    let scope; let $httpBackend; let
        controller;

    beforeEach(angular.mock.inject(($rootScope, _$httpBackend_, $controller) => {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        controller = $controller;
        $httpBackend
            .when('GET', '/api/movies/1')
            .respond(200, { title: 'superman', director: 'James Cameron' });
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('get one is correct', () => {
        const stateParams = { id: 1 };
        const AuthService = { isAuthenticated() { return true; }, userId() { return 1; } };
        const AUTH_EVENTS = { logoutSuccess: 'logout', loginSuccess: 'login' };

        controller('MovieViewController', {
            $scope: scope,
            $stateParams: stateParams,
            $httpBackend,
            AuthService,
            AUTH_EVENTS,
        });

        $httpBackend.flush();

        expect(scope.movie).toEqual({ title: 'superman', director: 'James Cameron' });
    });
});


describe('MovieListController Tests', () => {
    beforeEach(angular.mock.module('movieApp.controllers'));

    let scope; let $httpBackend; let
        controller;

    beforeEach(angular.mock.inject(($rootScope, _$httpBackend_, $controller) => {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        controller = $controller;
        $httpBackend
            .when('GET', '/api/movies')
            .respond([{ title: 'superman', director: 'James Cameron' }, { title: 'batman', director: 'Bill Oddy' }]);

        $httpBackend
            .when('DELETE', '/api/movies/2')
            .respond(200, { results: 'success' });
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('get all is correct', () => {
        let mypopupService; let
            window;

        const AuthService = { isAuthenticated() { return true; }, userId() { return 1; } };
        const AUTH_EVENTS = { logoutSuccess: 'logout', loginSuccess: 'login' };
        controller('MovieListController', {
            $scope: scope,
            popupService: mypopupService,
            $window: window,
            $httpBackend,
            AuthService,
            AUTH_EVENTS,
        });

        $httpBackend.flush();

        expect(scope.selectedOrder).toEqual({ id: 'title' });
        expect(scope.order_by_options).toEqual([{ type: 'Title A-Z', id: 'title' }, { type: 'Title Z-A', id: '-title' }, { type: 'Lowest Rating', id: 'rating' }, { type: 'Highest Rating', id: '-rating' }, { type: 'Oldest Release', id: 'release_year' }, { type: 'Newest Release', id: '-release_year' }]);

        expect(scope.movies).toEqual([{ title: 'superman', director: 'James Cameron' }, { title: 'batman', director: 'Bill Oddy' }]);
    });


    it('delete is correct', () => {
        const mypopupService = { showPopup() { return true; } };
        const AuthService = { isAuthenticated() { return true; }, userId() { return 1; } };
        const AUTH_EVENTS = { logoutSuccess: 'logout', loginSuccess: 'login' };

        controller('MovieListController', {
            $scope: scope,
            popupService: mypopupService,
            $httpBackend,
            AuthService,
            AUTH_EVENTS,
        });

        const movie = { id: '2', title: 'Break Away', release_year: '2016' };
        scope.deleteMovie(movie);

        $httpBackend.expectDELETE('/api/movies/2').respond(200, { results: 'success' });
        $httpBackend.expectGET('/api/movies').respond([{ title: 'superman', director: 'James Cameron' }, { title: 'batman', director: 'Bill Oddy' }]);
        $httpBackend.flush();

        expect(scope.movies).toEqual([{ title: 'superman', director: 'James Cameron' }, { title: 'batman', director: 'Bill Oddy' }]);
    });
});

// todo test session timeout

describe('UserViewController Tests', () => {
    beforeEach(angular.mock.module('movieApp.controllers'));

    beforeEach(angular.mock.module('movieApp.services'));

    let $scope; let rootscope; let controller; let
        deferred;

    beforeEach(angular.mock.inject(($rootScope, $controller, _$q_, AuthService) => {
        $scope = $rootScope.$new();
        rootscope = $rootScope.$new();
        controller = $controller;

        deferred = _$q_.defer();
        spyOn(AuthService, 'getUserStatus').and.returnValue(deferred.promise);
        const AUTH_EVENTS = { logoutSuccess: 'logout', loginSuccess: 'login' };

        controller('UserViewController', {
            $scope,
            $rootScope: rootscope,
            AuthService,
            AUTH_EVENTS,
        });
    }));

    it('user is not logged in', () => {
        deferred.resolve({ loggedin: false });

        $scope.$apply();

        expect($scope.loggedIn).toEqual(false);
    });
});

describe('RatingController Tests', () => {
    beforeEach(angular.mock.module('movieApp.controllers'));

    let scope; let
        controller;

    beforeEach(angular.mock.inject(($rootScope, $controller) => {
        scope = $rootScope.$new();
        controller = $controller;
    }));

    it('rating is correct', () => {
        controller('RatingController', {
            $scope: scope,
        });

        scope.hoveringOver(2);

        expect(scope.max).toEqual(5);
        expect(scope.isReadonly).toEqual(false);
        expect(scope.overStar).toEqual(2);
        expect(scope.percent).toEqual(40);
    });
});


describe('MovieCreateController Tests', () => {
    beforeEach(angular.mock.module('movieApp.controllers'));
    let scope; let $httpBackend; let
        controller;

    beforeEach(angular.mock.inject(($rootScope, _$httpBackend_, _$controller_) => {
        controller = _$controller_;
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        $httpBackend
            .when('POST', '/api/movies')
            .respond(200, { id: '1' });

        $httpBackend
            .when('GET', '/api/movies-genres')
            .respond([{ name: 'Action', id: '1' }]);
    }));

    it('create movie is correct', () => {
        const state = { go() {} };
        const AuthService = { userId() { return 9; } };

        controller('MovieCreateController', {
            $scope: scope,
            $state: state,
            $httpBackend,
            AuthService,
        });

        spyOn(state, 'go');
        scope.addMovie();

        $httpBackend.expectPOST('/api/movies');
        // $httpBackend.expectGET('/api/movies-genres');
        $httpBackend.flush();
        // $httpBackend.flush();

        expect(scope.movie).toEqual({ release_year: 2016, rating: 3, genre: '1' });
        expect(scope.genres).toEqual([{ name: 'Action', id: '1' }]);
        expect(state.go).toHaveBeenCalledWith('viewMovie', { id: '1' });
    });
});


describe('NavigationController Tests', () => {
    beforeEach(angular.mock.module('movieApp.controllers'));

    let scope; let
        $controller;

    beforeEach(angular.mock.inject(($rootScope, _$controller_) => {
        scope = $rootScope.$new();
        $controller = _$controller_;
    }));

    it('Nav is correct', () => {
        const AuthService = { isAuthenticated() { return true; } };
        const AUTH_EVENTS = { loginSuccess: 'login', logoutSuccess: 'logout' };
        let $location = {
            path() { return '/movies/1'; },
        };
        const state = { go() {} };

        $controller('NavigationCtrl', {
            $scope: scope,
            $location,
            $state: state,
            AuthService,
            AUTH_EVENTS,
        });

        let currentPage = scope.isCurrentPath('/about');

        expect(currentPage).toEqual(false);
        currentPage = scope.isCurrentPath('/movies');

        expect(currentPage).toEqual(true);

        $location = {
            path() { return '/about'; },
        };
        $controller('NavigationCtrl', {
            $scope: scope,
            $location,
            $state: state,
            AuthService,
            AUTH_EVENTS,
        });

        currentPage = scope.isCurrentPath('/about');

        expect(currentPage).toEqual(true);
        currentPage = scope.isCurrentPath('/movies');

        expect(currentPage).toEqual(false);
    });
});


describe('MovieEditController Tests', () => {
    beforeEach(angular.mock.module('movieApp.controllers'));

    let scope; let $httpBackend; let
        $controller;

    beforeEach(angular.mock.inject(($rootScope, _$httpBackend_, _$controller_) => {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        scope.movie = {
            myFile: 'blah', director: 'me', summary: 'sum', id: '1',
        };
        $controller = _$controller_;
        $httpBackend
            .when('PUT', '/api/movies/1')
            .respond(200, { id: '1' });

        $httpBackend
            .when('GET', '/api/movies-genres')
            .respond(200, [{ name: 'Action', id: '1' }]);

        $httpBackend
            .when('GET', '/api/movies/1')
            .respond(200, { id: '1', name: 'mymovie' });
    }));

    it('edit movie is correct', () => {
        const state = { go() {} };
        const stateParams = { id: 1 };
        const AuthService = { userId() { return 9; } };

        $controller('MovieEditController', {
            $scope: scope,
            $state: state,
            $stateParams: stateParams,
            $httpBackend,
            AuthService,
        });

        spyOn(state, 'go');
        scope.updateMovie();

        $httpBackend.expectPUT('/api/movies/1');
        // $httpBackend.expectGET('/api/movies-genres');
        $httpBackend.flush();
        // $httpBackend.flush();

        expect(scope.movie).toEqual({ id: '1', name: 'mymovie' });
        expect(scope.genres).toEqual([{ name: 'Action', id: '1' }]);
        expect(state.go).toHaveBeenCalledWith('viewMovie', { id: '1' });
    });
});
