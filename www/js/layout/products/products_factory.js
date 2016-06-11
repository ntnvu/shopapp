"use strict"

module.exports = angular.module("products.factory", [])
    .factory('ProductService', function ($q, $http, $localstorage, $ionicLoading, $rootScope) {
        var products = [];
        var filter = {
            limit: 20,
            type: ''
        };
        var isLoadMore = [];
        var current_index = 0;
        var current_position = 0;

        function add_product(data) {
            var array = $.map(data, function (value, index) {
                return [value];
            });

            for (var i = array.length - 1; i >= 0; i--) {
                products[current_index] = array[i];
//              products.push(array[i]);
                current_index++;
            }
        }

        return{
            setCurrentPos: function(pos){
                current_position = pos;
            },
            getCurrentPos: function(){
                return current_position;
            },
            filterProduct: function () {
                var deferred = $q.defer();
                var promise = deferred.promise;

                filter.limit = 20;
                if (filter.page == 1) {
                    this.clearProducts();
                    $ionicLoading.show({
                        template: 'Loading...'
                    });
                    filter.limit = 20;
                }

                $localstorage.getKeyTime().then(
                    function (md5key) {
                        var link_ajax = "http://shop10k.qrmartdemo.info/api/rest/products";
                        $http.get("http://shop10k.qrmartdemo.info/web_api.php?r=" + filter.type + "&limit=" + filter.limit + "&page=" + filter.page + "&key=" + md5key).then(function (resp) {
                            if (!resp.data.Error) {
                                add_product(resp.data);

                                $ionicLoading.hide();

                                $localstorage.updateArray(products, $localstorage.getObject("cart"), "added");
                                $localstorage.updateArray(products, $localstorage.getObject("wishlist"), "like");

                                deferred.resolve(filter.page);
                            }
                            else {
                                deferred.reject(filter.page);
                            }
                        }, function (err) {
                            // err.status will contain the status code
                            console.error('ERR', err);
                            deferred.reject('ERR ' + err);
                        })
                    },
                    function () {
                        deferred.reject("wrong key");
                    }
                )


                return promise;
            },

            setPage: function (number) {
                filter.page = number;
            },

            setType: function (type) {
                filter.type = type;
            },

            getType: function () {
                return filter.type;
            },

            getPage: function () {
                return filter.page;
            },

            getIndex: function () {
                return current_index;
            },

            addAttribute: function (item, index) {
                for (var i in products) {
                    if (products[i].entity_id == item.entity_id) {
                        products[i][index] = item[index];
                    }
                }
            },

            updateLoadmore: function (load) {
                isLoadMore[0] = load;
            },

            clearProducts: function () {
                products.length = 0;
                current_index = 0;
            },

            init: function (number) {
                for (var i = 0; i < number; i++) {
                    products.push({
                        "loading": true
                    });
                }
            },

            filter: filter,

            loadMore: isLoadMore,

            productCurrent: products
        }
    }
)
;