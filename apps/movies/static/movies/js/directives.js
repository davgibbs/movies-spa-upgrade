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
        templateUrl: 'app/modules/navbar/navbar.html',
        controller: function($scope, $location) {
            $scope.isActive = function(path){
                var currentPath = $location.path().split('/')[1];
                if (currentPath.indexOf('?') !== -1) {
                    currentPath = currentPath.split('?')[0];
                }
                return currentPath === path.split('/')[1];
            };
        },
    };
});