"use strict"

module.exports = angular.module("products.controller", [])
    .controller("ProductsController", ['$scope', '$ionicSideMenuDelegate','ProductService', 'ControlModalService','WishlistService',
        function ($scope, $ionicSideMenuDelegate, ProductService, ControlModalService, WishlistService) {
            $scope.products = ProductService.productCurrent;
            $scope.page = ProductService.page;

            $scope.openMenu = function () {
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.loadMoreData = function () {
                var type = $scope.currentcheckCtrl;

                var temppage = $scope.page.number;
                temppage++;

                ProductService.filterProduct(type, 1, temppage).then(
                    function (data) {
                        var temp = $scope.products;
                        temp = temp.concat(data);
                        angular.copy(temp, $scope.products);//must use angular.copy
                        $scope.$broadcast('scroll.infiniteScrollComplete');

                        angular.copy({
                            number : temppage
                        }, $scope.page);
                    }
                );
            };

            $scope.chooseProductOption = function(item){
                ControlModalService.show('js/modules/cart/cart.html', 'CartController', 1, item);
            }

            $scope.addToWishlist = function(item){
                WishlistService.addWishlist(item);
            }
        }
    ]);
