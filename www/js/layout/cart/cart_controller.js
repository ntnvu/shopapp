'use strict';

module.exports = angular.module('cart.controller', [])
    .controller("CartController", ['$scope', '$localstorage', 'WishlistService', 'CartService','CheckoutService',
        function ($scope, $localstorage, WishlistService, CartService, CheckoutService) {
            $scope.cartlist = $localstorage.getObject("cart");
            $scope.lengthCart = $scope.cartlist.length;

            $scope.addToWishlist = function(item){
                WishlistService.addWishlist(item);
            }

            $scope.removeFromCart = function(item){
                CartService.removeCart(item);
                $scope.cartlist = $localstorage.getObject("cart");
                $scope.lengthCart = $scope.cartlist.length;
            }

            $scope.cart_checkout = function(){
                CheckoutService.sumTotal();
                $state.go('menu.checkout');
            }
        }]);