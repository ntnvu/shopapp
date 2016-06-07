'use strict';

module.exports = angular.module('checkout.service', [])
    .factory('CheckoutService', function ($q, $localstorage, CartService, $http) {
        var checkout_info = {
            total: 0,
            grandTotal: 0,
            methodShipText: 0,
            methodShip: {}
        };

        function transformArr(orig) {
            var orig_new = [];
            for (var key in orig) {
                orig_new.push(orig[key]);
            }
            var newArr = [],
                names = {},
                i, j, cur;
            for (i = 0, j = orig_new.length; i < j; i++) {
                cur = orig_new[i];
                if (!(cur.title in names)) {
                    names[cur.title] = {title: cur.title, method: []};
                    newArr.push(names[cur.title]);
                }
                else if (i < 5) {
                    //add child attribute to method which is child.
                    names[cur.title].method[0].child = true;
                    cur.child = true;
                }

                cur.price = parseInt(cur.price);
                names[cur.title].method.push(cur);
            }
            return newArr;
        }

        function get_shipping_method() {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $localstorage.getKeyTime().then(
                function (md5key) {
                    $http.get("http://shop10k.qrmartdemo.info/web_api.php?r=shipping" + "&key=" + md5key)
                        .then(function (resp) {
                            var newData = transformArr(resp.data);
                            deferred.resolve(newData);

                        }, function (err) {
                            // err.status will contain the status code
                            console.error('ERR', err);
                            deferred.reject('ERR ' + err);
                        })
                }
            )

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }

            return promise;
        }

        var payment_method = {
            "A": "Cash On Delivery (thanh toán khi nhận hàng)",
            "B": "Bank Transfer Payment (chuyển qua ngân hàng)"
        };

        return {
            updateCheckoutInfo: function (info) {
                for (var i in info) {
                    checkout_info[i] = info[i];
                }
            },

            sumTotal: function () {
                checkout_info.total = CartService.sumCart();
                checkout_info.totalText = CartService.convertMoney(0, ",", ".", checkout_info.total);
                if (checkout_info.methodShip.price) {
                    checkout_info.grandTotal = CartService.convertMoney(0, ",", ".", (checkout_info.total + checkout_info.methodShip.price));
                }
                else {
                    checkout_info.grandTotal = CartService.convertMoney(0, ",", ".", checkout_info.total);
                }
            },

            addShipping: function (methodShip) {
                if (methodShip.child) {
                    methodShip.shipAddress = methodShip.title + " - " + methodShip.name;
                }
                checkout_info.methodShip = methodShip;

                checkout_info.methodShipText = CartService.convertMoney(0, ",", ".", checkout_info.methodShip.price);
                if (checkout_info.methodShip.price) {
                    checkout_info.grandTotal = CartService.convertMoney(0, ",", ".", (checkout_info.total + checkout_info.methodShip.price));
                }
                else {
                    checkout_info.grandTotal = CartService.convertMoney(0, ",", ".", checkout_info.total);
                }
            },

            setOrder: function () {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var cart = $localstorage.getObject("cart");

                for (var i = 0; i < cart.length; i++) {
                    delete cart[i].description;
                    delete cart[i].href;
                    delete cart[i].name;
                    delete cart[i].price;
                    delete cart[i].price_number;
                    delete cart[i].thumb;
                    delete cart[i].added;
                    delete cart[i]["$index"];
                    delete cart[i]["$$hashKey"];
                }
                var name_obj = checkout_info.name.split(" ");
                var first_name = name_obj[0];
                var last_name_arr = name_obj.slice(1);
                var last_name = "";
                for (var i = 0; i < last_name_arr.length; i++) {
                    last_name += last_name_arr[i] + " ";
                }

                $http.get("http://shop10k.qrmartdemo.info/web_api.php?r=guest&order=true&products=" + encodeURIComponent(JSON.stringify(cart)) + "&payment=banktransfer&shipping=" + checkout_info.methodShip.type + "&lastname=" + last_name + "&firstname=" + first_name + "&postcode=70000&city=" + checkout_info.city + "&region=" + checkout_info.district + "&street=" + checkout_info.address + "&telephone=" + checkout_info.phone + "")
                    .then(function (resp) {
                        if (!resp.data.error) {
                            deferred.resolve(resp.data);
                        }
                        else {
                            deferred.reject(resp.data.error);
                        }
                    }, function (err) {
                        // err.status will contain the status code
                        console.error('ERR', err);
                        deferred.reject('ERR ' + err);
                    })

                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }

                return promise;
            },

            checkoutInfo: checkout_info,

            shippingInfo: get_shipping_method,

            paymentInfo: payment_method
        }
    });