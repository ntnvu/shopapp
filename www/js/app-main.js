'use strict';
function AppMain($ionicPlatform, $state){
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

        if (!ionic.DomUtil.getParentOrSelfWithClass(e.target, 'overflow-scroll')) {
            // any showing part of the document that isn't within the scroll the user
            // could touchmove and cause some ugly changes to the app, so disable
            // any touchmove events while the keyboard is open using e.preventDefault()
            if (window.navigator.msPointerEnabled) {
                document.addEventListener("MSPointerMove", keyboardPreventDefault, false);
            } else {
                document.addEventListener('touchmove', keyboardPreventDefault, false);
            }
        }
    });

    $ionicPlatform.on('resume', function(){
//        $state.go('home');
    });
}

module.exports = ['$ionicPlatform', '$state', AppMain];