"use strict"

module.exports = angular.module("products.factory", [])
    .factory('ProductService', function ($q, $http, $localstorage) {
        var products = [];
        var page = {
            number : 1
        };//should use object or array, don't use a single variable

        return{
            filterProduct: function (filterType, ajax, page_next) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                var link_ajax = "http://liquordelivery.com.sg/wp-admin/admin-ajax.php";
                $http.get(link_ajax + "?action=latest_products_app&filter=" + filterType + "&page=" + page_next).then(function (resp) {

                    if (ajax) {
                        products = products.concat(resp.data);
                    }
                    else {
                        products = resp.data;
                    }

                    products = $localstorage.updateArray(products, $localstorage.getObject("wishlist"));
                    products = $localstorage.updateArray(products, $localstorage.getObject("cart"));

                    deferred.resolve(products);
                    // For JSON responses, resp.data contains the result
                }, function (err) {
                    console.error('ERR', err);
                    deferred.reject('ERR ' + err);
                    // err.status will contain the status code
                })

                return promise;
            },

            viewDetail: function (index) {
                return products[index];
            },

            productCurrent : products,

            page : page
        }
    });