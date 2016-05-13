'use strict';

module.exports = angular.module('checkout.service', [])
    .factory('CheckoutService', function ($q, $localstorage, CartService, $http) {
        var checkout_info = {
            total: 0,
            grandTotal: 0,
            methodShipText: 0,
            methodShip: {}
        };

        function get_shipping_method(){
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get("http://shop10k.qrmartdemo.info/web_api.php?r=shipping")
                .then(function (resp) {
                    deferred.resolve(resp.data);

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

        var shipping_method = {
            "A": {
                text: "T? l?y hàng t?i c?a hàng 164 Tr?n Bình Tr?ng Q5 - HCM 0?",
                value: 0
            },
            "B": {
                text: "Qu?n 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, Tân Bình, Tân Phú, Phú Nhu?n, Bình Th?nh, Gò V?p",
                method: [
                    {
                        index: "B",
                        text: "1 ngày (15.000 ?)",
                        value: 15000
                    },
                    {
                        index: "B",
                        text: "2-3 ngày (12.000 ?)",
                        value: 12000
                    }
                ]
            },
            "C": {
                text: "Qu?n 9, 12, Bình Tân, Th? ??c",
                method: [
                    {
                        index: "C",
                        text: "1 ngày (25.000 ?)",
                        value: 25000
                    },
                    {
                        index: "C",
                        text: "2-3 ngày (20.000 ?)",
                        value: 20000
                    }
                ]
            },
            "D": {
                text: "C? Chi, Nhà Bè, Bình Chánh, Hóc Môn, C?n Gi? (30.000 ?)",
                value: 30000
            },
            "E": {
                text: "T?nh, Thành ph? ngoài Tp.H? Chí Minh (T? v?n viên s? liên h? v?i KH qua ?T thông báo phí & th?i gian giao hàng)",
                value: 0
            }
        };

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
                if (checkout_info.methodShip.value)
                    checkout_info.grandTotal = CartService.convertMoney(0, ",", ".", (checkout_info.total + checkout_info.methodShip.value));
                else
                    checkout_info.grandTotal = CartService.convertMoney(0, ",", ".", checkout_info.total);
            },

            addShipping: function (methodShip) {
                if (methodShip.index) {
                    methodShip.text = shipping_method[methodShip.index].text + " - " + methodShip.text;
                }
                checkout_info.methodShip = methodShip;
                console.log(checkout_info.methodShip);
                checkout_info.methodShipText = CartService.convertMoney(0, ",", ".", checkout_info.methodShip.value);
                checkout_info.grandTotal = CartService.convertMoney(0, ",", ".", (checkout_info.total + checkout_info.methodShip.value));
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

            shippingInfo_1: shipping_method,

            paymentInfo: payment_method
        }
    });