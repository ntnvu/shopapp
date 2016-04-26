"use strict"

module.exports = angular.module("menu.controller", [])
    .controller("MenuController", ['$scope', '$ionicSideMenuDelegate', 'ProductService', '$state', 'ControlModalService', '$localstorage', 'UserService',
        function ($scope, $ionicSideMenuDelegate, ProductService, $state, ControlModalService, $localstorage, UserService) {
            $scope.wishlistNumber = $localstorage.getObject("wishlist").length;
            $scope.cartNumber = $localstorage.getObject("cart").length;
            $scope.user = UserService.currentUser;
            UserService.isLogin();

            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if (toState.name == "menu.products") {
                    $scope.showProductBackBtn = false;
                }
                else {
                    $scope.showProductBackBtn = true;
                }
            });

            $scope.$on('WishlistUpdate', function (event, data) {
                $scope.wishlistNumber = $localstorage.getObject("wishlist").length;
            });

            $scope.$on('CartUpdate', function (event, data) {
                $scope.cartNumber = $localstorage.getObject("cart").length;
            });

            $scope.filterType = [
                {type: "new", name: 'Sản phẩm mới'},
                {type: "promo", name: 'Sản phẩm khuyến mãi'},
                {type: "price50k" , name: 'Duoi 50.000'},
                {type: "price100k" , name: '50.000 den 100.000'},
                {type: "price200k" , name: '100.000 den 200.000'},
                {type: "price200up" , name: 'Tren 200.000'}
            ];

            $scope.openMenu = function () {
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.getProducts = function (type) {
                ProductService.setType(type);
                ProductService.setPage(1);
                ProductService.filterProduct();
            }

            $scope.contact = function () {
                ControlModalService.show('js/modules/contact/contact.html', 'ContactController', 1);
            }

            $scope.show_cart = function () {
                $state.go("menu.cart");
            }

            $scope.user_info = function () {
                $state.go("menu.user");
            }

            $scope.to_login = function () {
                ControlModalService.show('js/modules/registerLogin/registerLogin.html', 'RegisterLoginController', 1);
            }

            $scope.signout = function () {
                UserService.signOut();
            }

            $scope.getProducts("all");
        }
    ]);
