'use strict';

module.exports = angular.module('checkout.controller', [])
    .controller("CheckoutController", ['$scope', '$localstorage', 'ControlModalService', '$state',
        function ($scope, $localstorage, ControlModalService, $state) {
            $scope.cartlist = $localstorage.getObject("cart");

            $scope.checkout = function(){
                $localstorage.setNull("cart");
                $state.go("menu.products");
            }
        }]);