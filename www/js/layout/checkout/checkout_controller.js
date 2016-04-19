'use strict';

module.exports = angular.module('checkout.controller', [])
    .controller("CheckoutController", ['$scope', '$localstorage', 'ControlModalService', '$state','$rootScope',
        function ($scope, $localstorage, ControlModalService, $state, $rootScope) {
            $scope.cartlist = $localstorage.getObject("cart");

            $scope.checkout = function(){
                $localstorage.setNull("cart");
                $rootScope.$broadcast("CartUpdate");
                $state.go("menu.products");
            }
        }]);