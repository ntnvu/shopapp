'use strict';

module.exports = angular.module('checkout.controller', [])
    .controller("CheckoutController", ['$scope', '$localstorage', 'ControlModalService', '$state','$rootScope', 'CheckoutService','UserService','ProductService','$ionicPopup',
        function ($scope, $localstorage, ControlModalService, $state, $rootScope, CheckoutService, UserService, ProductService, $ionicPopup) {
            $scope.user = UserService.currentUser;
            $scope.checkoutInfo = CheckoutService.checkoutInfo;


            if (Object.keys($scope.checkoutInfo["methodShip"]).length === 0){
                CheckoutService.shippingInfo().success(function(data){
                    var shippingInfo = data;
                    $scope.checkoutInfo["methodShip"] = shippingInfo[0].method[0];
                });
            }


            $scope.checkoutInfo["methodPayment"] = CheckoutService.paymentInfo.A;

            if(UserService.isLogin()){
                CheckoutService.updateCheckoutInfo($scope.user);
            }

            $scope.checkout = function(){
                if(!$scope.checkoutInfo.address){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Bổ sung',
                        template: 'Vui lòng nhập địa chỉ giao hàng'
                    });
                }
                else{
                    CheckoutService.setOrder();

                    $localstorage.setNull("cart");
                    $localstorage.addAttributeAll("wishlist", "added", false);//remove add to card attr in wishlist

                    $rootScope.$broadcast("CartUpdate");
                    $rootScope.$broadcast("CloseOrder");

                    ProductService.setType("new");
                    ProductService.setPage(1);
                    ProductService.updateLoadmore(true);
                    ProductService.filterProduct();

                    $state.go("menu.products");
                }

            }
        }]);