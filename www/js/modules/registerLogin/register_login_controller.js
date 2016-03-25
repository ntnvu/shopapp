'use strict';

module.exports = angular.module('registerLogin.controller', [])
    .controller("RegisterLoginController", ['$scope', '$ionicModal', 'LoginService', '$ionicPopup', '$timeout', '$state',
        function ($scope, $ionicModal, LoginService, $ionicPopup, $timeout, $state) {

        $scope.result = function () {
            console.log(LoginService.rec);
        }

        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('js/modules/registerLogin/registerLogin.html', {
            scope: $scope
        }).then(function (modal) {
                $scope.modalLoginRegister = modal;
            });

        // Triggered in the login modal to close it
        $scope.closeLoginRegister = function () {
            $scope.modalLoginRegister.hide();
        };

        // Open the login modal
        $scope.openLoginRegister = function () {
            $scope.modalLoginRegister.show();
        };

        //login section
        $scope.doRegister = function () {
            console.log('Doing register', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLoginRegister();
            }, 1000);
        };


        //register section
        $scope.doLogin = function () {
            LoginService.loginUser($scope.loginData.username, $scope.loginData.password).success(function (data) {
                $state.go('tab.dash');


                console.log("do Login");
            }).error(function (data) {
                    console.log("do not Login");
                    var alertPopup = $ionicPopup.alert({
                        title: 'Login failed!',
                        template: 'Please check your credentials!'
                    });
                });

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
//        $timeout(function () {
//            $scope.closeLoginRegister();
//        }, 1000);
        };

    }]);