'use strict';

module.exports = angular.module('cart.controller', [])
    .controller("CartController", ['$scope', '$localstorage', 'WishlistService', 'CartService',
        function ($scope, $localstorage, WishlistService, CartService) {
            $scope.cartlist = $localstorage.getObject("cart");

            $scope.addToWishlist = function(item){
                WishlistService.addWishlist(item);
            }

            $scope.removeFromCart = function(item){
                CartService.removeCart(item);
                $scope.cartlist = $localstorage.getObject("cart");
            }

        }]);