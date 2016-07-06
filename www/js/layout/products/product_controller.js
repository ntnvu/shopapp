"use strict"

module.exports = angular.module("product.controller", [])
    .directive('spinnerOnLoad', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.loaded = false;
                element.bind('load', function () {
                    scope.$apply(function () {
                        scope.loaded = true;
                    });
                });
            }
        };
    })
    .controller("ProductController", ['$scope', 'ProductService', '$stateParams', 'WishlistService', '$http', 'ControlModalService', '$ionicSlideBoxDelegate', 'CartService', '$localstorage',
        function ($scope, ProductService, $stateParams, WishlistService, $http, ControlModalService, $ionicSlideBoxDelegate, CartService, $localstorage) {
            var link_ajax = "http://shop10k.vn/api/rest/products";
            var link_ajax_new = "http://shop10k.vn/web_api.php";

            $scope.product = {};
            $localstorage.getKeyTime().then(
                function (md5key) {
                    $http.get(link_ajax_new + "?r=product&id=" + $stateParams.id + "&key=" + md5key).then(function (resp) {
                        var temp = [];
                        temp.push(resp.data);
                        $localstorage.updateArray(temp, $localstorage.getObject("cart"), "added");
                        $localstorage.updateArray(temp, $localstorage.getObject("wishlist"), "like");

                        $scope.product.detail = temp;
                        $scope.product.detail["thumb"] = $scope.product.detail.image;
                    });

                    $http.get(link_ajax + "/" + $stateParams.id + "/images" + "?key=" + md5key).then(function (resp) {
                        $scope.product.images = resp.data;
                        $scope.updateSlider();
                    });

                    $http.get(link_ajax + "/" + $stateParams.id + "/categories" + "?key=" + md5key).then(function (cat) {
                        $scope.product.category = cat.data;
                        $http.get(link_ajax + "?category_id=" + $scope.product.category[0].category_id + "&key=" + md5key).then(function (relate) {
                            delete relate.data[$scope.product.detail[0].entity_id];
                            $scope.product.related = relate.data;
                        });
                    });
                }
            )

            $scope.updateSlider = function () {
                $ionicSlideBoxDelegate.update();
            }

            $scope.addToWishlist = function (item) {
                WishlistService.addWishlist(item);
            }

            $scope.add_to_cart = function (item) {
                CartService.addCart(item);
            }

            $scope.chooseProductOption = function (item) {
                ControlModalService.show('js/modules/cart/cart.html', 'CartController', 1, item);
            }

            $scope.slickConfig = {
                autoplay: true,
                infinite: true,
                autoplaySpeed: 1000,
                slidesToShow: 3,
                slidesToScroll: 3,
                method: {}
            };
        }]);

