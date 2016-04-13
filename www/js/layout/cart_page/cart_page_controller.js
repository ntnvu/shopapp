'use strict';

module.exports = angular.module('CartPage.controller', [])
    .controller("CartPageController", ['$scope', '$localstorage', 'WishlistService', 'CartService',
        function ($scope, $localstorage, WishlistService, CartService) {
//            $localstorage.setNull("cart");
            $scope.cartlist = $localstorage.getObject("cart");

            $scope.addToWishlist = function(item){
                WishlistService.addWishlist(item);
            }

            $scope.removeFromCart = function(item){
                CartService.removeCart(item);
                $scope.cartlist = $localstorage.getObject("cart");
            }
        }]);