'use strict';

module.exports = angular.module('CartPage.controller', [])
    .controller("CartPageController", ['$scope', '$localstorage', 'WishlistService',
        function ($scope, $localstorage, WishlistService) {
//            $localstorage.setNull("cart");
            $scope.cartlist = $localstorage.getObject("cart");
            console.log($scope.cartlist);

            $scope.removeFromCart = function(item){
                $localstorage.removeObject("cart", item.id);
                $scope.cartlist = $localstorage.getObject("cart");
            }

            $scope.addToWishlist = function(item){
                WishlistService.addWishlist(item);
            }
        }]);