"use strict"

module.exports = angular.module("product.controller", [])
    .controller("ProductController", ['$scope', 'ProductService', '$stateParams','WishlistService','$http','ControlModalService','$ionicSlideBoxDelegate', '$timeout',
        function ($scope, ProductService, $stateParams, WishlistService, $http, ControlModalService, $ionicSlideBoxDelegate, $timeout) {
//            $scope.products = ProductService.productCurrent;
//            $scope.product = $scope.products[$stateParams.index];
            $scope.product = {};

            var link_ajax = "http://shop10k.qrmartdemo.info/api/rest/products";

            $http.get(link_ajax + "/1658/images").then(function (resp) {
                $scope.product.images = resp.data;
                $scope.updateSlider();
            });

            $http.get(link_ajax + "/1658/categories").then(function (cat) {
                $scope.product.category = cat.data;
                console.log($scope.product.category.category_id);
                $http.get(link_ajax + "?category_id=" + $scope.product.category.category_id).then(function (relate) {
                    $scope.product.related = relate.data;
                });
            });



            $scope.updateSlider = function(){
                $ionicSlideBoxDelegate.update();
            }

            $scope.addToWishlist = function(item){
                WishlistService.addWishlist(item);
            }

            $scope.chooseProductOption = function(item){
                ControlModalService.show('js/modules/cart/cart.html', 'CartController', 1, item);
            }
        }]);

