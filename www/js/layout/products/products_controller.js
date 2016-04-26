"use strict"

module.exports = angular.module("products.controller", [])
    .directive('spinnerOnLoad', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.loaded = false;
                element.bind('load', function () {
                    scope.$apply(function () {
                        scope.loaded = true;
                    });
                });
            }
        };
    })
    .controller("ProductsController", ['$scope', '$ionicSideMenuDelegate', 'ProductService', 'ControlModalService', 'WishlistService', 'CartService',
        function ($scope, $ionicSideMenuDelegate, ProductService, ControlModalService, WishlistService, CartService) {
            $scope.products = ProductService.productCurrent;

            $scope.openMenu = function () {
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.loadMoreData = function () {
                console.log(ProductService.getIndex());
                var temp = ProductService.getPage();
                if(temp == 1){
                    ProductService.setPage(2);
                }
                ProductService.filterProduct().then(function (data) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            $scope.add_to_cart = function (item) {
                CartService.addCart(item);
            }

            $scope.addToWishlist = function (item) {
                WishlistService.addWishlist(item);
            }
        }
    ]);
