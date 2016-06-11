'use strict';

module.exports = angular.module('checkoutEdit.controller', [])
    .controller("CheckoutEditController", ['$scope', '$localstorage', 'UserService', 'CheckoutService', '$state', 'CartService','$ionicHistory',
        function ($scope, $localstorage, UserService, CheckoutService, $state, CartService, $ionicHistory) {
            $scope.user = UserService.currentUser;
            $scope.regex2Word = '/^(\d)+$/';

            $scope.$on('UserLogout', function (event, data) {
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
            });

            $scope.checkoutInfo = CheckoutService.checkoutInfo;

            CheckoutService.shippingInfo().success(function (data) {
                $scope.shippingInfo = data;
            })

            CheckoutService.paymentInfo().success(function (data) {
                $scope.paymentInfo = data;
            })

            $scope.below50 = false;
            $scope.below100 = false;
            $scope.total_temp = CartService.sumCart();
            if ($scope.total_temp < 50000) {
                $scope.below50 = true;
            }
            else if ($scope.total_temp < 100000) {
                $scope.below100 = true;
            }

            $scope.updateCheckout = function () {
                CheckoutService.updateCheckoutInfo($scope.checkoutInfo);
                CheckoutService.addShipping($scope.checkoutInfo.methodShip);
                $state.go('menu.checkout');
            }

            $scope.compareObj = function (obj1, obj2) {
                if (typeof obj1 === "undefined" || typeof obj2 === "undefined") {
                    return;
                }
                if (obj1.type === obj2.type) {
                    return true;
                }
                return false;
            }
        }]);