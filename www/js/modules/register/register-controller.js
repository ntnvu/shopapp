'use strict';

function RegisterController($scope, $ionicModal, $timeout) {



//    Auth.checkLogin();

    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('js/modules/register_login/register.html', {
        scope: $scope
    }).then(function(modal) {
            $scope.modalRegister = modal;
//            $scope.login();
        });

    // Triggered in the login modal to close it
    $scope.closeRegister = function() {
        $scope.modalRegister.hide();
    };

    // Open the login modal
    $scope.register = function() {
        $scope.modalRegister.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doRegister = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };

    $ionicTabsDelegate.select(1);

}
module.exports = ['$scope', '$ionicModal', '$timeout', RegisterController];