'use strict';

module.exports = angular.module('registerLogin.controller', [])
    .controller("RegisterLoginController", ['$scope', 'LoginService', '$state', '$ionicPopup', '$localstorage', 'UserService',
        function ($scope, LoginService, $state, $ionicPopup, $localstorage, UserService) {
            $scope.user = UserService.current_user;

            $scope.$on('modal.hidden', function () {
                $state.go('menu.products');
            });

            $scope.loginData = {};
            $scope.registerData = {};

            $scope.openLoginModal = function () {
                $scope.openModal();
            }

            $scope.closeLoginModal = function () {
                $scope.closeModal();
                $state.go('menu.products');
            }

            //login section
            $scope.doRegister = function () {
                LoginService.registerUser($scope.registerData)
                    .success(function (data) {
                        $scope.registerData = {};
                        var alertPopup = $ionicPopup.alert({
                            title: 'Đăng ký thành công',
                            template: 'Vui lòng đăng nhập để tiếp tục'
                        });
                    })
                    .error(function (data) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Đăng ký không thành công',
                            template: data
                        });
                    });

            };

            //register section
            $scope.doLogin = function () {
                LoginService.loginUser($scope.loginData)
                    .success(function (data) {
                        LoginService.getInfo($scope.loginData)
                            .success(function (data) {
                                data.name = data.user.fullname;
                                data.email = data.user.email;
                                data.phone = data.shipping_address.telephone_ship;
                                data.address = data.shipping_address.street_ship[0];
                                data.district = data.shipping_address.dis_ship;
                                data.city = data.shipping_address.city_ship;
                                data.password = $scope.loginData.password;
                                UserService.login(data);
                                $scope.closeModal();
                                $state.go('menu.products');
                            })
                            .error(function (data) {
                                $scope.closeModal();
                                $state.go('menu.user');
                            });

                    })
                    .error(function (data) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Login failed!',
                            template: 'Please check your credentials!'
                        });
                    });
            };

        }]);