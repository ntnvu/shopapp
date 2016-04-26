'use strict';

module.exports = angular.module('wishlist.controller', [])
    .controller("WishlistController", ['$scope', '$localstorage','WishlistService','$state','CartService',
        function ($scope, $localstorage, WishlistService, $state, CartService) {
//            $localstorage.setNullAll();
            $scope.wishlistNumber = WishlistService.wishlistNumber;
            $scope.wishlist = $localstorage.getObject("wishlist");
            $scope.lengthWishlist = $scope.wishlist.length;

            $scope.removeFromWishlist = function(item){
                WishlistService.removeWishlist(item);
                $scope.wishlist = $localstorage.getObject("wishlist");
                $scope.lengthWishlist = $scope.wishlist.length;
            }

            $scope.add_to_cart = function (item) {
                CartService.addCart(item);
            }
        }]);