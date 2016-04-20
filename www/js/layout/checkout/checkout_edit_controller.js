'use strict';

module.exports = angular.module('checkoutEdit.controller', [])
    .controller("CheckoutEditController", ['$scope', '$localstorage', 'UserService','CheckoutService',
        function ($scope,  $localstorage, UserService, CheckoutService) {
            $scope.user = UserService.currentUser;
            $scope.checkoutInfo = CheckoutService.checkoutInfo;
            $scope.shippingInfo = CheckoutService.shippingInfo;
            $scope.methodShip = {
                name : ""
            }

            $scope.updateCheckout = function(){
                console.log($scope.methodShip.name);
                CheckoutService.updateCheckoutInfo($scope.checkoutInfo);
            }
        }]);