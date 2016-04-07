'use strict';

module.exports = angular.module('cart.controller', [])
    .controller("CartController", ['$scope', 'parameters', '$localstorage',
        function ($scope, parameters, $localstorage) {
//            $scope.productAttr = {
//                color:["yellow", "red", "orange", "blue"],
//                size:["S", "M", "L", "XL"]
//            }

            $scope.cart = [];


            $scope.optProd = {};

            $scope.add_to_cart = function () {
                console.log($localstorage.getObject("cart"));
                $scope.cart = $scope.cart.concat({
                        id: parameters.id,
                        title: parameters.title,
                        thumb: parameters.img,
                        color: $scope.optProd.color,
                        size: $scope.optProd.size,
                        quantity: $scope.optProd.quantity
                    },
                    $localstorage.getObject("cart"));

                $localstorage.setObject("cart", $scope.cart);
                $scope.closeModal();
            }

        }]);