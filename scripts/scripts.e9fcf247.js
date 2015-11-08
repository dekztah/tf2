"use strict";angular.module("tf2App",["LocalStorageModule"]),angular.module("tf2App").service("helperService",["$window",function(a){var b=a.moment,c="YYYY-MM-DD HH:mm:ss ZZZ";this.compare=function(a,b){return a["unix-timestamp"]<b["unix-timestamp"]?1:a["unix-timestamp"]>b["unix-timestamp"]?-1:0},this.customDate=function(a,d){return"ago"===d?b.utc(a,c).fromNow():b.utc(a,c).format(d)}}]),angular.module("tf2App").service("tumblrService",["$http","$q",function(a,b){this.getFeeds=function(c,d){var e=[];return angular.forEach(c,function(b){e.push(a.jsonp("http://"+b[1]+".tumblr.com/api/read/json?callback=JSON_CALLBACK&num=50&type=photo&start="+d))}),b.all(e)}}]),angular.module("tf2App").directive("theme",["localStorageService",function(a){return{restrict:"A",link:function(b){b.theme=a.get("theme")||{white:!1},b.changeTheme=function(c){b.theme.white=c,a.set("theme",b.theme)}}}}]),angular.module("tf2App").controller("TilesCtrl",["$scope","$http","localStorageService","$location","defaultFeeds","tumblrService","helperService",function(a,b,c,d,e,f,g){var h,i=d.path().replace("/",""),j=i||"tumblrUrls",k=c.get("deletedUrlIndexes")||[],l=function(){a.storedUrls=c.get(j)||e,n()},m=function(){c.add(j,a.storedUrls),n()},n=function(){a.page={previous:!1,start:0}};a.tumblrUrl={name:""},a.loading=!1,l(),a.addUrl=function(){var d=!1;angular.forEach(a.storedUrls,function(b){b[1]===a.tumblrUrl.name&&(d=!0)}),d===!1&&b.jsonp("http://"+a.tumblrUrl.name+".tumblr.com/api/read/json?callback=JSON_CALLBACK&num=0").success(function(){k[0]?(h=k[0],k.splice(0,1),c.set("deletedUrlIndexes",k)):h=a.storedUrls.length,a.storedUrls.push([h,a.tumblrUrl.name]),a.tumblrUrl.name="",m(),a.multipleFetch()}).error(function(){a.tumblrUrl.name="",a.error=404})},a.removeUrl=function(b){var d=[];angular.forEach(a.storedUrls,function(d,e){d[1]===b[1]&&(a.storedUrls.splice(e,1),k.push(d[0]),c.set("deletedUrlIndexes",k))}),a.posts&&angular.forEach(a.posts,function(a){a.site[1]!==b[1]&&d.push(a)}),a.posts=d,m()},a.highlight=function(b,c){a.posts&&angular.forEach(a.posts,function(a){a.site[1]===b[1]?a.highlight=c:a.dim=c})},a.deleteHighlight=function(b,c){a.posts&&angular.forEach(a.posts,function(a){a.site[1]===b[1]&&(a.deleteHighlight=c)})},a.multipleFetch=function(b){a.error="",a.loading=!0,a.posts=[],b?a.page={previous:a.page.start,start:b}:a.page.start=0,f.getFeeds(a.storedUrls,b).then(function(b){var d=(new Date).getTime();a.loading=!1,a.lastFetch=c.get(j+".lastFetch"),c.add(j+".lastFetch",d);for(var e=0;e<b.length;e++)for(var f=0;f<b[e].data.posts.length;f++){var h=b[e].data.posts[f];h.date=g.customDate(h["date-gmt"],"ago"),h.site=a.storedUrls[e],a.posts.push(h)}a.posts.sort(g.compare)},function(){a.loading=!1,a.error="Unable to perform request"})}}]),angular.module("tf2App").directive("masonry",["$window","$anchorScroll","$timeout","$rootScope",function(a,b,c,d){function e(e,f,g){var h=a.Masonry,i=a.imagesLoaded,j=new h(f[0],{itemSelector:".tile",transitionDuration:"0.3s"}),k=0,l=function(){j.reloadItems(),j.layout()};g.$observe("masonry",function(a){"0"===a&&(d.imagesLoaded=!1,d.loadedImageCount=0),a>0&&"0"===k?c(function(){var a=i(f[0]);a.on("done",function(){l(),e.$apply(function(){d.imagesLoaded=!0}),b()}),a.on("progress",function(){e.$apply(function(){d.loadedImageCount++})})},0):c(function(){l()},0),k=a})}return{restrict:"A",link:e}}]);