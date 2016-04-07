'use strict';

module.exports = angular.module('wishlist.controller', [])
    .controller("WishlistController", ['$scope', '$localstorage','WishlistService','$state',
        function ($scope, $localstorage, WishlistService, $state) {
            $localstorage.setNull();
            $scope.wishlist = $localstorage.getObject("wishlist");

            $scope.addToWishlist = function(item){
                WishlistService.addWishlist(item);
            }


        }]);