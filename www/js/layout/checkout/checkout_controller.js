'use strict';

module.exports = angular.module('checkout.controller', [])
    .controller("CheckoutController", ['$scope', '$localstorage', 'ControlModalService', '$state', '$rootScope', 'CheckoutService', 'UserService', 'ProductService', '$ionicPopup', '$ionicHistory',
        function ($scope, $localstorage, ControlModalService, $state, $rootScope, CheckoutService, UserService, ProductService, $ionicPopup, $ionicHistory) {
            $scope.user = UserService.currentUser;
            $scope.checkoutInfo = CheckoutService.checkoutInfo;

            if (Object.keys($scope.checkoutInfo["methodShip"]).length === 0) {
                CheckoutService.shippingInfo().success(function (data) {
                    var shippingInfo = data;
                    $scope.checkoutInfo["methodShip"] = shippingInfo[0].method[0];
                });
            }

            if (Object.keys($scope.checkoutInfo["methodPayment"]).length === 0) {
                CheckoutService.paymentInfo().success(function (data) {
                    $scope.checkoutInfo["methodPayment"] = data[1];
                });
            }

            CheckoutService.updateCheckoutInfoUser($scope.user);

            $scope.checkout = function () {
                if (!$scope.checkoutInfo.user.name) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Bổ sung',
                        template: 'Vui lòng nhập tên'
                    });
                }
                else if (!$scope.checkoutInfo.user.address && ($scope.checkoutInfo.methodShip.type != 'freeshipping')) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Bổ sung',
                        template: 'Vui lòng nhập địa chỉ giao hàng'
                    });
                }
                else {
                    CheckoutService.setOrder()
                        .success(function () {
                            $ionicPopup.alert({
                                title: 'Đặt mua thành công',
                                template: 'Xin cảm ơn quý khách'
                            }).then(function () {
                                    $localstorage.setNull("cart");
                                    $localstorage.addAttributeAll("wishlist", "added", false);//remove add to card attr in wishlist

                                    $rootScope.$broadcast("CartUpdate");
                                    $rootScope.$broadcast("CloseOrder");

                                    $ionicHistory.clearHistory();
                                    $ionicHistory.clearCache();

                                    CheckoutService.resetCheckoutInfo();
                                    CheckoutService.shippingInfo().success(function (data) {
                                        var shippingInfo = data;
                                        $scope.checkoutInfo["methodShip"] = shippingInfo[0].method[0];
                                    });

                                    CheckoutService.paymentInfo().success(function (data) {
                                        $scope.checkoutInfo["methodPayment"] = data[1];
                                    });

                                    ProductService.setPage(1);
                                    ProductService.filterProduct().then(function () {
                                        console.log("success")
                                    }, function () {
                                        $ionicLoading.hide();
                                        $ionicPopup.alert({
                                            title: 'Lỗi',
                                            template: 'Bạn vui lòng thử chọn lại sản phẩm'
                                        });
                                    });

                                    $state.go("menu.products");
                                });
                        });
                }
            }
        }]);