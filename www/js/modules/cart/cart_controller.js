'use strict';

module.exports = angular.module('cart.controller', [])
    .controller("CartController", ['$scope', 'parameters', 'CartService',
        function ($scope, parameters, CartService) {

            $scope.optProd = {
                color:["yellow", "red", "orange", "blue"],
                size:["S", "M", "L", "XL"]
            };

            $scope.choice = {};

            $scope.add_to_cart = function () {
                parameters.color = $scope.choice.color;
                parameters.size = $scope.choice.size;
                parameters.quantity = $scope.choice.quantity;

                console.log(parameters);

                CartService.addCart(parameters);
                $scope.closeModal();
            }

        }]);