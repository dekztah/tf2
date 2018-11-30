'use strict';

angular.module('tf2App').service('tumblrService', function ($http, $q, $sce) {

    this.getFeeds = function(feeds, offset) {
        var feedUrls = [];
        angular.forEach(feeds, function(value){
            var url = 'http://' + value[1] + '.tumblr.com/api/read/json?num=50&type=photo&start=' + offset;
            url = $sce.trustAsResourceUrl(url);
            feedUrls.push($http.jsonp(url));
        });
        return $q.all(feedUrls);
    };
});
