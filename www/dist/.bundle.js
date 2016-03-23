(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"D:\\advn_projects\\ionic\\shop\\www\\js\\app-main.js":[function(require,module,exports){
'use strict';
function AppMain($ionicPlatform){
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
}

module.exports = ['$ionicPlatform', AppMain];
},{}],"D:\\advn_projects\\ionic\\shop\\www\\js\\app.js":[function(require,module,exports){
require('./modules/playlists/playlists');
var login = require('./modules/login/login');
require('./modules/menu/menu');
require('./layout/home/home');

login.LoginController;
module.export = angular.module('starter', ['ionic',
    'menu',
    'login',
    'playlists',
    'home'])
.config(require('./router'))
.run(require('./app-main'));
},{"./app-main":"D:\\advn_projects\\ionic\\shop\\www\\js\\app-main.js","./layout/home/home":"D:\\advn_projects\\ionic\\shop\\www\\js\\layout\\home\\home.js","./modules/login/login":"D:\\advn_projects\\ionic\\shop\\www\\js\\modules\\login\\login.js","./modules/menu/menu":"D:\\advn_projects\\ionic\\shop\\www\\js\\modules\\menu\\menu.js","./modules/playlists/playlists":"D:\\advn_projects\\ionic\\shop\\www\\js\\modules\\playlists\\playlists.js","./router":"D:\\advn_projects\\ionic\\shop\\www\\js\\router.js"}],"D:\\advn_projects\\ionic\\shop\\www\\js\\layout\\home\\home-controller.js":[function(require,module,exports){
'use strict';


function HomeController($scope) {

//    // Triggered in the login modal to close it
//    $scope.closeLogin = function() {
//        $scope.modal.hide();
//    };

    // Open the login modal
    $rootScope.$emit("CallParentMethod", {});
    $scope.homeAlert = function(){
        alert("home");
    }
}

module.exports = ['$scope', HomeController];
},{}],"D:\\advn_projects\\ionic\\shop\\www\\js\\layout\\home\\home.js":[function(require,module,exports){
'use strict';

module.exports = angular.module('home', [])
    .controller('HomeController', require('./home-controller'));

},{"./home-controller":"D:\\advn_projects\\ionic\\shop\\www\\js\\layout\\home\\home-controller.js"}],"D:\\advn_projects\\ionic\\shop\\www\\js\\modules\\login\\login-controller.js":[function(require,module,exports){
'use strict';

function LoginController($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
//    $scope.homeAlert();
    // Form data for the login modal
    $rootScope.$on("CallParentMethod", function(){
        $scope.login();
    });

    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('js/modules/login/login.html', {
        scope: $scope
    }).then(function(modal) {
            $scope.modal = modal;
        });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
}
module.exports = ['$scope', '$ionicModal', '$timeout', LoginController];
},{}],"D:\\advn_projects\\ionic\\shop\\www\\js\\modules\\login\\login.js":[function(require,module,exports){
'use strict';

module.exports = angular.module('login', [])
    .controller('LoginController', require('./login-controller'));

},{"./login-controller":"D:\\advn_projects\\ionic\\shop\\www\\js\\modules\\login\\login-controller.js"}],"D:\\advn_projects\\ionic\\shop\\www\\js\\modules\\menu\\menu.js":[function(require,module,exports){
'use strict';

module.exports = angular.module('menu', []);
},{}],"D:\\advn_projects\\ionic\\shop\\www\\js\\modules\\playlists\\playlists-controller.js":[function(require,module,exports){
'use strict';

function PlaylistsController($scope) {
    $scope.playlists = [
        { title: 'Reggae', id: 1 },
        { title: 'Chill', id: 2 },
        { title: 'Dubstep', id: 3 },
        { title: 'Indie', id: 4 },
        { title: 'Rap', id: 5 },
        { title: 'Cowbell', id: 6 }
    ];
}

module.exports = ['$scope', PlaylistsController];
},{}],"D:\\advn_projects\\ionic\\shop\\www\\js\\modules\\playlists\\playlists.js":[function(require,module,exports){
'use strict';

module.exports = angular.module("playlists", [])
    .controller("PlaylistsController", require("./playlists-controller"));

},{"./playlists-controller":"D:\\advn_projects\\ionic\\shop\\www\\js\\modules\\playlists\\playlists-controller.js"}],"D:\\advn_projects\\ionic\\shop\\www\\js\\router.js":[function(require,module,exports){
'use strict';


module.exports = ['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('app/home');
        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "js/modules/menu/menu.html",
                controller: 'LoginController as loginController'
            })

            .state('app.home', {
                url: "/home",
                views: {
                    'menuContent': {
                        templateUrl: "js/layout/home/home.html",
                        controller: 'HomeController as homeController'
                    }
                }
            })

            .state('app.search', {
                url: "/search",
                views: {
                    'menuContent': {
                        templateUrl: "js/modules/search/search.html"
                    }
                }
            })

            .state('app.browse', {
                url: "/browse",
                views: {
                    'menuContent': {
                        templateUrl: "js/modules/browse/browse.html"
                    }
                }
            })
            .state('app.playlists', {
                url: "/playlists",
                views: {
                    'menuContent': {
                        templateUrl: "js/modules/playlists/playlists.html",
                        controller: 'PlaylistsController as playlistsController'
                    }
                }
            })

            .state('app.single', {
                url: "/playlists/:playlistId",
                views: {
                    'menuContent': {
                        templateUrl: "js/modules/playlists/playlist.html",
                        controller: 'PlaylistController as playlistController'
                    }
                }
            })

        ;
    }
];
},{}]},{},["D:\\advn_projects\\ionic\\shop\\www\\js\\app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcC93d3cvanMvYXBwLW1haW4uanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3Avd3d3L2pzL2FwcC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcC93d3cvanMvbGF5b3V0L2hvbWUvaG9tZS1jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wL3d3dy9qcy9sYXlvdXQvaG9tZS9ob21lLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wL3d3dy9qcy9tb2R1bGVzL2xvZ2luL2xvZ2luLWNvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3Avd3d3L2pzL21vZHVsZXMvbG9naW4vbG9naW4uanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3Avd3d3L2pzL21vZHVsZXMvbWVudS9tZW51LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wL3d3dy9qcy9tb2R1bGVzL3BsYXlsaXN0cy9wbGF5bGlzdHMtY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcC93d3cvanMvbW9kdWxlcy9wbGF5bGlzdHMvcGxheWxpc3RzLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wL3d3dy9qcy9yb3V0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XHJcbmZ1bmN0aW9uIEFwcE1haW4oJGlvbmljUGxhdGZvcm0pe1xyXG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxyXG4gICAgICAgIC8vIGZvciBmb3JtIGlucHV0cylcclxuICAgICAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZCkge1xyXG4gICAgICAgICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xyXG4gICAgICAgICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuZGlzYWJsZVNjcm9sbCh0cnVlKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XHJcbiAgICAgICAgICAgIC8vIG9yZy5hcGFjaGUuY29yZG92YS5zdGF0dXNiYXIgcmVxdWlyZWRcclxuICAgICAgICAgICAgU3RhdHVzQmFyLnN0eWxlRGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFsnJGlvbmljUGxhdGZvcm0nLCBBcHBNYWluXTsiLCJyZXF1aXJlKCcuL21vZHVsZXMvcGxheWxpc3RzL3BsYXlsaXN0cycpO1xudmFyIGxvZ2luID0gcmVxdWlyZSgnLi9tb2R1bGVzL2xvZ2luL2xvZ2luJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvbWVudS9tZW51Jyk7XG5yZXF1aXJlKCcuL2xheW91dC9ob21lL2hvbWUnKTtcblxubG9naW4uTG9naW5Db250cm9sbGVyO1xubW9kdWxlLmV4cG9ydCA9IGFuZ3VsYXIubW9kdWxlKCdzdGFydGVyJywgWydpb25pYycsXG4gICAgJ21lbnUnLFxuICAgICdsb2dpbicsXG4gICAgJ3BsYXlsaXN0cycsXG4gICAgJ2hvbWUnXSlcbi5jb25maWcocmVxdWlyZSgnLi9yb3V0ZXInKSlcbi5ydW4ocmVxdWlyZSgnLi9hcHAtbWFpbicpKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxuZnVuY3Rpb24gSG9tZUNvbnRyb2xsZXIoJHNjb3BlKSB7XHJcblxyXG4vLyAgICAvLyBUcmlnZ2VyZWQgaW4gdGhlIGxvZ2luIG1vZGFsIHRvIGNsb3NlIGl0XHJcbi8vICAgICRzY29wZS5jbG9zZUxvZ2luID0gZnVuY3Rpb24oKSB7XHJcbi8vICAgICAgICAkc2NvcGUubW9kYWwuaGlkZSgpO1xyXG4vLyAgICB9O1xyXG5cclxuICAgIC8vIE9wZW4gdGhlIGxvZ2luIG1vZGFsXHJcbiAgICAkcm9vdFNjb3BlLiRlbWl0KFwiQ2FsbFBhcmVudE1ldGhvZFwiLCB7fSk7XHJcbiAgICAkc2NvcGUuaG9tZUFsZXJ0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBhbGVydChcImhvbWVcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gWyckc2NvcGUnLCBIb21lQ29udHJvbGxlcl07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnaG9tZScsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgcmVxdWlyZSgnLi9ob21lLWNvbnRyb2xsZXInKSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmZ1bmN0aW9uIExvZ2luQ29udHJvbGxlcigkc2NvcGUsICRpb25pY01vZGFsLCAkdGltZW91dCkge1xyXG5cclxuICAgIC8vIFdpdGggdGhlIG5ldyB2aWV3IGNhY2hpbmcgaW4gSW9uaWMsIENvbnRyb2xsZXJzIGFyZSBvbmx5IGNhbGxlZFxyXG4gICAgLy8gd2hlbiB0aGV5IGFyZSByZWNyZWF0ZWQgb3Igb24gYXBwIHN0YXJ0LCBpbnN0ZWFkIG9mIGV2ZXJ5IHBhZ2UgY2hhbmdlLlxyXG4gICAgLy8gVG8gbGlzdGVuIGZvciB3aGVuIHRoaXMgcGFnZSBpcyBhY3RpdmUgKGZvciBleGFtcGxlLCB0byByZWZyZXNoIGRhdGEpLFxyXG4gICAgLy8gbGlzdGVuIGZvciB0aGUgJGlvbmljVmlldy5lbnRlciBldmVudDpcclxuICAgIC8vJHNjb3BlLiRvbignJGlvbmljVmlldy5lbnRlcicsIGZ1bmN0aW9uKGUpIHtcclxuICAgIC8vfSk7XHJcbi8vICAgICRzY29wZS5ob21lQWxlcnQoKTtcclxuICAgIC8vIEZvcm0gZGF0YSBmb3IgdGhlIGxvZ2luIG1vZGFsXHJcbiAgICAkcm9vdFNjb3BlLiRvbihcIkNhbGxQYXJlbnRNZXRob2RcIiwgZnVuY3Rpb24oKXtcclxuICAgICAgICAkc2NvcGUubG9naW4oKTtcclxuICAgIH0pO1xyXG5cclxuICAgICRzY29wZS5sb2dpbkRhdGEgPSB7fTtcclxuXHJcbiAgICAvLyBDcmVhdGUgdGhlIGxvZ2luIG1vZGFsIHRoYXQgd2Ugd2lsbCB1c2UgbGF0ZXJcclxuICAgICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCgnanMvbW9kdWxlcy9sb2dpbi9sb2dpbi5odG1sJywge1xyXG4gICAgICAgIHNjb3BlOiAkc2NvcGVcclxuICAgIH0pLnRoZW4oZnVuY3Rpb24obW9kYWwpIHtcclxuICAgICAgICAgICAgJHNjb3BlLm1vZGFsID0gbW9kYWw7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgLy8gVHJpZ2dlcmVkIGluIHRoZSBsb2dpbiBtb2RhbCB0byBjbG9zZSBpdFxyXG4gICAgJHNjb3BlLmNsb3NlTG9naW4gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAkc2NvcGUubW9kYWwuaGlkZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBPcGVuIHRoZSBsb2dpbiBtb2RhbFxyXG4gICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJHNjb3BlLm1vZGFsLnNob3coKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gUGVyZm9ybSB0aGUgbG9naW4gYWN0aW9uIHdoZW4gdGhlIHVzZXIgc3VibWl0cyB0aGUgbG9naW4gZm9ybVxyXG4gICAgJHNjb3BlLmRvTG9naW4gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnRG9pbmcgbG9naW4nLCAkc2NvcGUubG9naW5EYXRhKTtcclxuXHJcbiAgICAgICAgLy8gU2ltdWxhdGUgYSBsb2dpbiBkZWxheS4gUmVtb3ZlIHRoaXMgYW5kIHJlcGxhY2Ugd2l0aCB5b3VyIGxvZ2luXHJcbiAgICAgICAgLy8gY29kZSBpZiB1c2luZyBhIGxvZ2luIHN5c3RlbVxyXG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuY2xvc2VMb2dpbigpO1xyXG4gICAgICAgIH0sIDEwMDApO1xyXG4gICAgfTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFsnJHNjb3BlJywgJyRpb25pY01vZGFsJywgJyR0aW1lb3V0JywgTG9naW5Db250cm9sbGVyXTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdsb2dpbicsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0xvZ2luQ29udHJvbGxlcicsIHJlcXVpcmUoJy4vbG9naW4tY29udHJvbGxlcicpKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnbWVudScsIFtdKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5mdW5jdGlvbiBQbGF5bGlzdHNDb250cm9sbGVyKCRzY29wZSkge1xyXG4gICAgJHNjb3BlLnBsYXlsaXN0cyA9IFtcclxuICAgICAgICB7IHRpdGxlOiAnUmVnZ2FlJywgaWQ6IDEgfSxcclxuICAgICAgICB7IHRpdGxlOiAnQ2hpbGwnLCBpZDogMiB9LFxyXG4gICAgICAgIHsgdGl0bGU6ICdEdWJzdGVwJywgaWQ6IDMgfSxcclxuICAgICAgICB7IHRpdGxlOiAnSW5kaWUnLCBpZDogNCB9LFxyXG4gICAgICAgIHsgdGl0bGU6ICdSYXAnLCBpZDogNSB9LFxyXG4gICAgICAgIHsgdGl0bGU6ICdDb3diZWxsJywgaWQ6IDYgfVxyXG4gICAgXTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbJyRzY29wZScsIFBsYXlsaXN0c0NvbnRyb2xsZXJdOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwbGF5bGlzdHNcIiwgW10pXHJcbiAgICAuY29udHJvbGxlcihcIlBsYXlsaXN0c0NvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vcGxheWxpc3RzLWNvbnRyb2xsZXJcIikpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXHJcbiAgICBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xyXG4gICAgICAgIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXHJcbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnYXBwL2hvbWUnKTtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvYXBwXCIsXHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL21vZHVsZXMvbWVudS9tZW51Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkNvbnRyb2xsZXIgYXMgbG9naW5Db250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuaG9tZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvaG9tZVwiLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWVudUNvbnRlbnQnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9ob21lL2hvbWUuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSG9tZUNvbnRyb2xsZXIgYXMgaG9tZUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuc2VhcmNoJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9zZWFyY2hcIixcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21lbnVDb250ZW50Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9tb2R1bGVzL3NlYXJjaC9zZWFyY2guaHRtbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuYnJvd3NlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9icm93c2VcIixcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21lbnVDb250ZW50Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9tb2R1bGVzL2Jyb3dzZS9icm93c2UuaHRtbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wbGF5bGlzdHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3BsYXlsaXN0c1wiLFxyXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAnbWVudUNvbnRlbnQnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL21vZHVsZXMvcGxheWxpc3RzL3BsYXlsaXN0cy5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQbGF5bGlzdHNDb250cm9sbGVyIGFzIHBsYXlsaXN0c0NvbnRyb2xsZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuc2luZ2xlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9wbGF5bGlzdHMvOnBsYXlsaXN0SWRcIixcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21lbnVDb250ZW50Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9tb2R1bGVzL3BsYXlsaXN0cy9wbGF5bGlzdC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQbGF5bGlzdENvbnRyb2xsZXIgYXMgcGxheWxpc3RDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgO1xyXG4gICAgfVxyXG5dOyJdfQ==
