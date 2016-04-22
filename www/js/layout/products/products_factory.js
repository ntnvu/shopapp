"use strict"

module.exports = angular.module("products.factory", [])
    .factory('ProductService', function ($q, $http, $localstorage) {
        var products = [];
        var filter = {
            page: 1,
            type: ''
        };

        function add_product(data) {
            var array = $.map(data, function (value, index) {
                return [value];
            });

            for (var i = array.length - 1; i >= 0; i--) {
                products.push(array[i]);
            }
        }

        return{
            filterProduct: function () {
                var deferred = $q.defer();
                var promise = deferred.promise;
//                var link_ajax = "http://liquordelivery.com.sg/wp-admin/admin-ajax.php";
//                $http.get(link_ajax + "?action=latest_products_app&filter=" + filterType + "&page=" + page_next).then(function (resp) {
                if(filter.page == 1){
                     this.clearProducts();
                }

                var link_ajax = "http://shop10k.qrmartdemo.info/api/rest/products";
                $http.get(link_ajax + "?page=" + filter.page + "&limit=20&order=entity_id&dir=dsc").then(function (resp) {
                    add_product(resp.data);
                    deferred.resolve(filter.page++);

                    $localstorage.updateArray(products, $localstorage.getObject("cart"),"added");
                    $localstorage.updateArray(products, $localstorage.getObject("wishlist"), "like");

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

            addAttribute : function(item, index){
                for(var i in products){
                    if(products[i].entity_id == item.entity_id){
                        products[i][index] = item[index];
                    }
                }
            },

            clearProducts : function(){
                products.length = 0;
            },

            productCurrent: products,

            page: filter.page
        }
    });