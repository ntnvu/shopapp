'use strict';

module.exports = angular.module('user.controller', [])
    .controller("UserController", ['$scope','UserService','$ionicPopup',
        function ($scope, UserService, $ionicPopup) {
            $scope.user = UserService.currentUser;

            $scope.updateUser = function(){
                UserService.updateUser($scope.user);
                var alertPopup = $ionicPopup.alert({
                    title: 'Cập nhật thành công',
                    template: 'Thông tin của bạn đã được thay đổi'
                });
            }
        }
    ]);