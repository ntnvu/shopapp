'use strict';

module.exports = angular.module('checkout.controller', [])
    .controller("CheckoutController", ['$scope', '$localstorage', 'ControlModalService', '$state','$rootScope', 'CheckoutService','UserService',
        function ($scope, $localstorage, ControlModalService, $state, $rootScope, CheckoutService, UserService) {
            $scope.user = UserService.currentUser;
            $scope.checkoutInfo = CheckoutService.checkoutInfo;

            var shippingInfo = CheckoutService.shippingInfo_1;

            $scope.checkoutInfo["methodShip"] = shippingInfo.A;
            $scope.checkoutInfo["methodPayment"] = CheckoutService.paymentInfo.A;

            if(UserService.isLogin()){
                CheckoutService.updateCheckoutInfo($scope.user);
            }

            $scope.checkout = function(){
                CheckoutService.setOrder();
                $localstorage.setNull("cart");
                $rootScope.$broadcast("CartUpdate");
                $state.go("menu.products");
            }
        }]);