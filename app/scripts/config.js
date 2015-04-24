'use strict';

angular.module('tf2App').constant({
    defaultFeedz: [[0,'andrewberg'],[1,'otakugangsta'],[2,'sid766'],[3,'ascout'],[4,'bravecadet'], [5, 'enigmaticsparrow'], [6, 'wiremuse']]
});

angular.module('tf2App').config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('tf2');
});
