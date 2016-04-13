'use strict';

module.exports = angular.module('wishlist.controller', [])
    .controller("WishlistController", ['$scope', '$localstorage','WishlistService','$state',
        function ($scope, $localstorage, WishlistService, $state) {
//            $localstorage.setNull("wishlist");
            $scope.wishlist = $localstorage.getObject("wishlist");

            $scope.removeFromWishlist = function(item){
                WishlistService.removeWishlist(item);
                $scope.wishlist = $localstorage.getObject("wishlist");
            }
        }]);