'use strict';

module.exports = angular.module('checkoutEdit.controller', [])
    .controller("CheckoutEditController", ['$scope', '$localstorage', 'UserService', 'CheckoutService', '$state', 'CartService',
        function ($scope, $localstorage, UserService, CheckoutService, $state, CartService) {
            $scope.user = UserService.currentUser;
            $scope.shippingInfo = CheckoutService.shippingInfo_1;
            $scope.checkoutInfo = CheckoutService.checkoutInfo;

            $scope.paymentInfo = CheckoutService.paymentInfo;
            $scope.below50 = false;
            $scope.below100 = false;



            var total = CartService.sumCart();

            if (total < 50000) {
                $scope.below50 = true;
            }
            else if (total < 100000) {
                $scope.below100 = true;
            }

            $scope.updateCheckout = function () {
                CheckoutService.addShipping($scope.checkoutInfo.methodShip);
                $state.go('menu.checkout');
            }
        }]);