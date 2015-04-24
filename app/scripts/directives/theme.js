'use strict';

angular.module('tf2App').directive('theme', function (localStorageService) {
    return {
        restrict: 'A',
        link: function($scope) {

            $scope.theme = localStorageService.get('theme') || {bgr: 'default', color: 'light'};

            $scope.changeTheme = function(theme, scheme) {
                if (scheme) {
                    $scope.theme.color = theme;
                } else {
                    $scope.theme.bgr = theme;
                }
                localStorageService.set('theme', $scope.theme);
            };
        }
    };
});
