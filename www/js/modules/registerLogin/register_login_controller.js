'use strict';

module.exports = angular.module('registerLogin.controller', [])
    .controller("RegisterLoginController", ['$scope', 'LoginService', '$state', '$ionicPopup', '$localstorage',
        function ($scope, LoginService, $state, $ionicPopup, $localstorage) {

            $scope.result = function () {
                console.log(LoginService.rec);
            }

            $scope.$on('modal.hidden', function() {
                $state.go('menu.products');
            });

            $scope.loginData = {};

            $scope.openLoginModal = function () {
                $scope.openModal();
            }

            $scope.closeLoginModal = function () {
                $scope.closeModal();
                $state.go('menu.products');
            }

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
                LoginService.loginUser($scope.loginData.email, $scope.loginData.pass)
                    .success(function (data) {
                        $scope.loginData.login = 1;
                        $localstorage.setObject("user", $scope.loginData);
                        $scope.closeModal();
                        $state.go('menu.products');
                    })
                    .error(function (data) {
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