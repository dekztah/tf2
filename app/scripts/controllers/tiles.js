'use strict';

angular.module('tf2App').controller('TilesCtrl', function ($scope, $document, $http, $q, localStorageService, $location, defaultFeedz, tumblrService, helperService) {

    $scope.storedToken = true;
    var searchObj = $location.path().replace('/', ''),
        storageKey = searchObj || 'tumblrUrls',
        urlIndex;

    var getStoredUrls = function() {
        $scope.storedUrls = localStorageService.get(storageKey) || defaultFeedz;
        updateSettings();
    };

    var setStoredUrls = function() {
        localStorageService.add(storageKey, $scope.storedUrls);
        updateSettings();
    };

    var updateSettings = function() {
        urlIndex = $scope.storedUrls.length;
        $scope.page = {
            previous: false,
            start: 0
        };
    };

    $scope.tumblrUrl = {
        name: ''
    };

    $scope.loading = false;
    getStoredUrls();

    $scope.addUrl = function() {
        var alreadyStored = false;
        angular.forEach($scope.storedUrls, function(item) {
            if (item[1] === $scope.tumblrUrl.name) {
                alreadyStored = true;
            }
        });
        if (alreadyStored === false) {
            $http.jsonp('http://' + $scope.tumblrUrl.name + '.tumblr.com/api/read/json?callback=JSON_CALLBACK&num=0').success(function() {
                $scope.storedUrls.push([urlIndex, $scope.tumblrUrl.name]);
                urlIndex++;
                $scope.tumblrUrl.name = '';
                setStoredUrls();
                $scope.multipleFetch();
            }).error(function() {
                $scope.tumblrUrl.name = '';
                $scope.error = 404;
            });
        }
    };

    $scope.removeUrl = function(url) {
        var postsToKeep = [];
        angular.forEach($scope.storedUrls, function(item, index) {
            if (item[1] === url[1]) {
                $scope.storedUrls.splice(index, 1);
            }
        });
        if ($scope.posts) {
            angular.forEach($scope.posts, function(post){
                if (post.site[1] !== url[1]) {
                    postsToKeep.push(post);
                }
            });
        }
        $scope.posts = postsToKeep;
        setStoredUrls();
    };
    $scope.highlight = function(url, value) {
        if ($scope.posts) {
            angular.forEach($scope.posts, function(post){
                if (post.site[1] === url[1]) {
                    post.highlight = value;
                } else {
                    post.dim = value;
                }
            });
        }
    };

    $scope.deleteHighlight = function(url, value) {
        if ($scope.posts) {
            angular.forEach($scope.posts, function(post){
                if (post.site[1] === url[1]) {
                    post.deleteHighlight = value;
                } else {
                    // post.highlight = value;
                }
            });
        }
    };

    $scope.multipleFetch = function(offset) {
        $scope.error = '';
        $scope.loading = true;
        $scope.posts = [];

        if (offset) {
            $scope.page = {
                previous: $scope.page.start,
                start: offset
            };
        } else {
            $scope.page.start = 0;
        }
        tumblrService.getFeeds($scope.storedUrls, offset).then(function(results){
            var newDate = new Date().getTime();
            $scope.loading = false;
            $scope.lastFetch = localStorageService.get(storageKey + '.lastFetch');
            localStorageService.add(storageKey + '.lastFetch', newDate);
            angular.forEach(results, function(result, index){
                angular.forEach(result.data.posts, function(post){
                    // post.date = helperService.customDate(post['date-gmt'], 'MMMM DD YYYY | HH:mm');
                    post.date = helperService.customDate(post.date, 'ago');
                    post.site = $scope.storedUrls[index];
                    $scope.posts.push(post);
                });
            });
            $scope.posts.sort(helperService.compare);
        }, function() {
            $scope.loading = false;
            $scope.error = 'Unable to perform request';
        });
    };
});
