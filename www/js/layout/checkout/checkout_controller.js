'use strict';

module.exports = angular.module('checkout.controller', [])
    .controller("CheckoutController", ['$scope', '$localstorage', 'ControlModalService', '$state','$rootScope', 'CheckoutService','UserService',
        function ($scope, $localstorage, ControlModalService, $state, $rootScope, CheckoutService, UserService) {
            $scope.user = UserService.currentUser;
            $scope.checkoutInfo = CheckoutService.checkoutInfo;

            $scope.checkoutInfo["methodShip"] = CheckoutService.shippingInfo.A;
            $scope.checkoutInfo["methodPayment"] = CheckoutService.paymentInfo.A;

            if(UserService.isLogin()){
                CheckoutService.updateCheckoutInfo($scope.user);
            }

            $scope.checkout = function(){
                $localstorage.setNull("cart");
                $rootScope.$broadcast("CartUpdate");
                $state.go("menu.products");
            }
        }]);