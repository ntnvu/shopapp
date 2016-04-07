'use strict';

module.exports = angular.module('CartPage.controller', [])
    .controller("CartPageController", ['$scope', '$localstorage',
        function ($scope, $localstorage) {
//            $localstorage.setNull("cart");
            $scope.cartlist = $localstorage.getObject("cart");
            console.log($scope.cartlist);
        }]);