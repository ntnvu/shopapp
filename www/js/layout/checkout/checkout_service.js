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
                else if(i < 5){
                    //add child attribute to method which is child.
                    names[cur.title].method[0].child = true;
                    cur.child = true;
                }

                cur.price = parseInt(cur.price);
                names[cur.title].method.push(cur);
            }
            console.log(newArr);
            return newArr;
        }

        function get_shipping_method(){
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get("http://shop10k.qrmartdemo.info/web_api.php?r=shipping")
                .then(function (resp) {
                    var newData = transformArr(resp.data);
                    deferred.resolve(newData);

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
                if (checkout_info.methodShip.price)
                    checkout_info.grandTotal = CartService.convertMoney(0, ",", ".", (checkout_info.total + checkout_info.methodShip.price));
                else
                    checkout_info.grandTotal = CartService.convertMoney(0, ",", ".", checkout_info.total);
            },

            addShipping: function (methodShip) {
                if (methodShip.child) {
                    methodShip.shipAddress = methodShip.title + " - " + methodShip.name;
                }
                checkout_info.methodShip = methodShip;

                checkout_info.methodShipText = CartService.convertMoney(0, ",", ".", checkout_info.methodShip.price);
                checkout_info.grandTotal = CartService.convertMoney(0, ",", ".", (checkout_info.total + checkout_info.methodShip.price));
            },

            setOrder: function () {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var cart = $localstorage.getObject("cart");

                $http.post("http://shop10k.qrmartdemo.info/web_api.php", {
                        r: "user",
                        check: "longanhvn@gmail.com",
                        password: "longanh@123",
                        order: true,
                        productid: 1717,
                        qty: 1,
                        payment: "banktransfer",
                        shipping: "flatrate",
                        firstname: "longanh",
                        lastname: "dang",
                        postcode: "70000",
                        city: "quan5",
                        region: "hcm",
                        street: "164 Tran Binh Trong",
                        telephone: "0981112451"
                    },
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }
                )
//                $http.get("http://shop10k.qrmartdemo.info/web_api.php?r=user&check=longanhvn@gmail.com&password=longanh@123&order=true&productid=1717&qty=1&payment=banktransfer&shipping=flatrate&firstname=longanh&lastname=dang&postcode=70000&city=quan5&region=hcm&street=tran%20binh%20trong&telephone=098444444")
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