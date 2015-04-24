'use strict';

angular.module('tf2App').service('tumblrService', function ($http, $q) {

    this.getFeeds = function(feeds, offset) {
        var feedUrls = [];
        angular.forEach(feeds, function(value){
            feedUrls.push($http.jsonp('http://' + value[1] + '.tumblr.com/api/read/json?callback=JSON_CALLBACK&num=50&type=photo&start=' + offset));
        });
        return $q.all(feedUrls);
    };
});
