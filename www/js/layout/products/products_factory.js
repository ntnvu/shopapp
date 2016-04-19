"use strict"

module.exports = angular.module("products.factory", [])
    .factory('ProductService', function ($q, $http, $localstorage) {
        var products = [];
        var page = {
            number: 1
        };//should use object or array, don't use a single variable

        function edit_object_return(products) {
            var temp = [];
            $.each(products, function (key, value) {
                value.id = value.entity_id;
                temp.push(value);
            })
            temp.reverse();
            return temp;
        }

        return{
            filterProduct: function (filterType, ajax, page_next) {
                var deferred = $q.defer();
                var promise = deferred.promise;
//                var link_ajax = "http://liquordelivery.com.sg/wp-admin/admin-ajax.php";
//                $http.get(link_ajax + "?action=latest_products_app&filter=" + filterType + "&page=" + page_next).then(function (resp) {

                var link_ajax = "http://shop10k.qrmartdemo.info/api/rest/products";
                $http.get(link_ajax + "?page=" + page_next + "&limit=20&order=entity_id&dir=dsc").then(function (resp) {

                    if (!Array.isArray(resp.data))
                        resp.data = edit_object_return(resp.data);

                    if (ajax) {
                        products = products.concat(resp.data);
                        console.log(products);
                    }
                    else {
                        products = resp.data;
                    }


//                    products = $localstorage.updateArray(products, $localstorage.getObject("wishlist"));
//                    products = $localstorage.updateArray(products, $localstorage.getObject("cart"));

                    deferred.resolve(products);
                    // For JSON responses, resp.data contains the result
                }, function (err) {
                    console.error('ERR', err);
                    deferred.reject('ERR ' + err);
                    // err.status will contain the status code
                })

                return promise;
            },

            productCurrent: products,

            page: page
        }
    });