'use strict';

module.exports = angular.module('checkout.controller', [])
    .controller("CheckoutController", ['$scope', '$localstorage', 'ControlModalService', '$state', '$rootScope', 'CheckoutService', 'UserService', 'ProductService', '$ionicPopup', '$ionicHistory',
        function ($scope, $localstorage, ControlModalService, $state, $rootScope, CheckoutService, UserService, ProductService, $ionicPopup, $ionicHistory) {
            $scope.user = UserService.currentUser;
            $scope.checkoutInfo = CheckoutService.checkoutInfo;

            $scope.$on('UserLogout', function (event, data) {
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
            });

            if (Object.keys($scope.checkoutInfo["methodShip"]).length === 0) {
                CheckoutService.shippingInfo().success(function (data) {
                    var shippingInfo = data;
                    $scope.checkoutInfo["methodShip"] = shippingInfo[0].method[0];
                });
            }

            if (Object.keys($scope.checkoutInfo["methodShip"]).length === 0) {
                CheckoutService.paymentInfo().success(function (data) {
                    $scope.checkoutInfo["methodPayment"] = data[0];
                });
            }

            CheckoutService.updateCheckoutInfo($scope.user);

            $scope.checkout = function () {
                if (!$scope.checkoutInfo.name) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Bổ sung',
                        template: 'Vui lòng nhập tên'
                    });
                }
                else if (!$scope.checkoutInfo.address && ($scope.checkoutInfo.methodShip.type != 'freeshipping')) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Bổ sung',
                        template: 'Vui lòng nhập địa chỉ giao hàng'
                    });
                }
                else {
                    CheckoutService.setOrder();

                    $localstorage.setNull("cart");
                    $localstorage.addAttributeAll("wishlist", "added", false);//remove add to card attr in wishlist

                    ProductService.setType("new");
                    ProductService.setPage(1);
                    ProductService.updateLoadmore(true);
                    ProductService.filterProduct();

                    $rootScope.$broadcast("CartUpdate");
                    $rootScope.$broadcast("CloseOrder");

                    $state.go("menu.products");
                }

            }
        }]);