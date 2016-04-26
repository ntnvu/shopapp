'use strict';

module.exports = angular.module('checkoutEdit.controller', [])
    .controller("CheckoutEditController", ['$scope', '$localstorage', 'UserService','CheckoutService','$state',
        function ($scope,  $localstorage, UserService, CheckoutService, $state) {
            $scope.user = UserService.currentUser;
            $scope.checkoutInfo = CheckoutService.checkoutInfo;
            $scope.shippingInfo = CheckoutService.shippingInfo;
            $scope.paymentInfo = CheckoutService.paymentInfo;

            $scope.updateCheckout = function(){
                CheckoutService.addShipping($scope.checkoutInfo.methodShip);
                $state.go('menu.checkout');
            }
        }]);