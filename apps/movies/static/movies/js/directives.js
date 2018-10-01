'use strict';

angular.module('movieApp.directives', []).directive('fileModel', ['$parse', function($parse) {
    // restict to Attribute values
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]).directive('simpleNavbar', function () {
    return {
        restrict: 'E',
        template: require("../partials/navbar.html"),
    };
});