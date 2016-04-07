"use strict"

module.exports = angular.module("products.single.controller", [])
    .controller("ProductsSingleController", ['$scope', 'ProductService', '$stateParams','WishlistService',
        function ($scope, ProductService, $stateParams, WishlistService) {
            $scope.product = ProductService.viewDetail($stateParams.index);

//            $scope.init = function () {
//                $scope.loading = true;
//                $scope.$broadcast('dataloaded');
//            };
//
//            $scope.init();
            $scope.addToWishlist = function(item){
                WishlistService.addWishlist(item);
            }
        }]);
