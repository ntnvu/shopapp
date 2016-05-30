'use strict';

module.exports = angular.module('checkout.controller', [])
    .controller("CheckoutController", ['$scope', '$localstorage', 'ControlModalService', '$state','$rootScope', 'CheckoutService','UserService','ProductService',
        function ($scope, $localstorage, ControlModalService, $state, $rootScope, CheckoutService, UserService, ProductService) {
            $scope.user = UserService.currentUser;
            $scope.checkoutInfo = CheckoutService.checkoutInfo;

            CheckoutService.shippingInfo().success(function(data){
                var shippingInfo = data;
                $scope.checkoutInfo["methodShip"] = shippingInfo[0].method[0];
            });

            $scope.checkoutInfo["methodPayment"] = CheckoutService.paymentInfo.A;

            if(UserService.isLogin()){
                CheckoutService.updateCheckoutInfo($scope.user);
            }

            $scope.checkout = function(){
                CheckoutService.setOrder();

                $localstorage.setNull("cart");
                $localstorage.addAttributeAll("wishlist", "added", false);//remove add to card attr in wishlist

                $rootScope.$broadcast("CartUpdate");

                ProductService.setType("all");
                ProductService.setPage(1);
                ProductService.updateLoadmore(true);
                ProductService.filterProduct();

                $state.go("menu.products");
            }
        }]);