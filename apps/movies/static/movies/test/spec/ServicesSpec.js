describe('PopupService Tests', () => {
    beforeEach(angular.mock.module('movieApp.services',
        // mock the window dependency
        ($provide) => {
            $provide.factory('$window', () => {
                const windowmock = jasmine.createSpy('$window');
                windowmock.confirm = function windowmockConfirm() { return true; };
                return windowmock;
            });
        }));

    let popupService;

    beforeEach(angular.mock.inject((_popupService_) => {
        popupService = _popupService_;
    }));

    it('show popup true', () => {
        expect(angular.isFunction(popupService.showPopup)).toBe(true);
        const result = popupService.showPopup('hello');

        expect(result).toBe(true);
    });
});

describe('Session Tests', () => {
    beforeEach(angular.mock.module('movieApp.services'));

    let Session;

    beforeEach(angular.mock.inject((_Session_) => {
        Session = _Session_;
    }));

    it('session true', () => {
        expect(angular.isFunction(Session.create)).toBe(true);
        Session.create(11, 'username');

        expect(Session.userId).toBe(11);
        expect(Session.userName).toBe('username');

        Session.destroy();

        expect(Session.userId).toBe(null);
        expect(Session.userName).toBe(null);
    });
});

describe('AuthService Tests', () => {
    beforeEach(angular.mock.module('movieApp.services',
        // mock the window dependency
        ($provide) => {
            $provide.factory('Session', () => {
                const sessionmock = jasmine.createSpy('Session');
                sessionmock.userName = 'test-user';
                sessionmock.userId = 1;
                sessionmock.create = function sessionmockCreate() {};
                return sessionmock;
            });
        }));

    let AuthService; let
        httpBackend;

    beforeEach(angular.mock.inject((_AuthService_, $httpBackend) => {
        AuthService = _AuthService_;
        httpBackend = $httpBackend;
    }));


    it('is authenticated', () => {
        expect(angular.isFunction(AuthService.isAuthenticated)).toBe(true);
        const authenticated = AuthService.isAuthenticated();

        expect(authenticated).toBe(true);

        const username = AuthService.username();

        expect(username).toBe('test-user');

        const userid = AuthService.userId();

        expect(userid).toBe(1);
    });

    it('get user is sucessful', () => {
        expect(angular.isFunction(AuthService.getUser)).toBe(true);

        httpBackend
            .when('GET', '/rest-auth/user/')
            .respond(200, { pk: 1, username: 'user99' });

        AuthService.getUser().then((data) => {
            expect(data).toEqual({ pk: 1, username: 'user99' });
        });
        httpBackend.flush();
    });
});
