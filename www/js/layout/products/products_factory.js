"use strict"

module.exports = angular.module("products.factory", [])
    .factory('ProductService', function ($q, $http, $localstorage, $ionicLoading) {
        var products = [];
        var filter = {
            limit: 20,
            type: ''
        };
        var current_index = 0;

        function init(){
            products.length = 0;
            current_index = 0;
            for (var i = 0; i <= 200; i++) {
                products.push({
                    "entity_id" : i
                });
            }
        }

        function add_product(data) {
            var array = $.map(data, function (value, index) {
                return [value];
            });

            for (var i = array.length - 1; i >= 0; i--) {
                current_index++;
                products.push(array[i]);
            }
        }

        return{
            filterProduct: function () {
                var deferred = $q.defer();
                var promise = deferred.promise;
//                var link_ajax = "http://liquordelivery.com.sg/wp-admin/admin-ajax.php";
//                $http.get(link_ajax + "?action=latest_products_app&filter=" + filterType + "&page=" + page_next).then(function (resp) {
                filter.limit = 10;
                if (filter.page == 1) {
                    this.clearProducts();
                    $ionicLoading.show({
                        template: 'Loading...'
                    });
                    filter.limit = 20;
                }

//                var link_ajax = "http://shop10k.qrmartdemo.info/api/rest/products";
//                $http.get(link_ajax + "?page=" + filter.page + "&limit="+ filter.limit +"&order=entity_id&dir=dsc").then(function (resp) {

                var link_ajax = "http://shop10k.qrmartdemo.info/api/rest/products";
                $http.get("http://shop10k.qrmartdemo.info/web_api.php?r="+ filter.type + "&limit="+ filter.limit + "&page=" + filter.page).then(function (resp) {
                    add_product(resp.data);

                    $ionicLoading.hide();

                    $localstorage.updateArray(products, $localstorage.getObject("cart"), "added");
                    $localstorage.updateArray(products, $localstorage.getObject("wishlist"), "like");

                    deferred.resolve(++filter.page);
                }, function (err) {
                    // err.status will contain the status code
                    console.error('ERR', err);
                    deferred.reject('ERR ' + err);
                })

                return promise;
            },

            setPage: function (number) {
                filter.page = number;
            },

            setType: function (type) {
                filter.type = type;
            },

            getPage: function(){
                return filter.page;
            },

            getIndex: function(){
                return current_index;
            },

            addAttribute: function (item, index) {
                for (var i in products) {
                    if (products[i].entity_id == item.entity_id) {
                        products[i][index] = item[index];
                    }
                }
            },

            clearProducts: function () {
                products.length = 0;
            },

            productCurrent: products
        }
    }
)
;