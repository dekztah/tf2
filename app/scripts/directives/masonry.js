'use strict';

angular.module('tf2App').directive('masonry', function ($window, $anchorScroll, $timeout, $rootScope) {
    function masonry($scope, element, attrs) {
        var Masonry = $window.Masonry,
            imagesLoaded = $window.imagesLoaded,
            masonryTiles = new Masonry(element[0], {
                itemSelector: '.tile',
                transitionDuration: '0.3s'
            }),
            oldValue = 0;

        var masonryUpdate = function() {
            masonryTiles.reloadItems();
            masonryTiles.layout();
        };

        attrs.$observe('masonry', function(value){
            if (value === '0') {
                $rootScope.imagesLoaded = false;
                $rootScope.loadedImageCount = 0;
            }
            if (value > 0 && oldValue === '0') {
                $timeout(function(){
                    var imgLoad = imagesLoaded(element[0]);
                    imgLoad.on('always', function(){
                        masonryUpdate();
                        $scope.$apply(function(){
                            $rootScope.imagesLoaded = true;
                        });
                        $anchorScroll();
                    });
                    imgLoad.on('progress', function(imgLoad, image){
                        image.img.parentNode.className = image.isLoaded ? '' : 'is-broken';
                        $scope.$apply(function(){
                            $rootScope.loadedImageCount++;
                        });
                    });
                }, 0);
            } else {
                $timeout(function(){
                    masonryUpdate();
                }, 0);
            }
            oldValue = value;
        });
    }

    return {
        restrict: 'A',
        link: masonry
    };
});
