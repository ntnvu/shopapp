'use strict';

module.exports = angular.module('cart.controller', [])
    .controller("CartController", ['$scope', 'parameters', '$localstorage',
        function ($scope, parameters, $localstorage) {
            $scope.optProd = {
                color:["yellow", "red", "orange", "blue"],
                size:["S", "M", "L", "XL"]
            };

            $scope.choice = {};

            $scope.add_to_cart = function () {
                $localstorage.addObject("cart", {
                    id: parameters.id,
                    title: parameters.title,
                    thumb: parameters.img,
                    color: $scope.choice.color,
                    size: $scope.choice.size,
                    quantity: $scope.choice.quantity
                });

                $scope.closeModal();
            }

        }]);