'use strict';

angular.module('tf2App').service('helperService', function ($window) {
    var moment = $window.moment;
    var tumblrDate = 'YYYY-MM-DD HH:mm:ss ZZZ';

    this.compare = function(a,b) {
        if (a['unix-timestamp'] < b['unix-timestamp']) {
            return 1;
        }
        if (a['unix-timestamp'] > b['unix-timestamp']) {
            return -1;
        }
        return 0;
    };

    this.customDate = function(date, format) {
        if (format === 'ago') {
            return moment.utc(date, tumblrDate).fromNow();
        } else {
            return moment.utc(date, tumblrDate).format(format);
        }
    };
});
