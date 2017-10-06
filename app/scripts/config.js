'use strict';

angular.module('tf2App').constant({
    defaultFeeds: [[0,'andrewberg'],[1,'otakugangsta'],[2,'sid766'],[3,'bravecadet'], [4, 'enigmaticsparrow'], [5, 'wiremuse'],[6, '4nt1r34l']]
});

angular.module('tf2App').config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('tf2');
});
