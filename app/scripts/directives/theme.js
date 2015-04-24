'use strict';

angular.module('tf2App').directive('theme', function (localStorageService) {
    return {
        restrict: 'A',
        link: function($scope) {

            $scope.theme = localStorageService.get('theme') || {white: false};

            $scope.changeTheme = function(theme) {
                $scope.theme.white = theme;
                localStorageService.set('theme', $scope.theme);
            };
        }
    };
});
