const navbarHtml = require('../partials/navbar.html');

angular.module('movieApp.directives', []).directive('fileModel', ['$parse', function fileModel($parse) {
    // restrict to Attribute values
    return {
        restrict: 'A',
        link(scope, element, attrs) {
            const model = $parse(attrs.fileModel);
            const modelSetter = model.assign;

            element.bind('change', () => {
                scope.$apply(() => {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        },
    };
}]).directive('simpleNavbar', () => ({
    restrict: 'E',
    template: navbarHtml,
}));
