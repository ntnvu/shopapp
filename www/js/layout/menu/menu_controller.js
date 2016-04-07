"use strict"

module.exports = angular.module("menu.controller", [])
    .controller("MenuController", ['$scope', '$ionicSideMenuDelegate', 'ProductService', '$state', 'ControlModalService','$ionicHistory',
        function ($scope, $ionicSideMenuDelegate, ProductService, $state, ControlModalService, $ionicHistory) {
            $scope.filterType = [
                {type: "hot", name: 'San pham hot'},
                {type: "bestseller", name: 'San pham ban chay'},
                {type: {
                    lt: 50
                }, name: 'Duoi 50.000'},
                {type: {
                    rand: [50, 100]
                }, name: '50.000 den 100.000'},
                {type: {
                    rand: [100, 200]
                }, name: '100.000 den 200.000'},
                {type: {
                    gt: 200
                }, name: 'Tren 200.000'}
            ];

            $scope.openMenu = function () {
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.products = ProductService.productCurrent;
            $scope.page = ProductService.page;
            $scope.firstTime = 0;

            $scope.getProducts = function (type) {
                type = JSON.stringify(type);
                $scope.currentcheckCtrl = type;
                ProductService.filterProduct(type).then(
                    function (data) {
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });

                        angular.copy({
                            number: 1
                        }, $scope.page);
                        angular.copy(data, $scope.products);//must use angular.copy than use "=" so it can continue binding to first service param
                        if ($scope.firstTime)
                            $state.go("menu.products");
                        $scope.firstTime = 1;
                    }
                );
            }

            $scope.contact = function(){
                ControlModalService.show('js/modules/contact/contact.html', 'ContactController', 1);
            }

            $scope.show_cart = function(){
                $state.go("menu.cart_page");
            }
            $scope.getProducts("hot");
        }
    ]);
