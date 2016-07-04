'use strict';

module.exports = angular.module('checkout.service', [])
    .factory('CheckoutService', function ($q, $localstorage, CartService, $http, UserService, LoginService) {
        var checkout_info = {
            total: 0,
            grandTotal: 0,
            methodShipText: 0,
            methodShip: {},
            methodPayment: {},
            user: {}
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

        function get_payment_method() {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $localstorage.getKeyTime().then(
                function (md5key) {
                    $http.get("http://shop10k.qrmartdemo.info/web_api.php?r=payment" + "&key=" + md5key)
                        .then(function (resp) {
                            var newData = resp.data;
                            var arr = [];
                            $.each(newData, function (key, value) {
                                if (key !== "paypal_billing_agreement")
                                    arr.push({"type": key, "name": value});
                            });
                            deferred.resolve(arr);

                        }, function (err) {
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

        return {
            updateCheckoutInfo: function (info) {
                for (var i in info) {
                    this.checkoutInfo[i] = info[i];
                }
            },

            updateCheckoutInfoUser: function(info){
                for (var i in info) {
                    this.checkoutInfo["user"][i] = info[i];
                }
                console.log(this.checkoutInfo);
            },

            sumTotal: function () {
                this.checkoutInfo.total = CartService.sumCart();

                this.checkoutInfo.totalText = CartService.convertMoney(0, ",", ".", this.checkoutInfo.total);
                if (this.checkoutInfo.methodShip.price) {
                    this.checkoutInfo.grandTotal = CartService.convertMoney(0, ",", ".", (this.checkoutInfo.total + this.checkoutInfo.methodShip.price));
                }
                else {
                    this.checkoutInfo.grandTotal = CartService.convertMoney(0, ",", ".", this.checkoutInfo.total);
                }
            },

            addShipping: function (methodShip) {
                if (methodShip.child) {
                    methodShip.shipAddress = methodShip.title + " - " + methodShip.name;
                }
                this.checkoutInfo.methodShip = methodShip;

                this.checkoutInfo.methodShipText = CartService.convertMoney(0, ",", ".", this.checkoutInfo.methodShip.price);
                if (this.checkoutInfo.methodShip.price) {
                    this.checkoutInfo.grandTotal = CartService.convertMoney(0, ",", ".", (this.checkoutInfo.total + this.checkoutInfo.methodShip.price));
                }
                else {
                    this.checkoutInfo.grandTotal = CartService.convertMoney(0, ",", ".", this.checkoutInfo.total);
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

                LoginService.splitUsername(this.checkoutInfo.user);

                var api_url = "http://shop10k.qrmartdemo.info/web_api.php?r=guest";
                if (UserService.isLogin()) {
                    api_url = "http://shop10k.qrmartdemo.info/web_api.php?r=user&check=" + this.checkoutInfo.user.email + "&password=" + this.checkoutInfo.user.password;
                }

                var cus_address = this.checkoutInfo.address;
                if (this.checkoutInfo.methodShip.type === 'freeshipping') {
                    cus_address = "Tự lấy hàng tại cửa hàng 164 trần bình trọng Q5 - HCM";
                }
                $http.get(api_url + "&order=true&products=" + encodeURIComponent(JSON.stringify(cart)) + "&payment=" + this.checkoutInfo.methodPayment.type + "&shipping=" + this.checkoutInfo.methodShip.type + "&lastname=" + this.checkoutInfo.user.lastname + "&firstname=" + this.checkoutInfo.user.firstname + "&postcode=70000&city=" + this.checkoutInfo.user.city + "&region=" + this.checkoutInfo.user.district + "&street=" + cus_address + "&telephone=" + this.checkoutInfo.user.phone + "")
                    .then(function (resp) {
                        if (!resp.data.error && !resp.data.note) {
                            deferred.resolve(resp.data);
                        }
                        else {
                            deferred.reject(resp.data.error);
                        }
                    }, function (err) {
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

            resetCheckoutInfo: function () {
                this.checkoutInfo.total = 0;
                this.checkoutInfo.grandTotal = 0;
                this.checkoutInfo.methodShipText = 0;
                this.checkoutInfo.methodShip = {};
                this.checkoutInfo.methodPayment = {};
            },

            resetCheckoutInfoLoginNout: function(){
                this.resetCheckoutInfo();
                this.checkoutInfo.user = {};
            },

            checkoutInfo: checkout_info,

            shippingInfo: get_shipping_method,

            paymentInfo: get_payment_method
        }
    });