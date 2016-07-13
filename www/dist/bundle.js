(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//module node
//require("angular");

//module functions
require("./modules/registerLogin/registerLogin");
require("./modules/contact/contact");
//module layout
require("./layout/home/home");
require("./layout/products/products");
require("./layout/menu/menu");
require("./layout/cart/cart");
require("./layout/checkout/checkout");
require("./layout/wishlist/wishlist");
require("./layout/user/user");
require("./app_service");

module.export = angular.module('starter', ['ionic', 'akoenig.deckgrid',
        //functions
        'registerLogin',
        'contact',

        //layout
        'home',
        'menu',
        'products',
        'cart',
        'checkout',
        'wishlist',
        'user',

        'app.service',

    ])
    .config(require('./router'))

    .run(require('./app-main'));




},{"./app-main":2,"./app_service":3,"./layout/cart/cart":4,"./layout/checkout/checkout":7,"./layout/home/home":11,"./layout/menu/menu":13,"./layout/products/products":16,"./layout/user/user":19,"./layout/wishlist/wishlist":22,"./modules/contact/contact":25,"./modules/registerLogin/registerLogin":29,"./router":31}],2:[function(require,module,exports){
'use strict';
function AppMain($ionicPlatform, $state){
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            cordova.plugins.Keyboard.disableScroll(true);//maybe it fix scroll up when focus input on IOS
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

    $ionicPlatform.on('resume', function(){
//        $state.go('home');
    });
}

module.exports = ['$ionicPlatform', '$state', AppMain];
},{}],3:[function(require,module,exports){
"use strict"

module.exports = angular.module("app.service", [])
    .factory('$localstorage', function ($q, $http, $window, $ionicHistory) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },

            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },

            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },

            setNull: function (key) {
                this.setObject(key, {});
            },
            setNullAll: function () {
                $window.localStorage.clear();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
            },

            addObject: function (key, value) {
                var value = new Array(value);
                var arr = this.getObject(key);
                if (arr.length > 0) {
                    var shared = false;
                    for (var i in arr) {
                        if (arr[i].entity_id == value[0].entity_id) {
                            shared = true;
                            break;
                        }
                    }
                    if (!shared) {
                        value = value.concat(arr);
                    }
                    else {
                        value = arr;
                    }
                }
                this.setObject(key, value);
            },

            /*
             * objArrNeedUpdate : is an array need update after main array is
             * */
            removeObject: function (key, item) {
                var arr = this.getObject(key);
                for (var i in arr) {
                    if (arr[i].entity_id == item.entity_id) {
                        arr.splice(i, 1);
                        break;
                    }
                }
                this.setObject(key, arr);
            },

            mergeArray: function (arr1, arr2) {
                var arr3 = [];
                for (var i in arr1) {
                    var shared = false;
                    for (var j in arr2)
                        if (arr2[j].entity_id == arr1[i].entity_id) {
                            shared = true;
                            break;
                        }
                    if (!shared) arr3.push(arr1[i])
                }
                arr3 = arr3.concat(arr2);
                return arr3;
            },
            //input 2 array
            //return array contain all elements which are in both array and update follow arr2
            updateArray: function (arr1, arr2, key) {
                for (var i in arr1) {
                    for (var j in arr2) {
                        if (arr2[j].entity_id == arr1[i].entity_id) {

                            arr1[i][key] = arr2[j][key];
                        }
                    }
                }
            },

            addAttribute: function (key, item, index) {
                var arr = this.getObject(key);
                if (arr.length > 0) {
                    for (var i in arr) {
                        if (arr[i].entity_id == item.entity_id) {
                            arr[i][index] = item[index];
                        }
                    }
                    this.setObject(key, arr);
                }
            },

            addAttributeAll: function (key, attr, value) {
                var arr = this.getObject(key);
                if (arr.length > 0) {
                    for (var i in arr) {
                        arr[i][attr] = value;
                    }
                    this.setObject(key, arr);
                }
            },

            getKeyTime: function () {
                var deferred = $q.defer();
                var promise = deferred.promise;


                var link_ajax = "http://shop10k.vn/web_api.php?r=timespam";
                $http.get(link_ajax).then(function (resp) {
                    if (!resp.data.error) {
                        var key = resp.data.timespam + 'app';
                        var md5key = md5(key);
                        deferred.resolve(md5key);
                        console.log(encodeURIComponent(JSON.stringify([{"productid":"1873","quantity":"2"},{"productid":"1871","quantity":"2"}])));
                    }
                    else {
                        deferred.reject(resp.data.error);
                    }
                }, function (err) {
                    // err.status will contain the status code
                    console.error('ERR', err);
                    deferred.reject('ERR ' + err);
                })
                return promise;
            }
        }
    })
    .service('ControlModalService', function ($q, $ionicModal, $rootScope, $timeout, $controller) {
        return {
            show: show
        }
        function show(templeteUrl, controller, autoshow, parameters, options, wrapCalss) {
            // Grab the injector and create a new scope
            var deferred = $q.defer(),
                ctrlInstance,
                modalScope = $rootScope.$new(),
                thisScopeId = modalScope.$id,
                defaultOptions = {
                    animation: 'slide-in-up',
                    focusFirstInput: false,
                    backdropClickToClose: true,
                    hardwareBackButtonClose: true,
                    modalCallback: null
                };

            options = angular.extend({}, defaultOptions, options);

            $ionicModal.fromTemplateUrl(templeteUrl, {
                scope: modalScope,
                animation: options.animation,
                focusFirstInput: options.focusFirstInput,
                backdropClickToClose: options.backdropClickToClose,
                hardwareBackButtonClose: options.hardwareBackButtonClose
            }).then(function (modal) {
                    modalScope.modal = modal;

                    modalScope.openModal = function () {
                        modalScope.modal.show();
                    };

                    modalScope.closeModal = function (result) {
                        deferred.resolve(result);
                        modalScope.modal.hide();
                    };

                    modalScope.$on('modal.hidden', function (thisModal) {
                        if (thisModal.currentScope) {
                            var modalScopeId = thisModal.currentScope.$id;
                            if (thisScopeId === modalScopeId) {
                                deferred.resolve(null);
                                _cleanup(thisModal.currentScope);
                            }
                        }
                    });

                    // Invoke the controller
                    var locals = { '$scope': modalScope, 'parameters': parameters };
                    var ctrlEval = _evalController(controller);
                    ctrlInstance = $controller(controller, locals);
                    if (ctrlEval.isControllerAs) {
                        ctrlInstance.openModal = modalScope.openModal;
                        ctrlInstance.closeModal = modalScope.closeModal;
                    }

                    if (autoshow) {
                        modalScope.modal.show()
                            .then(function () {
                                modalScope.$broadcast('modal.afterShow', modalScope.modal);
                            });
                    }

                    if (angular.isFunction(options.modalCallback)) {
                        options.modalCallback(modal);
                    }

                }, function (err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }

        function _cleanup(scope) {
            scope.$destroy();
            if (scope.modal) {
                scope.modal.remove();
            }
        }

        function _evalController(ctrlName) {
            var result = {
                isControllerAs: false,
                controllerName: '',
                propName: ''
            };
            var fragments = (ctrlName || '').trim().split(/\s+/);
            result.isControllerAs = fragments.length === 3 && (fragments[1] || '').toLowerCase() === 'as';
            if (result.isControllerAs) {
                result.controllerName = fragments[0];
                result.propName = fragments[2];
            } else {
                result.controllerName = ctrlName;
            }

            return result;
        }
    });
},{}],4:[function(require,module,exports){
'use strict';

require('./cart_service.js');
require('./cart_controller.js');
require('.././products/products');
require('.././checkout/checkout');
require('../.././app_service');

module.exports = angular.module("cart", ['app.service', 'checkout', 'products', 'cart.services', 'cart.controller']);






},{"../.././app_service":3,".././checkout/checkout":7,".././products/products":16,"./cart_controller.js":5,"./cart_service.js":6}],5:[function(require,module,exports){
'use strict';

module.exports = angular.module('cart.controller', [])
    .controller("CartController", ['$scope', '$localstorage', 'WishlistService', 'CartService', 'CheckoutService', '$state',
        function ($scope, $localstorage, WishlistService, CartService, CheckoutService, $state) {
            $scope.cartlist = $localstorage.getObject("cart");
            $scope.lengthCart = $scope.cartlist.length;
            CartService.setCartNumber();
            $scope.cartNumber = CartService.getCartNumber();
            $scope.total = CartService.convertMoney(0, ",", ".", CartService.sumCart());

            $scope.addToWishlist = function (item) {
                WishlistService.addWishlist(item);
            }

            $scope.removeFromCart = function (item) {
                CartService.removeCart(item);
                $scope.cartlist = $localstorage.getObject("cart");
                $scope.lengthCart = $scope.cartlist.length;
                $scope.cartNumber = CartService.getCartNumber();
                $scope.total = CartService.convertMoney(0, ",", ".", CartService.sumCart());
            }

            $scope.cart_checkout = function () {
                CheckoutService.sumTotal();
                $state.go('menu.checkout');
            }

            $scope.$on('CartUpdate', function (event, data) {
                $scope.total = CartService.sumCart();
                $scope.cartNumber = CartService.getCartNumber();
            });

            $scope.updateQty = function (item) {
                $localstorage.addAttribute("cart", item, "quantity");
                $scope.total = CartService.convertMoney(0, ",", ".", CartService.sumCart());
            };
        }]);
},{}],6:[function(require,module,exports){
'use strict';

module.exports = angular.module('cart.services', [])
    .service('CartService', function ($q, $localstorage, $rootScope, ProductService) {
        var cartNumber = 0;
        return {
            addCart: function (item) {
                if (!item.added) {
                    cartNumber++;
                    item.added = !item.added;
                    item.quantity = 1;
                    $localstorage.addObject("cart", item);
                    $localstorage.addAttribute("wishlist", item, "added");
                    ProductService.addAttribute(item, "added");

                    $rootScope.$broadcast("CartUpdate");
                }
                else {
                    this.removeCart(item);
                }
            },

            removeCart: function (item) {
                cartNumber--;
                item.added = !item.added;
                $localstorage.removeObject("cart", item);
                $localstorage.addAttribute("wishlist", item, "added", false);
                ProductService.addAttribute(item, "added", false);

                $rootScope.$broadcast("CartUpdate");
            },

            sumCart: function () {
                var cart = $localstorage.getObject("cart");
                var total = 0;
                for (var i in cart) {
                    total += parseInt(cart[i].price_number * cart[i].quantity);
                }
                return total;
            },

            convertMoney : function(c, d, t, number){
                var n = number,
                    c = isNaN(c = Math.abs(c)) ? 2 : c,
                    d = d == undefined ? "." : d,
                    t = t == undefined ? "," : t,
                    s = n < 0 ? "-" : "",
                    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
                    j = (j = i.length) > 3 ? j % 3 : 0;
                return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "") + " đ ";
            },

            setCartNumber : function(){
                cartNumber = $localstorage.getObject("cart").length > 0 ? $localstorage.getObject("cart").length : 0;
            },

            getCartNumber : function(){
                return $localstorage.getObject("cart").length;
            }
        }
    });
},{}],7:[function(require,module,exports){
'use strict';

require('./checkout_controller');
require('./checkout_edit_controller');
require('./checkout_service');
require('.././user/user');
require(".././products/products");
require('../.././app_service');

module.exports = angular.module("checkout", ['app.service', 'user', 'products', 'checkout.service', 'checkout.controller', 'checkoutEdit.controller'])
},{"../.././app_service":3,".././products/products":16,".././user/user":19,"./checkout_controller":8,"./checkout_edit_controller":9,"./checkout_service":10}],8:[function(require,module,exports){
'use strict';

module.exports = angular.module('checkout.controller', [])
    .controller("CheckoutController", ['$scope', '$localstorage', 'ControlModalService', '$state', '$rootScope', 'CheckoutService', 'UserService', 'ProductService', '$ionicPopup', '$ionicHistory',
        function ($scope, $localstorage, ControlModalService, $state, $rootScope, CheckoutService, UserService, ProductService, $ionicPopup, $ionicHistory) {
            $scope.user = UserService.currentUser;
            $scope.checkoutInfo = CheckoutService.checkoutInfo;

            if (Object.keys($scope.checkoutInfo["methodShip"]).length === 0) {
                CheckoutService.shippingInfo().success(function (data) {
                    var shippingInfo = data;
                    $scope.checkoutInfo["methodShip"] = shippingInfo[0].method[0];
                });
            }

            if (Object.keys($scope.checkoutInfo["methodPayment"]).length === 0) {
                CheckoutService.paymentInfo().success(function (data) {
                    $scope.checkoutInfo["methodPayment"] = data[1];
                });
            }

            CheckoutService.updateCheckoutInfoUser($scope.user);

            $scope.checkout = function () {
                if (!$scope.checkoutInfo.user.name) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Bổ sung',
                        template: 'Vui lòng nhập tên'
                    });
                }
                else if (!$scope.checkoutInfo.user.address && ($scope.checkoutInfo.methodShip.type != 'freeshipping')) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Bổ sung',
                        template: 'Vui lòng nhập địa chỉ giao hàng'
                    });
                }
                else {
                    CheckoutService.setOrder()
                        .success(function () {
                            $ionicPopup.alert({
                                title: 'Đặt mua thành công',
                                template: 'Xin cảm ơn quý khách'
                            }).then(function () {
                                    $localstorage.setNull("cart");
                                    $localstorage.addAttributeAll("wishlist", "added", false);//remove add to card attr in wishlist

                                    $rootScope.$broadcast("CartUpdate");
                                    $rootScope.$broadcast("CloseOrder");

                                    $ionicHistory.clearHistory();
                                    $ionicHistory.clearCache();

                                    CheckoutService.resetCheckoutInfo();
                                    CheckoutService.shippingInfo().success(function (data) {
                                        var shippingInfo = data;
                                        $scope.checkoutInfo["methodShip"] = shippingInfo[0].method[0];
                                    });

                                    CheckoutService.paymentInfo().success(function (data) {
                                        $scope.checkoutInfo["methodPayment"] = data[1];
                                    });

                                    ProductService.setPage(1);
                                    ProductService.filterProduct().then(function () {
                                        console.log("success")
                                    }, function () {
                                        $ionicLoading.hide();
                                        $ionicPopup.alert({
                                            title: 'Lỗi',
                                            template: 'Bạn vui lòng thử chọn lại sản phẩm'
                                        });
                                    });

                                    $state.go("menu.products");
                                });
                        });
                }
            }
        }]);
},{}],9:[function(require,module,exports){
'use strict';

module.exports = angular.module('checkoutEdit.controller', [])
    .controller("CheckoutEditController", ['$scope', '$localstorage', 'UserService', 'CheckoutService', '$state', 'CartService','$ionicHistory',
        function ($scope, $localstorage, UserService, CheckoutService, $state, CartService, $ionicHistory) {
            $scope.regex2Word = '/^(\d)+$/';

            $scope.checkoutInfo = CheckoutService.checkoutInfo;

            CheckoutService.shippingInfo().success(function (data) {
                $scope.shippingInfo = data;
            })

            CheckoutService.paymentInfo().success(function (data) {
                $scope.paymentInfo = data;
            })

            $scope.below50 = false;
            $scope.below100 = false;
            $scope.total_temp = CartService.sumCart();
            if ($scope.total_temp < 50000) {
                $scope.below50 = true;
            }
            else if ($scope.total_temp < 100000) {
                $scope.below100 = true;
            }

            $scope.updateCheckout = function () {
                CheckoutService.updateCheckoutInfo($scope.checkoutInfo);
                CheckoutService.addShipping($scope.checkoutInfo.methodShip);
                $state.go('menu.checkout');
            }

            $scope.compareObj = function (obj1, obj2) {
                if (typeof obj1 === "undefined" || typeof obj2 === "undefined") {
                    return;
                }
                if (obj1.type === obj2.type) {
                    return true;
                }
                return false;
            }
        }]);
},{}],10:[function(require,module,exports){
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
                    $http.get("http://shop10k.vn/web_api.php?r=shipping" + "&key=" + md5key)
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
                    $http.get("http://shop10k.vn/web_api.php?r=payment" + "&key=" + md5key)
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

                var api_url = "http://shop10k.vn/web_api.php?r=guest";

                var email = this.checkoutInfo.user.email;
                var cus_address = this.checkoutInfo.user.address;
                var city = " TP " + this.checkoutInfo.user.city;
                var district = " quận " + this.checkoutInfo.user.district;
                if (this.checkoutInfo.methodShip.type === 'freeshipping') {
                    cus_address = "Tự lấy hàng tại cửa hàng 164 trần bình trọng";
                    city = "TP HCM";
                    district = "quận 5";
                }

                if (UserService.isLogin()) {
                    api_url = "http://shop10k.vn/web_api.php?r=user&check=" + this.checkoutInfo.user.email + "&password=" + this.checkoutInfo.user.password;
                }
                $http.get(api_url + "&order=true&products=" + encodeURIComponent(JSON.stringify(cart)) + "&payment=" + this.checkoutInfo.methodPayment.type + "&shipping=" + this.checkoutInfo.methodShip.type + "&lastname=" + this.checkoutInfo.user.lastname + "&firstname=" + this.checkoutInfo.user.firstname + "&postcode=70000&city=" + city + "&district=" + district + "&street=" + cus_address + "&telephone=" + this.checkoutInfo.user.phone + "&email=" + email + "")
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
},{}],11:[function(require,module,exports){
'use strict';
require('./home_controller');
require('.././user/user');
require('../.././app_service');

module.exports = angular.module('home', ['app.service', 'user', "home.controller"]);


},{"../.././app_service":3,".././user/user":19,"./home_controller":12}],12:[function(require,module,exports){
'use strict';

module.exports = angular.module("home.controller", [])
    .controller("HomeController", ['$scope', 'LoginService','$localstorage','$state','ControlModalService','$timeout','UserService',
        function ($scope, LoginService, $localstorage, $state, ControlModalService, $timeout, UserService) {
            var currentUser = $localstorage.getObject("current_user");
            $timeout(function(){
                if(!UserService.isLogin()){
                    ControlModalService.show('js/modules/registerLogin/registerLogin.html', 'RegisterLoginController', 1);
                }else{
                    $state.go('menu.products');
                }
            }, 2000);


            $scope.load = function() {
                // do your $() stuff here
            };
        }]);
},{}],13:[function(require,module,exports){
"use strict"
require("./menu_controller");
require('.././user/user');
require(".././products/products");
require('../.././app_service');

module.exports = angular.module("menu", ['app.service', 'user', "products", "menu.controller"])
    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.backButton.previousTitleText(false).text('');
    });
},{"../.././app_service":3,".././products/products":16,".././user/user":19,"./menu_controller":14}],14:[function(require,module,exports){
"use strict"

module.exports = angular.module("menu.controller", [])
    .controller("MenuController", ['$scope', '$ionicSideMenuDelegate', 'ProductService', '$state', 'ControlModalService', '$localstorage', 'UserService','$ionicScrollDelegate','$ionicHistory','$ionicLoading','$ionicPopup','CheckoutService',
        function ($scope, $ionicSideMenuDelegate, ProductService, $state, ControlModalService, $localstorage, UserService, $ionicScrollDelegate, $ionicHistory, $ionicLoading, $ionicPopup, CheckoutService) {
            $scope.wishlistNumber = $localstorage.getObject("wishlist").length;
            $scope.cartNumber = $localstorage.getObject("cart").length;
            $scope.user = UserService.currentUser;
            UserService.isLogin();

            $scope.$on('UserLogin', function (event, data) {
                $scope.user = UserService.currentUser;
                CheckoutService.resetCheckoutInfoLoginNout();
            });
            $scope.$on('UserLogout', function (event, data) {
                $scope.user = UserService.currentUser;
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                CheckoutService.resetCheckoutInfoLoginNout();
            });

            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if (toState.name == "menu.products") {
                    $scope.showProductBackBtn = false;
                }
                else {
                    $scope.showProductBackBtn = true;
                }
            });

            $scope.$on('WishlistUpdate', function (event, data) {
                $scope.wishlistNumber = $localstorage.getObject("wishlist").length;
            });

            $scope.$on('CartUpdate', function (event, data) {
                $scope.cartNumber = $localstorage.getObject("cart").length;
            });

            $scope.filterType = [
                {type: "all", name: 'Sản phẩm mới'},
                {type: "promo", name: 'Sản phẩm khuyến mãi'},
                {type: "price50k" , name: 'Duoi 50.000'},
                {type: "price100k" , name: '50.000 den 100.000'},
                {type: "price200k" , name: '100.000 den 200.000'},
                {type: "price200up" , name: 'Tren 200.000'}
            ];

            $scope.openMenu = function () {
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.$on('CloseOrder', function (event, data) {
                $scope.type = ProductService.getType();
            });

            $scope.getProducts = function (type) {
                $scope.type = type;
                $state.go("menu.products");
                $ionicScrollDelegate.scrollTop();
                ProductService.setType(type);
                ProductService.setPage(1);
                ProductService.updateLoadmore(true);
                ProductService.filterProduct().then(function(){
                    console.log("success")
                }, function(){
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Lỗi',
                        template: 'Bạn vui lòng thử chọn lại sản phẩm'
                    });
                });
            }

            $scope.contact = function () {
                ControlModalService.show('js/modules/contact/contact.html', 'ContactController', 1);
            }

            $scope.show_cart = function () {
                $state.go("menu.cart");
            }

            $scope.user_info = function () {
                $state.go("menu.user");
            }

            $scope.to_login = function () {
                ControlModalService.show('js/modules/registerLogin/registerLogin.html', 'RegisterLoginController', 1);
            }

            $scope.signout = function () {
                UserService.signOut();
            }

            $scope.getProducts("all");
        }
    ]);

},{}],15:[function(require,module,exports){
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
                        $http.get(link_ajax_new + "?r=category&id=" + $scope.product.category[0].category_id + "&limit=6&key=" + md5key).then(function (relate) {
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

            $scope.index_number = 1;
            $scope.slideHasChanged = function($index){
                $scope.index_number = $index + 1;
            }
        }]);


},{}],16:[function(require,module,exports){
"use strict"
require("./products_factory.js");
require("./products_controller.js");
require("./product_controller.js");
require('.././wishlist/wishlist_service.js');
require('.././cart/cart_service.js');
require('../.././app_service');

module.exports = angular.module("products", ['app.service', 'wishlist.service', 'cart.services', "products.factory", "products.controller", "product.controller"])
    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.backButton.previousTitleText(false).text('');
    });
},{"../.././app_service":3,".././cart/cart_service.js":6,".././wishlist/wishlist_service.js":24,"./product_controller.js":15,"./products_controller.js":17,"./products_factory.js":18}],17:[function(require,module,exports){
"use strict"

module.exports = angular.module("products.controller", [])
    .controller("ProductsController", ['$scope', '$ionicSideMenuDelegate', 'ProductService', 'ControlModalService', 'WishlistService', 'CartService', 'CheckoutService','UserService',
        function ($scope, $ionicSideMenuDelegate, ProductService, ControlModalService, WishlistService, CartService, CheckoutService, UserService) {
            $scope.cartNumber = CartService.getCartNumber();

            $scope.$on('UserLogout', function (event, data) {
                CheckoutService.resetCheckoutInfo();
            });

            $scope.products = ProductService.productCurrent;
            CartService.setCartNumber();

            $scope.total = CartService.convertMoney(0, ",", ".", CartService.sumCart());
            $scope.loadMore = ProductService.loadMore;
            $scope.user = UserService.currentUser;

            $scope.openMenu = function () {
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.loadMoreData = function () {
                if($scope.loadMore[0]){
//                    ProductService.init(9);

                    var temp = ProductService.getPage();
                    if(temp == 1){
                        ProductService.setPage(2);
                    }
                    ProductService.filterProduct().then(function (data) {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        ProductService.setPage(++data);
                    }, function(data){
                        ProductService.updateLoadmore(false);
                    });
                }
            };

            $scope.add_to_cart = function (item) {
                CartService.addCart(item);
            }

            $scope.addToWishlist = function (item) {
                WishlistService.addWishlist(item);
            }

            $scope.$on('CartUpdate', function (event, data) {
                $scope.cartNumber = CartService.getCartNumber();
                $scope.total = CartService.convertMoney(0, ",", ".", CartService.sumCart());
            });

            $scope.$on('$ionicView.enter', function (viewInfo, state) {
                $scope.cartNumber = CartService.getCartNumber();
                $scope.total = CartService.convertMoney(0, ",", ".", CartService.sumCart());
            });
        }
    ]);

},{}],18:[function(require,module,exports){
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
                        var link_ajax = "http://shop10k.vn/api/rest/products";
                        $http.get("http://shop10k.vn/web_api.php?r=" + filter.type + "&limit=" + filter.limit + "&page=" + filter.page + "&key=" + md5key).then(function (resp) {
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
},{}],19:[function(require,module,exports){
'use strict';

require('./user_service.js');
require('./user_controller.js');
require(".././products/products");
require('../.././app_service');

module.exports = angular.module("user", ['app.service', "products", 'user.service', 'user.controller']);
},{"../.././app_service":3,".././products/products":16,"./user_controller.js":20,"./user_service.js":21}],20:[function(require,module,exports){
'use strict';

module.exports = angular.module('user.controller', [])
    .controller("UserController", ['$scope','UserService','$ionicPopup',
        function ($scope, UserService, $ionicPopup) {
            $scope.user = UserService.currentUser;

            $scope.updateUser = function(){
                UserService.updateUser($scope.user).success(function(){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Cập nhật thành công',
                        template: 'Thông tin của bạn đã được thay đổi'
                    });
                })
            }
        }
    ]);
},{}],21:[function(require,module,exports){
'use strict';

module.exports = angular.module('user.service', [])
    .service('UserService', function ($q, $localstorage, ProductService, $rootScope, $ionicHistory, $state, $ionicLoading, $ionicPopup, $http, LoginService) {
        var current_user = {
            portrait: "img/icon.png"
        };

        return {
            currentUser: current_user,

            isLogin: function () {
                var user = $localstorage.getObject("user");
                if (user.login) {
                    for (var i in user) {
                        this.currentUser[i] = user[i];
                    }
                    return 1;
                }
                return 0;
            },

            updateUser: function (info) {
                var temp = this;
                var deferred = $q.defer();
                var promise = deferred.promise;

                for (var i in info) {
                    this.currentUser[i] = info[i];
                }

                LoginService.splitUsername(this.currentUser);

                var api_url = "http://shop10k.vn/web_api.php?r=user";

                $http.get(api_url + "&updateinfo=" + encodeURIComponent(JSON.stringify(this.currentUser)))
                    .then(function (resp) {
                        if (resp.data.changed) {
                            deferred.resolve(resp.data);
                            $localstorage.setObject("user", temp.currentUser);
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

            getUser: function () {
                return this.currentUser;
            },

            signOut: function () {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var api_url = "http://shop10k.vn/web_api.php?r=logout";
                $http.get(api_url)
                    .then(function (resp) {
                        if (resp.data.logout) {
                            deferred.resolve(resp.data);
                        }
                        else {
                            deferred.reject(resp.data.error);
                        }
                    }, function (err) {
                        deferred.reject('ERR ' + err);
                    })


                this.currentUser = {
                    login: false,
                    portrait: "img/icon.png",
                    logoutCheckout: "logouted"
                };


                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();

                $localstorage.setNull("user");
                $localstorage.setNull("cart");
                $localstorage.setNull("wishlist");

                ProductService.setPage(1);
                ProductService.filterProduct().then(function () {
                    console.log("success")
                }, function () {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Lỗi',
                        template: 'Bạn vui lòng thử chọn lại sản phẩm'
                    });
                });

                $rootScope.$broadcast("CartUpdate");
                $rootScope.$broadcast("WishlistUpdate");
                $rootScope.$broadcast("UserLogout");

                $state.go("menu.products");
            },

            login: function (user) {
                for (var i in user) {
                    this.currentUser[i] = user[i];
                }
                this.currentUser.login = true;

                $localstorage.setObject("user", this.currentUser);

                $localstorage.setNull("cart");
                $localstorage.setNull("wishlist");

                ProductService.setPage(1);
                ProductService.filterProduct().then(function () {
                    console.log("success")
                }, function () {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Lỗi',
                        template: 'Bạn vui lòng thử chọn lại sản phẩm'
                    });
                });

                $rootScope.$broadcast("CartUpdate");
                $rootScope.$broadcast("WishlistUpdate");
                $rootScope.$broadcast("UserLogin");
            }
        }
    });
},{}],22:[function(require,module,exports){
'use strict';

require('./wishlist_controller.js');
require('./wishlist_service.js');
require('.././products/products');
require('../.././app_service');

module.exports = angular.module("wishlist", ['app.service', 'products', 'wishlist.service', 'wishlist.controller']);
},{"../.././app_service":3,".././products/products":16,"./wishlist_controller.js":23,"./wishlist_service.js":24}],23:[function(require,module,exports){
'use strict';

module.exports = angular.module('wishlist.controller', [])
    .controller("WishlistController", ['$scope', '$localstorage','WishlistService','$state','CartService',
        function ($scope, $localstorage, WishlistService, $state, CartService) {
//            $localstorage.setNullAll();
            $scope.wishlistNumber = WishlistService.wishlistNumber;
            $scope.wishlist = $localstorage.getObject("wishlist");
            $scope.lengthWishlist = $scope.wishlist.length;

            $scope.removeFromWishlist = function(item){
                WishlistService.removeWishlist(item);
                $scope.wishlist = $localstorage.getObject("wishlist");
                $scope.lengthWishlist = $scope.wishlist.length;
            }

            $scope.add_to_cart = function (item) {
                CartService.addCart(item);
            }
        }]);
},{}],24:[function(require,module,exports){
'use strict';

module.exports = angular.module('wishlist.service', [])
    .service('WishlistService', function ($q, $localstorage, $rootScope, ProductService) {
        return {
            addWishlist : function(item){
                if(!item.like){
                    item.like = !item.like;
                    $localstorage.addObject("wishlist", item);
                    $localstorage.addAttribute("cart", item, "like");
                    ProductService.addAttribute(item, "like");

                    $rootScope.$broadcast("WishlistUpdate");
                }
                else{
                    this.removeWishlist(item);
                }
            },

            removeWishlist : function(item){
                item.like = !item.like;
                $localstorage.removeObject("wishlist", item);
                $localstorage.addAttribute("cart", item, "like");
                ProductService.addAttribute(item, "like");

                $rootScope.$broadcast("WishlistUpdate");
            }


        }
    });
},{}],25:[function(require,module,exports){
'use strict';

require('./contact_service.js');
require('./contact_controller.js');
require('../.././app_service');

module.exports = angular.module("contact", ['app.service', 'contact.services', 'contact.controller']);






},{"../.././app_service":3,"./contact_controller.js":26,"./contact_service.js":27}],26:[function(require,module,exports){
'use strict';

module.exports = angular.module('contact.controller', [])
    .controller("ContactController", ['$scope', 'parameters', '$localstorage',
        function ($scope, parameters, $localstorage) {
        }]);
},{}],27:[function(require,module,exports){
'use strict';

module.exports = angular.module('contact.services', [])
    .service('ContactService', function ($q) {


    });
},{}],28:[function(require,module,exports){
'use strict';

module.exports = angular.module('registerLogin.services', [])
    .service('LoginService', function ($q, $http, $localstorage, $ionicHistory) {
        return {
            loginUser: loginUser,
            registerUser: registerUser,
            getInfo: getInfo,
            splitUsername : splitUsername
        }
        function splitUsername(user){
            var name_obj = user.name.split(" ");
            user.firstname = name_obj[0];
            user.lastname = "";
            var last_name_arr = name_obj.slice(1);
            for (var i = 0; i < last_name_arr.length; i++) {
                user.lastname += last_name_arr[i] + " ";
            }
        }

        function getInfo(obj) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $localstorage.getKeyTime().then(
                function (md5key) {
                    $http.get("http://shop10k.vn/web_api.php?r=user&check=" + obj.email + "&password=" + obj.password + "&detail=true" + "&key=" + md5key)
                        .then(function (resp) {
                            if (!resp.data.error) {
                                deferred.resolve(resp.data);
                            }
                            else {
                                deferred.reject(resp.data.error);
                            }
                        }, function (err) {
                            deferred.reject('ERR ' + err);
                        })
                },
                function () {
                    deferred.reject("wrong key");
                }
            );

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

        function registerUser(obj) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            this.splitUsername(obj);

            $localstorage.getKeyTime().then(
                function (md5key) {
                    $http.get("http://shop10k.vn/web_api.php?r=user&register=true&firstname=" + obj.firstname + "&lastname=" + obj.lastname + "&password=" + obj.password + "&email=" + obj.email + "&key=" + md5key)
                        .then(function (resp) {
                            if (!resp.data.error) {
                                deferred.resolve();
                            }
                            else {
                                console.log(resp.data.error);
                                deferred.reject(resp.data.error);
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

        function loginUser(obj) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $localstorage.getKeyTime().then(
                function (md5key) {
                    $http.get("http://shop10k.vn/web_api.php?r=user&login=" + obj.email + "&password=" + obj.password + "&key=" + md5key)
                        .then(function (resp) {
                            $ionicHistory.clearHistory();
                            $ionicHistory.clearCache();
                            if (!resp.data.EXCEPTION_INVALID_EMAIL_OR_PASSWORD) {
                                deferred.resolve('Welcome ' + name + '!');
                            }
                            else {
                                deferred.reject(resp.data.error);
                            }
                        }, function (err) {
                            deferred.reject('ERR ' + err);
                        })
                },
                function () {
                    deferred.reject("wrong key");
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
    });
},{}],29:[function(require,module,exports){
'use strict';

require('./login_service.js');
require('./register_login_controller.js');
require('../.././layout/user/user');
require('../.././app_service');

module.exports = angular.module("registerLogin", ['app.service', 'user', 'registerLogin.services', 'registerLogin.controller']);






},{"../.././app_service":3,"../.././layout/user/user":19,"./login_service.js":28,"./register_login_controller.js":30}],30:[function(require,module,exports){
'use strict';

module.exports = angular.module('registerLogin.controller', [])
    .controller("RegisterLoginController", ['$scope', 'LoginService', '$state', '$ionicPopup', '$localstorage', 'UserService',
        function ($scope, LoginService, $state, $ionicPopup, $localstorage, UserService) {
            $scope.user = UserService.current_user;

            $scope.$on('modal.hidden', function () {
                $state.go('menu.products');
            });

            $scope.loginData = {};
            $scope.registerData = {};

            $scope.openLoginModal = function () {
                $scope.openModal();
            }

            $scope.closeLoginModal = function () {
                $scope.closeModal();
                $state.go('menu.products');
            }

            //login section
            $scope.doRegister = function () {
                LoginService.registerUser($scope.registerData)
                    .success(function (data) {
                        $scope.registerData = {};
                        var alertPopup = $ionicPopup.alert({
                            title: 'Đăng ký thành công',
                            template: 'Vui lòng đăng nhập để tiếp tục'
                        });
                    })
                    .error(function (data) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Đăng ký không thành công',
                            template: data
                        });
                    });

            };

            //register section
            $scope.doLogin = function () {
                LoginService.loginUser($scope.loginData)
                    .success(function (data) {
                        LoginService.getInfo($scope.loginData)
                            .success(function (data) {
                                data.name = data.user.fullname;
                                data.email = data.user.email;
                                data.phone = data.phone;
                                data.address = data.address;
                                data.district = data.district;
                                data.city = data.city;
                                data.password = $scope.loginData.password;
                                UserService.login(data);
                                $scope.closeModal();
                                $state.go('menu.products');
                            })
                            .error(function (data) {
                                $scope.closeModal();
                                $state.go('menu.user');
                            });

                    })
                    .error(function (data) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Login failed!',
                            template: 'Please check your credentials!'
                        });
                    });
            };

        }]);
},{}],31:[function(require,module,exports){
'use strict';


module.exports = ['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "js/layout/home/home.html",
                controller: 'HomeController'
            })
        ;

        $stateProvider
            .state('login', {
                url: "/login",
                abstract: true,
                templateUrl: "js/modules/registerLogin/registerLogin.html",
                controller: 'RegisterLoginController'
            })
        ;

        $stateProvider
            .state('menu', {
                url: "/menu",
                abstract: true,
                templateUrl: "js/layout/menu/menu.html",
                controller: 'MenuController'
            })
        ;

        $stateProvider
            .state('menu.products', {
                url: "/products",
                templateUrl: "js/layout/products/products.html",
                controller: 'ProductsController'
            })
        ;
        $stateProvider
            .state('menu.product', {
                url: "/product/:id",
                templateUrl: "js/layout/products/product.html",
                controller: 'ProductController'
            })
        ;
        $stateProvider
            .state('menu.cart', {
                url: "/cart",
                templateUrl: "js/layout/cart/cart.html",
                controller: 'CartController'
            })
        ;
        $stateProvider
            .state('menu.wishlist', {
                url: "/wishlist",
                templateUrl: "js/layout/wishlist/wishlist.html",
                controller: 'WishlistController'
            })
        ;
        $stateProvider
            .state('menu.checkout', {
                url: "/checkout",
                templateUrl: "js/layout/checkout/checkout.html",
                controller: 'CheckoutController'
            })
        ;
        $stateProvider
            .state('menu.checkout_edit', {
                url: "/checkout_edit",
                templateUrl: "js/layout/checkout/checkout_edit.html",
                controller: 'CheckoutEditController'
            })
        ;
        $stateProvider
            .state('menu.user', {
                url: "/user",
                templateUrl: "js/layout/user/user.html",
                controller: 'UserController'
            })
        ;
    }
]
;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIi4vd3d3L2pzL2FwcC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvYXBwLW1haW4uanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2FwcF9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2FydC9jYXJ0LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2FydC9jYXJ0X2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9jYXJ0L2NhcnRfc2VydmljZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXRfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0X2VkaXRfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0X3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9ob21lL2hvbWUuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9ob21lL2hvbWVfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L21lbnUvbWVudS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L21lbnUvbWVudV9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdF9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHMuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0c19jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHNfZmFjdG9yeS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3VzZXIvdXNlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3VzZXIvdXNlcl9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvdXNlci91c2VyX3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC93aXNobGlzdC93aXNobGlzdC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3dpc2hsaXN0L3dpc2hsaXN0X2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC93aXNobGlzdC93aXNobGlzdF9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL2NvbnRhY3QvY29udGFjdC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9jb250YWN0L2NvbnRhY3RfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9jb250YWN0L2NvbnRhY3Rfc2VydmljZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9yZWdpc3RlckxvZ2luL2xvZ2luX3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJfbG9naW5fY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvcm91dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vbW9kdWxlIG5vZGVcclxuLy9yZXF1aXJlKFwiYW5ndWxhclwiKTtcclxuXHJcbi8vbW9kdWxlIGZ1bmN0aW9uc1xyXG5yZXF1aXJlKFwiLi9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJMb2dpblwiKTtcclxucmVxdWlyZShcIi4vbW9kdWxlcy9jb250YWN0L2NvbnRhY3RcIik7XHJcbi8vbW9kdWxlIGxheW91dFxyXG5yZXF1aXJlKFwiLi9sYXlvdXQvaG9tZS9ob21lXCIpO1xyXG5yZXF1aXJlKFwiLi9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHNcIik7XHJcbnJlcXVpcmUoXCIuL2xheW91dC9tZW51L21lbnVcIik7XHJcbnJlcXVpcmUoXCIuL2xheW91dC9jYXJ0L2NhcnRcIik7XHJcbnJlcXVpcmUoXCIuL2xheW91dC9jaGVja291dC9jaGVja291dFwiKTtcclxucmVxdWlyZShcIi4vbGF5b3V0L3dpc2hsaXN0L3dpc2hsaXN0XCIpO1xyXG5yZXF1aXJlKFwiLi9sYXlvdXQvdXNlci91c2VyXCIpO1xyXG5yZXF1aXJlKFwiLi9hcHBfc2VydmljZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnQgPSBhbmd1bGFyLm1vZHVsZSgnc3RhcnRlcicsIFsnaW9uaWMnLCAnYWtvZW5pZy5kZWNrZ3JpZCcsXHJcbiAgICAgICAgLy9mdW5jdGlvbnNcclxuICAgICAgICAncmVnaXN0ZXJMb2dpbicsXHJcbiAgICAgICAgJ2NvbnRhY3QnLFxyXG5cclxuICAgICAgICAvL2xheW91dFxyXG4gICAgICAgICdob21lJyxcclxuICAgICAgICAnbWVudScsXHJcbiAgICAgICAgJ3Byb2R1Y3RzJyxcclxuICAgICAgICAnY2FydCcsXHJcbiAgICAgICAgJ2NoZWNrb3V0JyxcclxuICAgICAgICAnd2lzaGxpc3QnLFxyXG4gICAgICAgICd1c2VyJyxcclxuXHJcbiAgICAgICAgJ2FwcC5zZXJ2aWNlJyxcclxuXHJcbiAgICBdKVxyXG4gICAgLmNvbmZpZyhyZXF1aXJlKCcuL3JvdXRlcicpKVxyXG5cclxuICAgIC5ydW4ocmVxdWlyZSgnLi9hcHAtbWFpbicpKTtcclxuXHJcblxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5mdW5jdGlvbiBBcHBNYWluKCRpb25pY1BsYXRmb3JtLCAkc3RhdGUpe1xyXG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxyXG4gICAgICAgIC8vIGZvciBmb3JtIGlucHV0cylcclxuICAgICAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZCkge1xyXG4gICAgICAgICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKGZhbHNlKTtcclxuICAgICAgICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmRpc2FibGVTY3JvbGwodHJ1ZSk7Ly9tYXliZSBpdCBmaXggc2Nyb2xsIHVwIHdoZW4gZm9jdXMgaW5wdXQgb24gSU9TXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XHJcbiAgICAgICAgICAgIC8vIG9yZy5hcGFjaGUuY29yZG92YS5zdGF0dXNiYXIgcmVxdWlyZWRcclxuICAgICAgICAgICAgU3RhdHVzQmFyLnN0eWxlRGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICRpb25pY1BsYXRmb3JtLm9uKCdyZXN1bWUnLCBmdW5jdGlvbigpe1xyXG4vLyAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XHJcbiAgICB9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbJyRpb25pY1BsYXRmb3JtJywgJyRzdGF0ZScsIEFwcE1haW5dOyIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VcIiwgW10pXHJcbiAgICAuZmFjdG9yeSgnJGxvY2Fsc3RvcmFnZScsIGZ1bmN0aW9uICgkcSwgJGh0dHAsICR3aW5kb3csICRpb25pY0hpc3RvcnkpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChrZXksIGRlZmF1bHRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gfHwgZGVmYXVsdFZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0T2JqZWN0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0T2JqZWN0OiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8ICd7fScpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0TnVsbDogZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRPYmplY3Qoa2V5LCB7fSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldE51bGxBbGw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFyQ2FjaGUoKTtcclxuICAgICAgICAgICAgICAgICRpb25pY0hpc3RvcnkuY2xlYXJIaXN0b3J5KCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRPYmplY3Q6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBuZXcgQXJyYXkodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IHRoaXMuZ2V0T2JqZWN0KGtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2hhcmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycltpXS5lbnRpdHlfaWQgPT0gdmFsdWVbMF0uZW50aXR5X2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzaGFyZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5jb25jYXQoYXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gYXJyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0T2JqZWN0KGtleSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogb2JqQXJyTmVlZFVwZGF0ZSA6IGlzIGFuIGFycmF5IG5lZWQgdXBkYXRlIGFmdGVyIG1haW4gYXJyYXkgaXNcclxuICAgICAgICAgICAgICogKi9cclxuICAgICAgICAgICAgcmVtb3ZlT2JqZWN0OiBmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gdGhpcy5nZXRPYmplY3Qoa2V5KTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFycltpXS5lbnRpdHlfaWQgPT0gaXRlbS5lbnRpdHlfaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRPYmplY3Qoa2V5LCBhcnIpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgbWVyZ2VBcnJheTogZnVuY3Rpb24gKGFycjEsIGFycjIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhcnIzID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGFycjEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2hhcmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBhcnIyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyMltqXS5lbnRpdHlfaWQgPT0gYXJyMVtpXS5lbnRpdHlfaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2hhcmVkKSBhcnIzLnB1c2goYXJyMVtpXSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGFycjMgPSBhcnIzLmNvbmNhdChhcnIyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhcnIzO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvL2lucHV0IDIgYXJyYXlcclxuICAgICAgICAgICAgLy9yZXR1cm4gYXJyYXkgY29udGFpbiBhbGwgZWxlbWVudHMgd2hpY2ggYXJlIGluIGJvdGggYXJyYXkgYW5kIHVwZGF0ZSBmb2xsb3cgYXJyMlxyXG4gICAgICAgICAgICB1cGRhdGVBcnJheTogZnVuY3Rpb24gKGFycjEsIGFycjIsIGtleSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhcnIxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBhcnIyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnIyW2pdLmVudGl0eV9pZCA9PSBhcnIxW2ldLmVudGl0eV9pZCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycjFbaV1ba2V5XSA9IGFycjJbal1ba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZEF0dHJpYnV0ZTogZnVuY3Rpb24gKGtleSwgaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhcnIgPSB0aGlzLmdldE9iamVjdChrZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycltpXS5lbnRpdHlfaWQgPT0gaXRlbS5lbnRpdHlfaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycltpXVtpbmRleF0gPSBpdGVtW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE9iamVjdChrZXksIGFycik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRBdHRyaWJ1dGVBbGw6IGZ1bmN0aW9uIChrZXksIGF0dHIsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gdGhpcy5nZXRPYmplY3Qoa2V5KTtcclxuICAgICAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycltpXVthdHRyXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE9iamVjdChrZXksIGFycik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRLZXlUaW1lOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbGlua19hamF4ID0gXCJodHRwOi8vc2hvcDEway52bi93ZWJfYXBpLnBocD9yPXRpbWVzcGFtXCI7XHJcbiAgICAgICAgICAgICAgICAkaHR0cC5nZXQobGlua19hamF4KS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwLmRhdGEuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IHJlc3AuZGF0YS50aW1lc3BhbSArICdhcHAnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWQ1a2V5ID0gbWQ1KGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUobWQ1a2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KFt7XCJwcm9kdWN0aWRcIjpcIjE4NzNcIixcInF1YW50aXR5XCI6XCIyXCJ9LHtcInByb2R1Y3RpZFwiOlwiMTg3MVwiLFwicXVhbnRpdHlcIjpcIjJcIn1dKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHJlc3AuZGF0YS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVyci5zdGF0dXMgd2lsbCBjb250YWluIHRoZSBzdGF0dXMgY29kZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0VSUicsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdFUlIgJyArIGVycik7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnNlcnZpY2UoJ0NvbnRyb2xNb2RhbFNlcnZpY2UnLCBmdW5jdGlvbiAoJHEsICRpb25pY01vZGFsLCAkcm9vdFNjb3BlLCAkdGltZW91dCwgJGNvbnRyb2xsZXIpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzaG93OiBzaG93XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNob3codGVtcGxldGVVcmwsIGNvbnRyb2xsZXIsIGF1dG9zaG93LCBwYXJhbWV0ZXJzLCBvcHRpb25zLCB3cmFwQ2Fsc3MpIHtcclxuICAgICAgICAgICAgLy8gR3JhYiB0aGUgaW5qZWN0b3IgYW5kIGNyZWF0ZSBhIG5ldyBzY29wZVxyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpLFxyXG4gICAgICAgICAgICAgICAgY3RybEluc3RhbmNlLFxyXG4gICAgICAgICAgICAgICAgbW9kYWxTY29wZSA9ICRyb290U2NvcGUuJG5ldygpLFxyXG4gICAgICAgICAgICAgICAgdGhpc1Njb3BlSWQgPSBtb2RhbFNjb3BlLiRpZCxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogJ3NsaWRlLWluLXVwJyxcclxuICAgICAgICAgICAgICAgICAgICBmb2N1c0ZpcnN0SW5wdXQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tkcm9wQ2xpY2tUb0Nsb3NlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGhhcmR3YXJlQmFja0J1dHRvbkNsb3NlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsQ2FsbGJhY2s6IG51bGxcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCh0ZW1wbGV0ZVVybCwge1xyXG4gICAgICAgICAgICAgICAgc2NvcGU6IG1vZGFsU2NvcGUsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IG9wdGlvbnMuYW5pbWF0aW9uLFxyXG4gICAgICAgICAgICAgICAgZm9jdXNGaXJzdElucHV0OiBvcHRpb25zLmZvY3VzRmlyc3RJbnB1dCxcclxuICAgICAgICAgICAgICAgIGJhY2tkcm9wQ2xpY2tUb0Nsb3NlOiBvcHRpb25zLmJhY2tkcm9wQ2xpY2tUb0Nsb3NlLFxyXG4gICAgICAgICAgICAgICAgaGFyZHdhcmVCYWNrQnV0dG9uQ2xvc2U6IG9wdGlvbnMuaGFyZHdhcmVCYWNrQnV0dG9uQ2xvc2VcclxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLm1vZGFsID0gbW9kYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUub3Blbk1vZGFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLm1vZGFsLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS5tb2RhbC5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS4kb24oJ21vZGFsLmhpZGRlbicsIGZ1bmN0aW9uICh0aGlzTW9kYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNNb2RhbC5jdXJyZW50U2NvcGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtb2RhbFNjb3BlSWQgPSB0aGlzTW9kYWwuY3VycmVudFNjb3BlLiRpZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzU2NvcGVJZCA9PT0gbW9kYWxTY29wZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfY2xlYW51cCh0aGlzTW9kYWwuY3VycmVudFNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJbnZva2UgdGhlIGNvbnRyb2xsZXJcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYWxzID0geyAnJHNjb3BlJzogbW9kYWxTY29wZSwgJ3BhcmFtZXRlcnMnOiBwYXJhbWV0ZXJzIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN0cmxFdmFsID0gX2V2YWxDb250cm9sbGVyKGNvbnRyb2xsZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0cmxJbnN0YW5jZSA9ICRjb250cm9sbGVyKGNvbnRyb2xsZXIsIGxvY2Fscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN0cmxFdmFsLmlzQ29udHJvbGxlckFzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0cmxJbnN0YW5jZS5vcGVuTW9kYWwgPSBtb2RhbFNjb3BlLm9wZW5Nb2RhbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RybEluc3RhbmNlLmNsb3NlTW9kYWwgPSBtb2RhbFNjb3BlLmNsb3NlTW9kYWw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXV0b3Nob3cpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS5tb2RhbC5zaG93KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLiRicm9hZGNhc3QoJ21vZGFsLmFmdGVyU2hvdycsIG1vZGFsU2NvcGUubW9kYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKG9wdGlvbnMubW9kYWxDYWxsYmFjaykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5tb2RhbENhbGxiYWNrKG1vZGFsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIF9jbGVhbnVwKHNjb3BlKSB7XHJcbiAgICAgICAgICAgIHNjb3BlLiRkZXN0cm95KCk7XHJcbiAgICAgICAgICAgIGlmIChzY29wZS5tb2RhbCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUubW9kYWwucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIF9ldmFsQ29udHJvbGxlcihjdHJsTmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgICAgICAgICAgICAgaXNDb250cm9sbGVyQXM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck5hbWU6ICcnLFxyXG4gICAgICAgICAgICAgICAgcHJvcE5hbWU6ICcnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHZhciBmcmFnbWVudHMgPSAoY3RybE5hbWUgfHwgJycpLnRyaW0oKS5zcGxpdCgvXFxzKy8pO1xyXG4gICAgICAgICAgICByZXN1bHQuaXNDb250cm9sbGVyQXMgPSBmcmFnbWVudHMubGVuZ3RoID09PSAzICYmIChmcmFnbWVudHNbMV0gfHwgJycpLnRvTG93ZXJDYXNlKCkgPT09ICdhcyc7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuaXNDb250cm9sbGVyQXMpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5jb250cm9sbGVyTmFtZSA9IGZyYWdtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wcm9wTmFtZSA9IGZyYWdtZW50c1syXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5jb250cm9sbGVyTmFtZSA9IGN0cmxOYW1lO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vY2FydF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4vY2FydF9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4vcHJvZHVjdHMvcHJvZHVjdHMnKTtcclxucmVxdWlyZSgnLi4vLi9jaGVja291dC9jaGVja291dCcpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiY2FydFwiLCBbJ2FwcC5zZXJ2aWNlJywgJ2NoZWNrb3V0JywgJ3Byb2R1Y3RzJywgJ2NhcnQuc2VydmljZXMnLCAnY2FydC5jb250cm9sbGVyJ10pO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NhcnQuY29udHJvbGxlcicsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJDYXJ0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckbG9jYWxzdG9yYWdlJywgJ1dpc2hsaXN0U2VydmljZScsICdDYXJ0U2VydmljZScsICdDaGVja291dFNlcnZpY2UnLCAnJHN0YXRlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYWxzdG9yYWdlLCBXaXNobGlzdFNlcnZpY2UsIENhcnRTZXJ2aWNlLCBDaGVja291dFNlcnZpY2UsICRzdGF0ZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUuY2FydGxpc3QgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIik7XHJcbiAgICAgICAgICAgICRzY29wZS5sZW5ndGhDYXJ0ID0gJHNjb3BlLmNhcnRsaXN0Lmxlbmd0aDtcclxuICAgICAgICAgICAgQ2FydFNlcnZpY2Uuc2V0Q2FydE51bWJlcigpO1xyXG4gICAgICAgICAgICAkc2NvcGUuY2FydE51bWJlciA9IENhcnRTZXJ2aWNlLmdldENhcnROdW1iZXIoKTtcclxuICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gQ2FydFNlcnZpY2UuY29udmVydE1vbmV5KDAsIFwiLFwiLCBcIi5cIiwgQ2FydFNlcnZpY2Uuc3VtQ2FydCgpKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hZGRUb1dpc2hsaXN0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIFdpc2hsaXN0U2VydmljZS5hZGRXaXNobGlzdChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnJlbW92ZUZyb21DYXJ0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIENhcnRTZXJ2aWNlLnJlbW92ZUNhcnQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2FydGxpc3QgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIik7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUubGVuZ3RoQ2FydCA9ICRzY29wZS5jYXJ0bGlzdC5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2FydE51bWJlciA9IENhcnRTZXJ2aWNlLmdldENhcnROdW1iZXIoKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS50b3RhbCA9IENhcnRTZXJ2aWNlLmNvbnZlcnRNb25leSgwLCBcIixcIiwgXCIuXCIsIENhcnRTZXJ2aWNlLnN1bUNhcnQoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jYXJ0X2NoZWNrb3V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgQ2hlY2tvdXRTZXJ2aWNlLnN1bVRvdGFsKCk7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUuY2hlY2tvdXQnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignQ2FydFVwZGF0ZScsIGZ1bmN0aW9uIChldmVudCwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gQ2FydFNlcnZpY2Uuc3VtQ2FydCgpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNhcnROdW1iZXIgPSBDYXJ0U2VydmljZS5nZXRDYXJ0TnVtYmVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZVF0eSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZEF0dHJpYnV0ZShcImNhcnRcIiwgaXRlbSwgXCJxdWFudGl0eVwiKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS50b3RhbCA9IENhcnRTZXJ2aWNlLmNvbnZlcnRNb25leSgwLCBcIixcIiwgXCIuXCIsIENhcnRTZXJ2aWNlLnN1bUNhcnQoKSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NhcnQuc2VydmljZXMnLCBbXSlcclxuICAgIC5zZXJ2aWNlKCdDYXJ0U2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGxvY2Fsc3RvcmFnZSwgJHJvb3RTY29wZSwgUHJvZHVjdFNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgY2FydE51bWJlciA9IDA7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYWRkQ2FydDogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmICghaXRlbS5hZGRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcnROdW1iZXIrKztcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmFkZGVkID0gIWl0ZW0uYWRkZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5xdWFudGl0eSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5hZGRPYmplY3QoXCJjYXJ0XCIsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuYWRkQXR0cmlidXRlKFwid2lzaGxpc3RcIiwgaXRlbSwgXCJhZGRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5hZGRBdHRyaWJ1dGUoaXRlbSwgXCJhZGRlZFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiQ2FydFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2FydChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHJlbW92ZUNhcnQ6IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjYXJ0TnVtYmVyLS07XHJcbiAgICAgICAgICAgICAgICBpdGVtLmFkZGVkID0gIWl0ZW0uYWRkZWQ7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnJlbW92ZU9iamVjdChcImNhcnRcIiwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZEF0dHJpYnV0ZShcIndpc2hsaXN0XCIsIGl0ZW0sIFwiYWRkZWRcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuYWRkQXR0cmlidXRlKGl0ZW0sIFwiYWRkZWRcIiwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIkNhcnRVcGRhdGVcIik7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzdW1DYXJ0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FydCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKTtcclxuICAgICAgICAgICAgICAgIHZhciB0b3RhbCA9IDA7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGNhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b3RhbCArPSBwYXJzZUludChjYXJ0W2ldLnByaWNlX251bWJlciAqIGNhcnRbaV0ucXVhbnRpdHkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRvdGFsO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgY29udmVydE1vbmV5IDogZnVuY3Rpb24oYywgZCwgdCwgbnVtYmVyKXtcclxuICAgICAgICAgICAgICAgIHZhciBuID0gbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIGMgPSBpc05hTihjID0gTWF0aC5hYnMoYykpID8gMiA6IGMsXHJcbiAgICAgICAgICAgICAgICAgICAgZCA9IGQgPT0gdW5kZWZpbmVkID8gXCIuXCIgOiBkLFxyXG4gICAgICAgICAgICAgICAgICAgIHQgPSB0ID09IHVuZGVmaW5lZCA/IFwiLFwiIDogdCxcclxuICAgICAgICAgICAgICAgICAgICBzID0gbiA8IDAgPyBcIi1cIiA6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaSA9IHBhcnNlSW50KG4gPSBNYXRoLmFicygrbiB8fCAwKS50b0ZpeGVkKGMpKSArIFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaiA9IChqID0gaS5sZW5ndGgpID4gMyA/IGogJSAzIDogMDtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzICsgKGogPyBpLnN1YnN0cigwLCBqKSArIHQgOiBcIlwiKSArIGkuc3Vic3RyKGopLnJlcGxhY2UoLyhcXGR7M30pKD89XFxkKS9nLCBcIiQxXCIgKyB0KSArIChjID8gZCArIE1hdGguYWJzKG4gLSBpKS50b0ZpeGVkKGMpLnNsaWNlKDIpIDogXCJcIikgKyBcIiDEkSBcIjtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldENhcnROdW1iZXIgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgY2FydE51bWJlciA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKS5sZW5ndGggPiAwID8gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpLmxlbmd0aCA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRDYXJ0TnVtYmVyIDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIikubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9jaGVja291dF9jb250cm9sbGVyJyk7XHJcbnJlcXVpcmUoJy4vY2hlY2tvdXRfZWRpdF9jb250cm9sbGVyJyk7XHJcbnJlcXVpcmUoJy4vY2hlY2tvdXRfc2VydmljZScpO1xyXG5yZXF1aXJlKCcuLi8uL3VzZXIvdXNlcicpO1xyXG5yZXF1aXJlKFwiLi4vLi9wcm9kdWN0cy9wcm9kdWN0c1wiKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcImNoZWNrb3V0XCIsIFsnYXBwLnNlcnZpY2UnLCAndXNlcicsICdwcm9kdWN0cycsICdjaGVja291dC5zZXJ2aWNlJywgJ2NoZWNrb3V0LmNvbnRyb2xsZXInLCAnY2hlY2tvdXRFZGl0LmNvbnRyb2xsZXInXSkiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjaGVja291dC5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIkNoZWNrb3V0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckbG9jYWxzdG9yYWdlJywgJ0NvbnRyb2xNb2RhbFNlcnZpY2UnLCAnJHN0YXRlJywgJyRyb290U2NvcGUnLCAnQ2hlY2tvdXRTZXJ2aWNlJywgJ1VzZXJTZXJ2aWNlJywgJ1Byb2R1Y3RTZXJ2aWNlJywgJyRpb25pY1BvcHVwJywgJyRpb25pY0hpc3RvcnknLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhbHN0b3JhZ2UsIENvbnRyb2xNb2RhbFNlcnZpY2UsICRzdGF0ZSwgJHJvb3RTY29wZSwgQ2hlY2tvdXRTZXJ2aWNlLCBVc2VyU2VydmljZSwgUHJvZHVjdFNlcnZpY2UsICRpb25pY1BvcHVwLCAkaW9uaWNIaXN0b3J5KSB7XHJcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gVXNlclNlcnZpY2UuY3VycmVudFVzZXI7XHJcbiAgICAgICAgICAgICRzY29wZS5jaGVja291dEluZm8gPSBDaGVja291dFNlcnZpY2UuY2hlY2tvdXRJbmZvO1xyXG5cclxuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKCRzY29wZS5jaGVja291dEluZm9bXCJtZXRob2RTaGlwXCJdKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIENoZWNrb3V0U2VydmljZS5zaGlwcGluZ0luZm8oKS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNoaXBwaW5nSW5mbyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0SW5mb1tcIm1ldGhvZFNoaXBcIl0gPSBzaGlwcGluZ0luZm9bMF0ubWV0aG9kWzBdO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cygkc2NvcGUuY2hlY2tvdXRJbmZvW1wibWV0aG9kUGF5bWVudFwiXSkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBDaGVja291dFNlcnZpY2UucGF5bWVudEluZm8oKS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0SW5mb1tcIm1ldGhvZFBheW1lbnRcIl0gPSBkYXRhWzFdO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIENoZWNrb3V0U2VydmljZS51cGRhdGVDaGVja291dEluZm9Vc2VyKCRzY29wZS51c2VyKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jaGVja291dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICghJHNjb3BlLmNoZWNrb3V0SW5mby51c2VyLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdC4buVIHN1bmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ1Z1aSBsw7JuZyBuaOG6rXAgdMOqbidcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCEkc2NvcGUuY2hlY2tvdXRJbmZvLnVzZXIuYWRkcmVzcyAmJiAoJHNjb3BlLmNoZWNrb3V0SW5mby5tZXRob2RTaGlwLnR5cGUgIT0gJ2ZyZWVzaGlwcGluZycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQuG7lSBzdW5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdWdWkgbMOybmcgbmjhuq1wIMSR4buLYSBjaOG7iSBnaWFvIGjDoG5nJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ2hlY2tvdXRTZXJ2aWNlLnNldE9yZGVyKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnxJDhurd0IG11YSB0aMOgbmggY8O0bmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnWGluIGPhuqNtIMahbiBxdcO9IGtow6FjaCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE51bGwoXCJjYXJ0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZEF0dHJpYnV0ZUFsbChcIndpc2hsaXN0XCIsIFwiYWRkZWRcIiwgZmFsc2UpOy8vcmVtb3ZlIGFkZCB0byBjYXJkIGF0dHIgaW4gd2lzaGxpc3RcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIkNhcnRVcGRhdGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIkNsb3NlT3JkZXJcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFySGlzdG9yeSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFyQ2FjaGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENoZWNrb3V0U2VydmljZS5yZXNldENoZWNrb3V0SW5mbygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGVja291dFNlcnZpY2Uuc2hpcHBpbmdJbmZvKCkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNoaXBwaW5nSW5mbyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2hlY2tvdXRJbmZvW1wibWV0aG9kU2hpcFwiXSA9IHNoaXBwaW5nSW5mb1swXS5tZXRob2RbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hlY2tvdXRTZXJ2aWNlLnBheW1lbnRJbmZvKCkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0SW5mb1tcIm1ldGhvZFBheW1lbnRcIl0gPSBkYXRhWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLnNldFBhZ2UoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmZpbHRlclByb2R1Y3QoKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2Vzc1wiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0zhu5dpJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ0LhuqFuIHZ1aSBsw7JuZyB0aOG7rSBjaOG7jW4gbOG6oWkgc+G6o24gcGjhuqltJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwibWVudS5wcm9kdWN0c1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnY2hlY2tvdXRFZGl0LmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiQ2hlY2tvdXRFZGl0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckbG9jYWxzdG9yYWdlJywgJ1VzZXJTZXJ2aWNlJywgJ0NoZWNrb3V0U2VydmljZScsICckc3RhdGUnLCAnQ2FydFNlcnZpY2UnLCckaW9uaWNIaXN0b3J5JyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYWxzdG9yYWdlLCBVc2VyU2VydmljZSwgQ2hlY2tvdXRTZXJ2aWNlLCAkc3RhdGUsIENhcnRTZXJ2aWNlLCAkaW9uaWNIaXN0b3J5KSB7XHJcbiAgICAgICAgICAgICRzY29wZS5yZWdleDJXb3JkID0gJy9eKFxcZCkrJC8nO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0SW5mbyA9IENoZWNrb3V0U2VydmljZS5jaGVja291dEluZm87XHJcblxyXG4gICAgICAgICAgICBDaGVja291dFNlcnZpY2Uuc2hpcHBpbmdJbmZvKCkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnNoaXBwaW5nSW5mbyA9IGRhdGE7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBDaGVja291dFNlcnZpY2UucGF5bWVudEluZm8oKS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUucGF5bWVudEluZm8gPSBkYXRhO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmJlbG93NTAgPSBmYWxzZTtcclxuICAgICAgICAgICAgJHNjb3BlLmJlbG93MTAwID0gZmFsc2U7XHJcbiAgICAgICAgICAgICRzY29wZS50b3RhbF90ZW1wID0gQ2FydFNlcnZpY2Uuc3VtQ2FydCgpO1xyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLnRvdGFsX3RlbXAgPCA1MDAwMCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmJlbG93NTAgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCRzY29wZS50b3RhbF90ZW1wIDwgMTAwMDAwKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYmVsb3cxMDAgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlQ2hlY2tvdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBDaGVja291dFNlcnZpY2UudXBkYXRlQ2hlY2tvdXRJbmZvKCRzY29wZS5jaGVja291dEluZm8pO1xyXG4gICAgICAgICAgICAgICAgQ2hlY2tvdXRTZXJ2aWNlLmFkZFNoaXBwaW5nKCRzY29wZS5jaGVja291dEluZm8ubWV0aG9kU2hpcCk7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUuY2hlY2tvdXQnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNvbXBhcmVPYmogPSBmdW5jdGlvbiAob2JqMSwgb2JqMikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmoxID09PSBcInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBvYmoyID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG9iajEudHlwZSA9PT0gb2JqMi50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnY2hlY2tvdXQuc2VydmljZScsIFtdKVxyXG4gICAgLmZhY3RvcnkoJ0NoZWNrb3V0U2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGxvY2Fsc3RvcmFnZSwgQ2FydFNlcnZpY2UsICRodHRwLCBVc2VyU2VydmljZSwgTG9naW5TZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIGNoZWNrb3V0X2luZm8gPSB7XHJcbiAgICAgICAgICAgIHRvdGFsOiAwLFxyXG4gICAgICAgICAgICBncmFuZFRvdGFsOiAwLFxyXG4gICAgICAgICAgICBtZXRob2RTaGlwVGV4dDogMCxcclxuICAgICAgICAgICAgbWV0aG9kU2hpcDoge30sXHJcbiAgICAgICAgICAgIG1ldGhvZFBheW1lbnQ6IHt9LFxyXG4gICAgICAgICAgICB1c2VyOiB7fVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRyYW5zZm9ybUFycihvcmlnKSB7XHJcbiAgICAgICAgICAgIHZhciBvcmlnX25ldyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gb3JpZykge1xyXG4gICAgICAgICAgICAgICAgb3JpZ19uZXcucHVzaChvcmlnW2tleV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBuZXdBcnIgPSBbXSxcclxuICAgICAgICAgICAgICAgIG5hbWVzID0ge30sXHJcbiAgICAgICAgICAgICAgICBpLCBqLCBjdXI7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGogPSBvcmlnX25ldy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGN1ciA9IG9yaWdfbmV3W2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKCEoY3VyLnRpdGxlIGluIG5hbWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWVzW2N1ci50aXRsZV0gPSB7dGl0bGU6IGN1ci50aXRsZSwgbWV0aG9kOiBbXX07XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3QXJyLnB1c2gobmFtZXNbY3VyLnRpdGxlXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChpIDwgNSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vYWRkIGNoaWxkIGF0dHJpYnV0ZSB0byBtZXRob2Qgd2hpY2ggaXMgY2hpbGQuXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZXNbY3VyLnRpdGxlXS5tZXRob2RbMF0uY2hpbGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1ci5jaGlsZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY3VyLnByaWNlID0gcGFyc2VJbnQoY3VyLnByaWNlKTtcclxuICAgICAgICAgICAgICAgIG5hbWVzW2N1ci50aXRsZV0ubWV0aG9kLnB1c2goY3VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3QXJyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0X3NoaXBwaW5nX21ldGhvZCgpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmdldEtleVRpbWUoKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKG1kNWtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRodHRwLmdldChcImh0dHA6Ly9zaG9wMTBrLnZuL3dlYl9hcGkucGhwP3I9c2hpcHBpbmdcIiArIFwiJmtleT1cIiArIG1kNWtleSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdEYXRhID0gdHJhbnNmb3JtQXJyKHJlc3AuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKG5ld0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdFUlIgJyArIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIClcclxuXHJcbiAgICAgICAgICAgIHByb21pc2Uuc3VjY2VzcyA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb21pc2UuZXJyb3IgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihudWxsLCBmbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRfcGF5bWVudF9tZXRob2QoKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5nZXRLZXlUaW1lKCkudGhlbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChtZDVrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAkaHR0cC5nZXQoXCJodHRwOi8vc2hvcDEway52bi93ZWJfYXBpLnBocD9yPXBheW1lbnRcIiArIFwiJmtleT1cIiArIG1kNWtleSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdEYXRhID0gcmVzcC5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFyciA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKG5ld0RhdGEsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleSAhPT0gXCJwYXlwYWxfYmlsbGluZ19hZ3JlZW1lbnRcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goe1widHlwZVwiOiBrZXksIFwibmFtZVwiOiB2YWx1ZX0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGFycik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0VSUiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKVxyXG5cclxuICAgICAgICAgICAgcHJvbWlzZS5zdWNjZXNzID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oZm4pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvbWlzZS5lcnJvciA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKG51bGwsIGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHVwZGF0ZUNoZWNrb3V0SW5mbzogZnVuY3Rpb24gKGluZm8pIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gaW5mbykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tvdXRJbmZvW2ldID0gaW5mb1tpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHVwZGF0ZUNoZWNrb3V0SW5mb1VzZXI6IGZ1bmN0aW9uKGluZm8pe1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBpbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja291dEluZm9bXCJ1c2VyXCJdW2ldID0gaW5mb1tpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY2hlY2tvdXRJbmZvKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHN1bVRvdGFsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrb3V0SW5mby50b3RhbCA9IENhcnRTZXJ2aWNlLnN1bUNhcnQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrb3V0SW5mby50b3RhbFRleHQgPSBDYXJ0U2VydmljZS5jb252ZXJ0TW9uZXkoMCwgXCIsXCIsIFwiLlwiLCB0aGlzLmNoZWNrb3V0SW5mby50b3RhbCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja291dEluZm8ubWV0aG9kU2hpcC5wcmljZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tvdXRJbmZvLmdyYW5kVG90YWwgPSBDYXJ0U2VydmljZS5jb252ZXJ0TW9uZXkoMCwgXCIsXCIsIFwiLlwiLCAodGhpcy5jaGVja291dEluZm8udG90YWwgKyB0aGlzLmNoZWNrb3V0SW5mby5tZXRob2RTaGlwLnByaWNlKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrb3V0SW5mby5ncmFuZFRvdGFsID0gQ2FydFNlcnZpY2UuY29udmVydE1vbmV5KDAsIFwiLFwiLCBcIi5cIiwgdGhpcy5jaGVja291dEluZm8udG90YWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkU2hpcHBpbmc6IGZ1bmN0aW9uIChtZXRob2RTaGlwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobWV0aG9kU2hpcC5jaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZFNoaXAuc2hpcEFkZHJlc3MgPSBtZXRob2RTaGlwLnRpdGxlICsgXCIgLSBcIiArIG1ldGhvZFNoaXAubmFtZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tvdXRJbmZvLm1ldGhvZFNoaXAgPSBtZXRob2RTaGlwO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tvdXRJbmZvLm1ldGhvZFNoaXBUZXh0ID0gQ2FydFNlcnZpY2UuY29udmVydE1vbmV5KDAsIFwiLFwiLCBcIi5cIiwgdGhpcy5jaGVja291dEluZm8ubWV0aG9kU2hpcC5wcmljZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja291dEluZm8ubWV0aG9kU2hpcC5wcmljZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tvdXRJbmZvLmdyYW5kVG90YWwgPSBDYXJ0U2VydmljZS5jb252ZXJ0TW9uZXkoMCwgXCIsXCIsIFwiLlwiLCAodGhpcy5jaGVja291dEluZm8udG90YWwgKyB0aGlzLmNoZWNrb3V0SW5mby5tZXRob2RTaGlwLnByaWNlKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrb3V0SW5mby5ncmFuZFRvdGFsID0gQ2FydFNlcnZpY2UuY29udmVydE1vbmV5KDAsIFwiLFwiLCBcIi5cIiwgdGhpcy5jaGVja291dEluZm8udG90YWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0T3JkZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FydCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgY2FydFtpXS5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgY2FydFtpXS5ocmVmO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjYXJ0W2ldLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNhcnRbaV0ucHJpY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNhcnRbaV0ucHJpY2VfbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjYXJ0W2ldLnRodW1iO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjYXJ0W2ldLmFkZGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjYXJ0W2ldW1wiJGluZGV4XCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjYXJ0W2ldW1wiJCRoYXNoS2V5XCJdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIExvZ2luU2VydmljZS5zcGxpdFVzZXJuYW1lKHRoaXMuY2hlY2tvdXRJbmZvLnVzZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBhcGlfdXJsID0gXCJodHRwOi8vc2hvcDEway52bi93ZWJfYXBpLnBocD9yPWd1ZXN0XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGVtYWlsID0gdGhpcy5jaGVja291dEluZm8udXNlci5lbWFpbDtcclxuICAgICAgICAgICAgICAgIHZhciBjdXNfYWRkcmVzcyA9IHRoaXMuY2hlY2tvdXRJbmZvLnVzZXIuYWRkcmVzcztcclxuICAgICAgICAgICAgICAgIHZhciBjaXR5ID0gXCIgVFAgXCIgKyB0aGlzLmNoZWNrb3V0SW5mby51c2VyLmNpdHk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGlzdHJpY3QgPSBcIiBxdeG6rW4gXCIgKyB0aGlzLmNoZWNrb3V0SW5mby51c2VyLmRpc3RyaWN0O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tvdXRJbmZvLm1ldGhvZFNoaXAudHlwZSA9PT0gJ2ZyZWVzaGlwcGluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXNfYWRkcmVzcyA9IFwiVOG7sSBs4bqleSBow6BuZyB04bqhaSBj4butYSBow6BuZyAxNjQgdHLhuqduIGLDrG5oIHRy4buNbmdcIjtcclxuICAgICAgICAgICAgICAgICAgICBjaXR5ID0gXCJUUCBIQ01cIjtcclxuICAgICAgICAgICAgICAgICAgICBkaXN0cmljdCA9IFwicXXhuq1uIDVcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoVXNlclNlcnZpY2UuaXNMb2dpbigpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXBpX3VybCA9IFwiaHR0cDovL3Nob3AxMGsudm4vd2ViX2FwaS5waHA/cj11c2VyJmNoZWNrPVwiICsgdGhpcy5jaGVja291dEluZm8udXNlci5lbWFpbCArIFwiJnBhc3N3b3JkPVwiICsgdGhpcy5jaGVja291dEluZm8udXNlci5wYXNzd29yZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICRodHRwLmdldChhcGlfdXJsICsgXCImb3JkZXI9dHJ1ZSZwcm9kdWN0cz1cIiArIGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjYXJ0KSkgKyBcIiZwYXltZW50PVwiICsgdGhpcy5jaGVja291dEluZm8ubWV0aG9kUGF5bWVudC50eXBlICsgXCImc2hpcHBpbmc9XCIgKyB0aGlzLmNoZWNrb3V0SW5mby5tZXRob2RTaGlwLnR5cGUgKyBcIiZsYXN0bmFtZT1cIiArIHRoaXMuY2hlY2tvdXRJbmZvLnVzZXIubGFzdG5hbWUgKyBcIiZmaXJzdG5hbWU9XCIgKyB0aGlzLmNoZWNrb3V0SW5mby51c2VyLmZpcnN0bmFtZSArIFwiJnBvc3Rjb2RlPTcwMDAwJmNpdHk9XCIgKyBjaXR5ICsgXCImZGlzdHJpY3Q9XCIgKyBkaXN0cmljdCArIFwiJnN0cmVldD1cIiArIGN1c19hZGRyZXNzICsgXCImdGVsZXBob25lPVwiICsgdGhpcy5jaGVja291dEluZm8udXNlci5waG9uZSArIFwiJmVtYWlsPVwiICsgZW1haWwgKyBcIlwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcmVzcC5kYXRhLmVycm9yICYmICFyZXNwLmRhdGEubm90ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHJlc3AuZGF0YS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgnRVJSICcgKyBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zdWNjZXNzID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKGZuKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHByb21pc2UuZXJyb3IgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4obnVsbCwgZm4pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcmVzZXRDaGVja291dEluZm86IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tvdXRJbmZvLnRvdGFsID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tvdXRJbmZvLmdyYW5kVG90YWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja291dEluZm8ubWV0aG9kU2hpcFRleHQgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja291dEluZm8ubWV0aG9kU2hpcCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja291dEluZm8ubWV0aG9kUGF5bWVudCA9IHt9O1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcmVzZXRDaGVja291dEluZm9Mb2dpbk5vdXQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0Q2hlY2tvdXRJbmZvKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrb3V0SW5mby51c2VyID0ge307XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBjaGVja291dEluZm86IGNoZWNrb3V0X2luZm8sXHJcblxyXG4gICAgICAgICAgICBzaGlwcGluZ0luZm86IGdldF9zaGlwcGluZ19tZXRob2QsXHJcblxyXG4gICAgICAgICAgICBwYXltZW50SW5mbzogZ2V0X3BheW1lbnRfbWV0aG9kXHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5yZXF1aXJlKCcuL2hvbWVfY29udHJvbGxlcicpO1xyXG5yZXF1aXJlKCcuLi8uL3VzZXIvdXNlcicpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdob21lJywgWydhcHAuc2VydmljZScsICd1c2VyJywgXCJob21lLmNvbnRyb2xsZXJcIl0pO1xyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcImhvbWUuY29udHJvbGxlclwiLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiSG9tZUNvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnTG9naW5TZXJ2aWNlJywnJGxvY2Fsc3RvcmFnZScsJyRzdGF0ZScsJ0NvbnRyb2xNb2RhbFNlcnZpY2UnLCckdGltZW91dCcsJ1VzZXJTZXJ2aWNlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBMb2dpblNlcnZpY2UsICRsb2NhbHN0b3JhZ2UsICRzdGF0ZSwgQ29udHJvbE1vZGFsU2VydmljZSwgJHRpbWVvdXQsIFVzZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50VXNlciA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY3VycmVudF91c2VyXCIpO1xyXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgaWYoIVVzZXJTZXJ2aWNlLmlzTG9naW4oKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29udHJvbE1vZGFsU2VydmljZS5zaG93KCdqcy9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJMb2dpbi5odG1sJywgJ1JlZ2lzdGVyTG9naW5Db250cm9sbGVyJywgMSk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUucHJvZHVjdHMnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgMjAwMCk7XHJcblxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vIGRvIHlvdXIgJCgpIHN0dWZmIGhlcmVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XSk7IiwiXCJ1c2Ugc3RyaWN0XCJcclxucmVxdWlyZShcIi4vbWVudV9jb250cm9sbGVyXCIpO1xyXG5yZXF1aXJlKCcuLi8uL3VzZXIvdXNlcicpO1xyXG5yZXF1aXJlKFwiLi4vLi9wcm9kdWN0cy9wcm9kdWN0c1wiKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcIm1lbnVcIiwgWydhcHAuc2VydmljZScsICd1c2VyJywgXCJwcm9kdWN0c1wiLCBcIm1lbnUuY29udHJvbGxlclwiXSlcclxuICAgIC5jb25maWcoZnVuY3Rpb24gKCRpb25pY0NvbmZpZ1Byb3ZpZGVyKSB7XHJcbiAgICAgICAgJGlvbmljQ29uZmlnUHJvdmlkZXIuYmFja0J1dHRvbi5wcmV2aW91c1RpdGxlVGV4dChmYWxzZSkudGV4dCgnJyk7XHJcbiAgICB9KTsiLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcIm1lbnUuY29udHJvbGxlclwiLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiTWVudUNvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZScsICdQcm9kdWN0U2VydmljZScsICckc3RhdGUnLCAnQ29udHJvbE1vZGFsU2VydmljZScsICckbG9jYWxzdG9yYWdlJywgJ1VzZXJTZXJ2aWNlJywnJGlvbmljU2Nyb2xsRGVsZWdhdGUnLCckaW9uaWNIaXN0b3J5JywnJGlvbmljTG9hZGluZycsJyRpb25pY1BvcHVwJywnQ2hlY2tvdXRTZXJ2aWNlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCBQcm9kdWN0U2VydmljZSwgJHN0YXRlLCBDb250cm9sTW9kYWxTZXJ2aWNlLCAkbG9jYWxzdG9yYWdlLCBVc2VyU2VydmljZSwgJGlvbmljU2Nyb2xsRGVsZWdhdGUsICRpb25pY0hpc3RvcnksICRpb25pY0xvYWRpbmcsICRpb25pY1BvcHVwLCBDaGVja291dFNlcnZpY2UpIHtcclxuICAgICAgICAgICAgJHNjb3BlLndpc2hsaXN0TnVtYmVyID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJ3aXNobGlzdFwiKS5sZW5ndGg7XHJcbiAgICAgICAgICAgICRzY29wZS5jYXJ0TnVtYmVyID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpLmxlbmd0aDtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBVc2VyU2VydmljZS5jdXJyZW50VXNlcjtcclxuICAgICAgICAgICAgVXNlclNlcnZpY2UuaXNMb2dpbigpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignVXNlckxvZ2luJywgZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudXNlciA9IFVzZXJTZXJ2aWNlLmN1cnJlbnRVc2VyO1xyXG4gICAgICAgICAgICAgICAgQ2hlY2tvdXRTZXJ2aWNlLnJlc2V0Q2hlY2tvdXRJbmZvTG9naW5Ob3V0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdVc2VyTG9nb3V0JywgZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudXNlciA9IFVzZXJTZXJ2aWNlLmN1cnJlbnRVc2VyO1xyXG4gICAgICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5jbGVhckNhY2hlKCk7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFySGlzdG9yeSgpO1xyXG4gICAgICAgICAgICAgICAgQ2hlY2tvdXRTZXJ2aWNlLnJlc2V0Q2hlY2tvdXRJbmZvTG9naW5Ob3V0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRvU3RhdGUubmFtZSA9PSBcIm1lbnUucHJvZHVjdHNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zaG93UHJvZHVjdEJhY2tCdG4gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zaG93UHJvZHVjdEJhY2tCdG4gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kb24oJ1dpc2hsaXN0VXBkYXRlJywgZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUud2lzaGxpc3ROdW1iZXIgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcIndpc2hsaXN0XCIpLmxlbmd0aDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdDYXJ0VXBkYXRlJywgZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2FydE51bWJlciA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmZpbHRlclR5cGUgPSBbXHJcbiAgICAgICAgICAgICAgICB7dHlwZTogXCJhbGxcIiwgbmFtZTogJ1PhuqNuIHBo4bqpbSBt4bubaSd9LFxyXG4gICAgICAgICAgICAgICAge3R5cGU6IFwicHJvbW9cIiwgbmFtZTogJ1PhuqNuIHBo4bqpbSBraHV54bq/biBtw6NpJ30sXHJcbiAgICAgICAgICAgICAgICB7dHlwZTogXCJwcmljZTUwa1wiICwgbmFtZTogJ0R1b2kgNTAuMDAwJ30sXHJcbiAgICAgICAgICAgICAgICB7dHlwZTogXCJwcmljZTEwMGtcIiAsIG5hbWU6ICc1MC4wMDAgZGVuIDEwMC4wMDAnfSxcclxuICAgICAgICAgICAgICAgIHt0eXBlOiBcInByaWNlMjAwa1wiICwgbmFtZTogJzEwMC4wMDAgZGVuIDIwMC4wMDAnfSxcclxuICAgICAgICAgICAgICAgIHt0eXBlOiBcInByaWNlMjAwdXBcIiAsIG5hbWU6ICdUcmVuIDIwMC4wMDAnfVxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wZW5NZW51ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS50b2dnbGVMZWZ0KCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdDbG9zZU9yZGVyJywgZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudHlwZSA9IFByb2R1Y3RTZXJ2aWNlLmdldFR5cGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZ2V0UHJvZHVjdHMgPSBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwibWVudS5wcm9kdWN0c1wiKTtcclxuICAgICAgICAgICAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2Uuc2V0VHlwZSh0eXBlKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLnNldFBhZ2UoMSk7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS51cGRhdGVMb2FkbW9yZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmZpbHRlclByb2R1Y3QoKS50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzXCIpXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdM4buXaScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnQuG6oW4gdnVpIGzDsm5nIHRo4butIGNo4buNbiBs4bqhaSBz4bqjbiBwaOG6qW0nXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNvbnRhY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBDb250cm9sTW9kYWxTZXJ2aWNlLnNob3coJ2pzL21vZHVsZXMvY29udGFjdC9jb250YWN0Lmh0bWwnLCAnQ29udGFjdENvbnRyb2xsZXInLCAxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNob3dfY2FydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcIm1lbnUuY2FydFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVzZXJfaW5mbyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcIm1lbnUudXNlclwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnRvX2xvZ2luID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgQ29udHJvbE1vZGFsU2VydmljZS5zaG93KCdqcy9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJMb2dpbi5odG1sJywgJ1JlZ2lzdGVyTG9naW5Db250cm9sbGVyJywgMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5zaWdub3V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgVXNlclNlcnZpY2Uuc2lnbk91dCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZ2V0UHJvZHVjdHMoXCJhbGxcIik7XHJcbiAgICAgICAgfVxyXG4gICAgXSk7XHJcbiIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwicHJvZHVjdC5jb250cm9sbGVyXCIsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnc3Bpbm5lck9uTG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5sb2FkZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYmluZCgnbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxuICAgIC5jb250cm9sbGVyKFwiUHJvZHVjdENvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnUHJvZHVjdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgJ1dpc2hsaXN0U2VydmljZScsICckaHR0cCcsICdDb250cm9sTW9kYWxTZXJ2aWNlJywgJyRpb25pY1NsaWRlQm94RGVsZWdhdGUnLCAnQ2FydFNlcnZpY2UnLCAnJGxvY2Fsc3RvcmFnZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgUHJvZHVjdFNlcnZpY2UsICRzdGF0ZVBhcmFtcywgV2lzaGxpc3RTZXJ2aWNlLCAkaHR0cCwgQ29udHJvbE1vZGFsU2VydmljZSwgJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZSwgQ2FydFNlcnZpY2UsICRsb2NhbHN0b3JhZ2UpIHtcclxuICAgICAgICAgICAgdmFyIGxpbmtfYWpheCA9IFwiaHR0cDovL3Nob3AxMGsudm4vYXBpL3Jlc3QvcHJvZHVjdHNcIjtcclxuICAgICAgICAgICAgdmFyIGxpbmtfYWpheF9uZXcgPSBcImh0dHA6Ly9zaG9wMTBrLnZuL3dlYl9hcGkucGhwXCI7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUucHJvZHVjdCA9IHt9O1xyXG4gICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmdldEtleVRpbWUoKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKG1kNWtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXhfbmV3ICsgXCI/cj1wcm9kdWN0JmlkPVwiICsgJHN0YXRlUGFyYW1zLmlkICsgXCIma2V5PVwiICsgbWQ1a2V5KS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXAucHVzaChyZXNwLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnVwZGF0ZUFycmF5KHRlbXAsICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKSwgXCJhZGRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS51cGRhdGVBcnJheSh0ZW1wLCAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcIndpc2hsaXN0XCIpLCBcImxpa2VcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJvZHVjdC5kZXRhaWwgPSB0ZW1wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJvZHVjdC5kZXRhaWxbXCJ0aHVtYlwiXSA9ICRzY29wZS5wcm9kdWN0LmRldGFpbC5pbWFnZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJGh0dHAuZ2V0KGxpbmtfYWpheCArIFwiL1wiICsgJHN0YXRlUGFyYW1zLmlkICsgXCIvaW1hZ2VzXCIgKyBcIj9rZXk9XCIgKyBtZDVrZXkpLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3QuaW1hZ2VzID0gcmVzcC5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlU2xpZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXggKyBcIi9cIiArICRzdGF0ZVBhcmFtcy5pZCArIFwiL2NhdGVnb3JpZXNcIiArIFwiP2tleT1cIiArIG1kNWtleSkudGhlbihmdW5jdGlvbiAoY2F0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9kdWN0LmNhdGVnb3J5ID0gY2F0LmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXhfbmV3ICsgXCI/cj1jYXRlZ29yeSZpZD1cIiArICRzY29wZS5wcm9kdWN0LmNhdGVnb3J5WzBdLmNhdGVnb3J5X2lkICsgXCImbGltaXQ9NiZrZXk9XCIgKyBtZDVrZXkpLnRoZW4oZnVuY3Rpb24gKHJlbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3QucmVsYXRlZCA9IHJlbGF0ZS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZVNsaWRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRpb25pY1NsaWRlQm94RGVsZWdhdGUudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hZGRUb1dpc2hsaXN0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIFdpc2hsaXN0U2VydmljZS5hZGRXaXNobGlzdChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFkZF90b19jYXJ0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIENhcnRTZXJ2aWNlLmFkZENhcnQoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jaG9vc2VQcm9kdWN0T3B0aW9uID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIENvbnRyb2xNb2RhbFNlcnZpY2Uuc2hvdygnanMvbW9kdWxlcy9jYXJ0L2NhcnQuaHRtbCcsICdDYXJ0Q29udHJvbGxlcicsIDEsIGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuaW5kZXhfbnVtYmVyID0gMTtcclxuICAgICAgICAgICAgJHNjb3BlLnNsaWRlSGFzQ2hhbmdlZCA9IGZ1bmN0aW9uKCRpbmRleCl7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuaW5kZXhfbnVtYmVyID0gJGluZGV4ICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1dKTtcclxuXHJcbiIsIlwidXNlIHN0cmljdFwiXHJcbnJlcXVpcmUoXCIuL3Byb2R1Y3RzX2ZhY3RvcnkuanNcIik7XHJcbnJlcXVpcmUoXCIuL3Byb2R1Y3RzX2NvbnRyb2xsZXIuanNcIik7XHJcbnJlcXVpcmUoXCIuL3Byb2R1Y3RfY29udHJvbGxlci5qc1wiKTtcclxucmVxdWlyZSgnLi4vLi93aXNobGlzdC93aXNobGlzdF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4vY2FydC9jYXJ0X3NlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcInByb2R1Y3RzXCIsIFsnYXBwLnNlcnZpY2UnLCAnd2lzaGxpc3Quc2VydmljZScsICdjYXJ0LnNlcnZpY2VzJywgXCJwcm9kdWN0cy5mYWN0b3J5XCIsIFwicHJvZHVjdHMuY29udHJvbGxlclwiLCBcInByb2R1Y3QuY29udHJvbGxlclwiXSlcclxuICAgIC5jb25maWcoZnVuY3Rpb24gKCRpb25pY0NvbmZpZ1Byb3ZpZGVyKSB7XHJcbiAgICAgICAgJGlvbmljQ29uZmlnUHJvdmlkZXIuYmFja0J1dHRvbi5wcmV2aW91c1RpdGxlVGV4dChmYWxzZSkudGV4dCgnJyk7XHJcbiAgICB9KTsiLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcInByb2R1Y3RzLmNvbnRyb2xsZXJcIiwgW10pXHJcbiAgICAuY29udHJvbGxlcihcIlByb2R1Y3RzQ29udHJvbGxlclwiLCBbJyRzY29wZScsICckaW9uaWNTaWRlTWVudURlbGVnYXRlJywgJ1Byb2R1Y3RTZXJ2aWNlJywgJ0NvbnRyb2xNb2RhbFNlcnZpY2UnLCAnV2lzaGxpc3RTZXJ2aWNlJywgJ0NhcnRTZXJ2aWNlJywgJ0NoZWNrb3V0U2VydmljZScsJ1VzZXJTZXJ2aWNlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCBQcm9kdWN0U2VydmljZSwgQ29udHJvbE1vZGFsU2VydmljZSwgV2lzaGxpc3RTZXJ2aWNlLCBDYXJ0U2VydmljZSwgQ2hlY2tvdXRTZXJ2aWNlLCBVc2VyU2VydmljZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUuY2FydE51bWJlciA9IENhcnRTZXJ2aWNlLmdldENhcnROdW1iZXIoKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kb24oJ1VzZXJMb2dvdXQnLCBmdW5jdGlvbiAoZXZlbnQsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIENoZWNrb3V0U2VydmljZS5yZXNldENoZWNrb3V0SW5mbygpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5wcm9kdWN0cyA9IFByb2R1Y3RTZXJ2aWNlLnByb2R1Y3RDdXJyZW50O1xyXG4gICAgICAgICAgICBDYXJ0U2VydmljZS5zZXRDYXJ0TnVtYmVyKCk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudG90YWwgPSBDYXJ0U2VydmljZS5jb252ZXJ0TW9uZXkoMCwgXCIsXCIsIFwiLlwiLCBDYXJ0U2VydmljZS5zdW1DYXJ0KCkpO1xyXG4gICAgICAgICAgICAkc2NvcGUubG9hZE1vcmUgPSBQcm9kdWN0U2VydmljZS5sb2FkTW9yZTtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBVc2VyU2VydmljZS5jdXJyZW50VXNlcjtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5vcGVuTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUudG9nZ2xlTGVmdCgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmxvYWRNb3JlRGF0YSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmKCRzY29wZS5sb2FkTW9yZVswXSl7XHJcbi8vICAgICAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5pbml0KDkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IFByb2R1Y3RTZXJ2aWNlLmdldFBhZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wID09IDEpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5zZXRQYWdlKDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5maWx0ZXJQcm9kdWN0KCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdCgnc2Nyb2xsLmluZmluaXRlU2Nyb2xsQ29tcGxldGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2Uuc2V0UGFnZSgrK2RhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS51cGRhdGVMb2FkbW9yZShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkX3RvX2NhcnQgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgQ2FydFNlcnZpY2UuYWRkQ2FydChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFkZFRvV2lzaGxpc3QgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgV2lzaGxpc3RTZXJ2aWNlLmFkZFdpc2hsaXN0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdDYXJ0VXBkYXRlJywgZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2FydE51bWJlciA9IENhcnRTZXJ2aWNlLmdldENhcnROdW1iZXIoKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS50b3RhbCA9IENhcnRTZXJ2aWNlLmNvbnZlcnRNb25leSgwLCBcIixcIiwgXCIuXCIsIENhcnRTZXJ2aWNlLnN1bUNhcnQoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignJGlvbmljVmlldy5lbnRlcicsIGZ1bmN0aW9uICh2aWV3SW5mbywgc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jYXJ0TnVtYmVyID0gQ2FydFNlcnZpY2UuZ2V0Q2FydE51bWJlcigpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gQ2FydFNlcnZpY2UuY29udmVydE1vbmV5KDAsIFwiLFwiLCBcIi5cIiwgQ2FydFNlcnZpY2Uuc3VtQ2FydCgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgXSk7XHJcbiIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwicHJvZHVjdHMuZmFjdG9yeVwiLCBbXSlcclxuICAgIC5mYWN0b3J5KCdQcm9kdWN0U2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGh0dHAsICRsb2NhbHN0b3JhZ2UsICRpb25pY0xvYWRpbmcsICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgcHJvZHVjdHMgPSBbXTtcclxuICAgICAgICB2YXIgZmlsdGVyID0ge1xyXG4gICAgICAgICAgICBsaW1pdDogMjAsXHJcbiAgICAgICAgICAgIHR5cGU6ICcnXHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgaXNMb2FkTW9yZSA9IFtdO1xyXG4gICAgICAgIHZhciBjdXJyZW50X2luZGV4ID0gMDtcclxuICAgICAgICB2YXIgY3VycmVudF9wb3NpdGlvbiA9IDA7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZF9wcm9kdWN0KGRhdGEpIHtcclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gJC5tYXAoZGF0YSwgZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFt2YWx1ZV07XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGFycmF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0c1tjdXJyZW50X2luZGV4XSA9IGFycmF5W2ldO1xyXG4vLyAgICAgICAgICAgICAgcHJvZHVjdHMucHVzaChhcnJheVtpXSk7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50X2luZGV4Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybntcclxuICAgICAgICAgICAgc2V0Q3VycmVudFBvczogZnVuY3Rpb24ocG9zKXtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRfcG9zaXRpb24gPSBwb3M7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldEN1cnJlbnRQb3M6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudF9wb3NpdGlvbjtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZmlsdGVyUHJvZHVjdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBmaWx0ZXIubGltaXQgPSAyMDtcclxuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXIucGFnZSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhclByb2R1Y3RzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5zaG93KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdMb2FkaW5nLi4uJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlci5saW1pdCA9IDIwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuZ2V0S2V5VGltZSgpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKG1kNWtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGlua19hamF4ID0gXCJodHRwOi8vc2hvcDEway52bi9hcGkvcmVzdC9wcm9kdWN0c1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkaHR0cC5nZXQoXCJodHRwOi8vc2hvcDEway52bi93ZWJfYXBpLnBocD9yPVwiICsgZmlsdGVyLnR5cGUgKyBcIiZsaW1pdD1cIiArIGZpbHRlci5saW1pdCArIFwiJnBhZ2U9XCIgKyBmaWx0ZXIucGFnZSArIFwiJmtleT1cIiArIG1kNWtleSkudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwLmRhdGEuRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRfcHJvZHVjdChyZXNwLmRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS51cGRhdGVBcnJheShwcm9kdWN0cywgJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpLCBcImFkZGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UudXBkYXRlQXJyYXkocHJvZHVjdHMsICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIiksIFwibGlrZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShmaWx0ZXIucGFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZmlsdGVyLnBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlcnIuc3RhdHVzIHdpbGwgY29udGFpbiB0aGUgc3RhdHVzIGNvZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0VSUicsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0VSUiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KFwid3Jvbmcga2V5XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIClcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXRQYWdlOiBmdW5jdGlvbiAobnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXIucGFnZSA9IG51bWJlcjtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldFR5cGU6IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXIudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRUeXBlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnR5cGU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRQYWdlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnBhZ2U7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRJbmRleDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRfaW5kZXg7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRBdHRyaWJ1dGU6IGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBwcm9kdWN0cykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9kdWN0c1tpXS5lbnRpdHlfaWQgPT0gaXRlbS5lbnRpdHlfaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHNbaV1baW5kZXhdID0gaXRlbVtpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgdXBkYXRlTG9hZG1vcmU6IGZ1bmN0aW9uIChsb2FkKSB7XHJcbiAgICAgICAgICAgICAgICBpc0xvYWRNb3JlWzBdID0gbG9hZDtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGNsZWFyUHJvZHVjdHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50X2luZGV4ID0gMDtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uIChudW1iZXIpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtYmVyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsb2FkaW5nXCI6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGZpbHRlcjogZmlsdGVyLFxyXG5cclxuICAgICAgICAgICAgbG9hZE1vcmU6IGlzTG9hZE1vcmUsXHJcblxyXG4gICAgICAgICAgICBwcm9kdWN0Q3VycmVudDogcHJvZHVjdHNcclxuICAgICAgICB9XHJcbiAgICB9XHJcbilcclxuOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vdXNlcl9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4vdXNlcl9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoXCIuLi8uL3Byb2R1Y3RzL3Byb2R1Y3RzXCIpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwidXNlclwiLCBbJ2FwcC5zZXJ2aWNlJywgXCJwcm9kdWN0c1wiLCAndXNlci5zZXJ2aWNlJywgJ3VzZXIuY29udHJvbGxlciddKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCd1c2VyLmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiVXNlckNvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCdVc2VyU2VydmljZScsJyRpb25pY1BvcHVwJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBVc2VyU2VydmljZSwgJGlvbmljUG9wdXApIHtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBVc2VyU2VydmljZS5jdXJyZW50VXNlcjtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVVc2VyID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIFVzZXJTZXJ2aWNlLnVwZGF0ZVVzZXIoJHNjb3BlLnVzZXIpLnN1Y2Nlc3MoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdD4bqtcCBuaOG6rXQgdGjDoG5oIGPDtG5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdUaMO0bmcgdGluIGPhu6dhIGLhuqFuIMSRw6MgxJHGsOG7o2MgdGhheSDEkeG7lWknXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgndXNlci5zZXJ2aWNlJywgW10pXHJcbiAgICAuc2VydmljZSgnVXNlclNlcnZpY2UnLCBmdW5jdGlvbiAoJHEsICRsb2NhbHN0b3JhZ2UsIFByb2R1Y3RTZXJ2aWNlLCAkcm9vdFNjb3BlLCAkaW9uaWNIaXN0b3J5LCAkc3RhdGUsICRpb25pY0xvYWRpbmcsICRpb25pY1BvcHVwLCAkaHR0cCwgTG9naW5TZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRfdXNlciA9IHtcclxuICAgICAgICAgICAgcG9ydHJhaXQ6IFwiaW1nL2ljb24ucG5nXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjdXJyZW50VXNlcjogY3VycmVudF91c2VyLFxyXG5cclxuICAgICAgICAgICAgaXNMb2dpbjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVzZXIgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcInVzZXJcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAodXNlci5sb2dpbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdXNlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRVc2VyW2ldID0gdXNlcltpXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHVwZGF0ZVVzZXI6IGZ1bmN0aW9uIChpbmZvKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gaW5mbykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFVzZXJbaV0gPSBpbmZvW2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIExvZ2luU2VydmljZS5zcGxpdFVzZXJuYW1lKHRoaXMuY3VycmVudFVzZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBhcGlfdXJsID0gXCJodHRwOi8vc2hvcDEway52bi93ZWJfYXBpLnBocD9yPXVzZXJcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAkaHR0cC5nZXQoYXBpX3VybCArIFwiJnVwZGF0ZWluZm89XCIgKyBlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkodGhpcy5jdXJyZW50VXNlcikpKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwLmRhdGEuY2hhbmdlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXRPYmplY3QoXCJ1c2VyXCIsIHRlbXAuY3VycmVudFVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHJlc3AuZGF0YS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgnRVJSICcgKyBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5zdWNjZXNzID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKGZuKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHByb21pc2UuZXJyb3IgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4obnVsbCwgZm4pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0VXNlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFVzZXI7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzaWduT3V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGFwaV91cmwgPSBcImh0dHA6Ly9zaG9wMTBrLnZuL3dlYl9hcGkucGhwP3I9bG9nb3V0XCI7XHJcbiAgICAgICAgICAgICAgICAkaHR0cC5nZXQoYXBpX3VybClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcC5kYXRhLmxvZ291dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHJlc3AuZGF0YS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgnRVJSICcgKyBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFVzZXIgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9naW46IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvcnRyYWl0OiBcImltZy9pY29uLnBuZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvZ291dENoZWNrb3V0OiBcImxvZ291dGVkXCJcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICRpb25pY0hpc3RvcnkuY2xlYXJDYWNoZSgpO1xyXG4gICAgICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5jbGVhckhpc3RvcnkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE51bGwoXCJ1c2VyXCIpO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsKFwiY2FydFwiKTtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbChcIndpc2hsaXN0XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLnNldFBhZ2UoMSk7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5maWx0ZXJQcm9kdWN0KCkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzXCIpXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0zhu5dpJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdC4bqhbiB2dWkgbMOybmcgdGjhu60gY2jhu41uIGzhuqFpIHPhuqNuIHBo4bqpbSdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIkNhcnRVcGRhdGVcIik7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJXaXNobGlzdFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIlVzZXJMb2dvdXRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwibWVudS5wcm9kdWN0c1wiKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGxvZ2luOiBmdW5jdGlvbiAodXNlcikge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VXNlcltpXSA9IHVzZXJbaV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRVc2VyLmxvZ2luID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE9iamVjdChcInVzZXJcIiwgdGhpcy5jdXJyZW50VXNlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsKFwiY2FydFwiKTtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbChcIndpc2hsaXN0XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLnNldFBhZ2UoMSk7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5maWx0ZXJQcm9kdWN0KCkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzXCIpXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0zhu5dpJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdC4bqhbiB2dWkgbMOybmcgdGjhu60gY2jhu41uIGzhuqFpIHPhuqNuIHBo4bqpbSdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIkNhcnRVcGRhdGVcIik7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJXaXNobGlzdFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIlVzZXJMb2dpblwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vd2lzaGxpc3RfY29udHJvbGxlci5qcycpO1xyXG5yZXF1aXJlKCcuL3dpc2hsaXN0X3NlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi4vLi9wcm9kdWN0cy9wcm9kdWN0cycpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwid2lzaGxpc3RcIiwgWydhcHAuc2VydmljZScsICdwcm9kdWN0cycsICd3aXNobGlzdC5zZXJ2aWNlJywgJ3dpc2hsaXN0LmNvbnRyb2xsZXInXSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnd2lzaGxpc3QuY29udHJvbGxlcicsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJXaXNobGlzdENvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnJGxvY2Fsc3RvcmFnZScsJ1dpc2hsaXN0U2VydmljZScsJyRzdGF0ZScsJ0NhcnRTZXJ2aWNlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYWxzdG9yYWdlLCBXaXNobGlzdFNlcnZpY2UsICRzdGF0ZSwgQ2FydFNlcnZpY2UpIHtcclxuLy8gICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE51bGxBbGwoKTtcclxuICAgICAgICAgICAgJHNjb3BlLndpc2hsaXN0TnVtYmVyID0gV2lzaGxpc3RTZXJ2aWNlLndpc2hsaXN0TnVtYmVyO1xyXG4gICAgICAgICAgICAkc2NvcGUud2lzaGxpc3QgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcIndpc2hsaXN0XCIpO1xyXG4gICAgICAgICAgICAkc2NvcGUubGVuZ3RoV2lzaGxpc3QgPSAkc2NvcGUud2lzaGxpc3QubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnJlbW92ZUZyb21XaXNobGlzdCA9IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgV2lzaGxpc3RTZXJ2aWNlLnJlbW92ZVdpc2hsaXN0KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLndpc2hsaXN0ID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJ3aXNobGlzdFwiKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5sZW5ndGhXaXNobGlzdCA9ICRzY29wZS53aXNobGlzdC5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hZGRfdG9fY2FydCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBDYXJ0U2VydmljZS5hZGRDYXJ0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ3dpc2hsaXN0LnNlcnZpY2UnLCBbXSlcclxuICAgIC5zZXJ2aWNlKCdXaXNobGlzdFNlcnZpY2UnLCBmdW5jdGlvbiAoJHEsICRsb2NhbHN0b3JhZ2UsICRyb290U2NvcGUsIFByb2R1Y3RTZXJ2aWNlKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYWRkV2lzaGxpc3QgOiBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgIGlmKCFpdGVtLmxpa2Upe1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ubGlrZSA9ICFpdGVtLmxpa2U7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5hZGRPYmplY3QoXCJ3aXNobGlzdFwiLCBpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZEF0dHJpYnV0ZShcImNhcnRcIiwgaXRlbSwgXCJsaWtlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmFkZEF0dHJpYnV0ZShpdGVtLCBcImxpa2VcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIldpc2hsaXN0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVdpc2hsaXN0KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcmVtb3ZlV2lzaGxpc3QgOiBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgIGl0ZW0ubGlrZSA9ICFpdGVtLmxpa2U7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnJlbW92ZU9iamVjdChcIndpc2hsaXN0XCIsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5hZGRBdHRyaWJ1dGUoXCJjYXJ0XCIsIGl0ZW0sIFwibGlrZVwiKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmFkZEF0dHJpYnV0ZShpdGVtLCBcImxpa2VcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiV2lzaGxpc3RVcGRhdGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIH1cclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vY29udGFjdF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4vY29udGFjdF9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJjb250YWN0XCIsIFsnYXBwLnNlcnZpY2UnLCAnY29udGFjdC5zZXJ2aWNlcycsICdjb250YWN0LmNvbnRyb2xsZXInXSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnY29udGFjdC5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIkNvbnRhY3RDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJ3BhcmFtZXRlcnMnLCAnJGxvY2Fsc3RvcmFnZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgcGFyYW1ldGVycywgJGxvY2Fsc3RvcmFnZSkge1xyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjb250YWN0LnNlcnZpY2VzJywgW10pXHJcbiAgICAuc2VydmljZSgnQ29udGFjdFNlcnZpY2UnLCBmdW5jdGlvbiAoJHEpIHtcclxuXHJcblxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgncmVnaXN0ZXJMb2dpbi5zZXJ2aWNlcycsIFtdKVxyXG4gICAgLnNlcnZpY2UoJ0xvZ2luU2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGh0dHAsICRsb2NhbHN0b3JhZ2UsICRpb25pY0hpc3RvcnkpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBsb2dpblVzZXI6IGxvZ2luVXNlcixcclxuICAgICAgICAgICAgcmVnaXN0ZXJVc2VyOiByZWdpc3RlclVzZXIsXHJcbiAgICAgICAgICAgIGdldEluZm86IGdldEluZm8sXHJcbiAgICAgICAgICAgIHNwbGl0VXNlcm5hbWUgOiBzcGxpdFVzZXJuYW1lXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNwbGl0VXNlcm5hbWUodXNlcil7XHJcbiAgICAgICAgICAgIHZhciBuYW1lX29iaiA9IHVzZXIubmFtZS5zcGxpdChcIiBcIik7XHJcbiAgICAgICAgICAgIHVzZXIuZmlyc3RuYW1lID0gbmFtZV9vYmpbMF07XHJcbiAgICAgICAgICAgIHVzZXIubGFzdG5hbWUgPSBcIlwiO1xyXG4gICAgICAgICAgICB2YXIgbGFzdF9uYW1lX2FyciA9IG5hbWVfb2JqLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RfbmFtZV9hcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHVzZXIubGFzdG5hbWUgKz0gbGFzdF9uYW1lX2FycltpXSArIFwiIFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRJbmZvKG9iaikge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuZ2V0S2V5VGltZSgpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAobWQ1a2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGh0dHAuZ2V0KFwiaHR0cDovL3Nob3AxMGsudm4vd2ViX2FwaS5waHA/cj11c2VyJmNoZWNrPVwiICsgb2JqLmVtYWlsICsgXCImcGFzc3dvcmQ9XCIgKyBvYmoucGFzc3dvcmQgKyBcIiZkZXRhaWw9dHJ1ZVwiICsgXCIma2V5PVwiICsgbWQ1a2V5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwLmRhdGEuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3AuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QocmVzcC5kYXRhLmVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdFUlIgJyArIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChcIndyb25nIGtleVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHByb21pc2Uuc3VjY2VzcyA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb21pc2UuZXJyb3IgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihudWxsLCBmbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiByZWdpc3RlclVzZXIob2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3BsaXRVc2VybmFtZShvYmopO1xyXG5cclxuICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5nZXRLZXlUaW1lKCkudGhlbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChtZDVrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAkaHR0cC5nZXQoXCJodHRwOi8vc2hvcDEway52bi93ZWJfYXBpLnBocD9yPXVzZXImcmVnaXN0ZXI9dHJ1ZSZmaXJzdG5hbWU9XCIgKyBvYmouZmlyc3RuYW1lICsgXCImbGFzdG5hbWU9XCIgKyBvYmoubGFzdG5hbWUgKyBcIiZwYXNzd29yZD1cIiArIG9iai5wYXNzd29yZCArIFwiJmVtYWlsPVwiICsgb2JqLmVtYWlsICsgXCIma2V5PVwiICsgbWQ1a2V5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwLmRhdGEuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwLmRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyZXNwLmRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlcnIuc3RhdHVzIHdpbGwgY29udGFpbiB0aGUgc3RhdHVzIGNvZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0VSUicsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0VSUiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KFwid3Jvbmcga2V5XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApXHJcblxyXG4gICAgICAgICAgICBwcm9taXNlLnN1Y2Nlc3MgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihmbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcm9taXNlLmVycm9yID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4obnVsbCwgZm4pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9naW5Vc2VyKG9iaikge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuZ2V0S2V5VGltZSgpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAobWQ1a2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGh0dHAuZ2V0KFwiaHR0cDovL3Nob3AxMGsudm4vd2ViX2FwaS5waHA/cj11c2VyJmxvZ2luPVwiICsgb2JqLmVtYWlsICsgXCImcGFzc3dvcmQ9XCIgKyBvYmoucGFzc3dvcmQgKyBcIiZrZXk9XCIgKyBtZDVrZXkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFySGlzdG9yeSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5jbGVhckNhY2hlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3AuZGF0YS5FWENFUFRJT05fSU5WQUxJRF9FTUFJTF9PUl9QQVNTV09SRCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoJ1dlbGNvbWUgJyArIG5hbWUgKyAnIScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHJlc3AuZGF0YS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgnRVJSICcgKyBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoXCJ3cm9uZyBrZXlcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgcHJvbWlzZS5zdWNjZXNzID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oZm4pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvbWlzZS5lcnJvciA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKG51bGwsIGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH1cclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vbG9naW5fc2VydmljZS5qcycpO1xyXG5yZXF1aXJlKCcuL3JlZ2lzdGVyX2xvZ2luX2NvbnRyb2xsZXIuanMnKTtcclxucmVxdWlyZSgnLi4vLi4vLi9sYXlvdXQvdXNlci91c2VyJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJyZWdpc3RlckxvZ2luXCIsIFsnYXBwLnNlcnZpY2UnLCAndXNlcicsICdyZWdpc3RlckxvZ2luLnNlcnZpY2VzJywgJ3JlZ2lzdGVyTG9naW4uY29udHJvbGxlciddKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdyZWdpc3RlckxvZ2luLmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiUmVnaXN0ZXJMb2dpbkNvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnTG9naW5TZXJ2aWNlJywgJyRzdGF0ZScsICckaW9uaWNQb3B1cCcsICckbG9jYWxzdG9yYWdlJywgJ1VzZXJTZXJ2aWNlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBMb2dpblNlcnZpY2UsICRzdGF0ZSwgJGlvbmljUG9wdXAsICRsb2NhbHN0b3JhZ2UsIFVzZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gVXNlclNlcnZpY2UuY3VycmVudF91c2VyO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignbW9kYWwuaGlkZGVuJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdtZW51LnByb2R1Y3RzJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmxvZ2luRGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAkc2NvcGUucmVnaXN0ZXJEYXRhID0ge307XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUub3BlbkxvZ2luTW9kYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUub3Blbk1vZGFsKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jbG9zZUxvZ2luTW9kYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VNb2RhbCgpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdtZW51LnByb2R1Y3RzJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vbG9naW4gc2VjdGlvblxyXG4gICAgICAgICAgICAkc2NvcGUuZG9SZWdpc3RlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIExvZ2luU2VydmljZS5yZWdpc3RlclVzZXIoJHNjb3BlLnJlZ2lzdGVyRGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmVnaXN0ZXJEYXRhID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfEkMSDbmcga8O9IHRow6BuaCBjw7RuZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ1Z1aSBsw7JuZyDEkcSDbmcgbmjhuq1wIMSR4buDIHRp4bq/cCB04bulYydcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ8SQxINuZyBrw70ga2jDtG5nIHRow6BuaCBjw7RuZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvL3JlZ2lzdGVyIHNlY3Rpb25cclxuICAgICAgICAgICAgJHNjb3BlLmRvTG9naW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBMb2dpblNlcnZpY2UubG9naW5Vc2VyKCRzY29wZS5sb2dpbkRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTG9naW5TZXJ2aWNlLmdldEluZm8oJHNjb3BlLmxvZ2luRGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5uYW1lID0gZGF0YS51c2VyLmZ1bGxuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZW1haWwgPSBkYXRhLnVzZXIuZW1haWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5waG9uZSA9IGRhdGEucGhvbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5hZGRyZXNzID0gZGF0YS5hZGRyZXNzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZGlzdHJpY3QgPSBkYXRhLmRpc3RyaWN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuY2l0eSA9IGRhdGEuY2l0eTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnBhc3N3b3JkID0gJHNjb3BlLmxvZ2luRGF0YS5wYXNzd29yZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBVc2VyU2VydmljZS5sb2dpbihkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VNb2RhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5wcm9kdWN0cycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdtZW51LnVzZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTG9naW4gZmFpbGVkIScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ1BsZWFzZSBjaGVjayB5b3VyIGNyZWRlbnRpYWxzISdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXHJcbiAgICBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xyXG4gICAgICAgIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXHJcbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvXCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvaG9tZS9ob21lLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbG9naW4nLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2xvZ2luXCIsXHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZWdpc3RlckxvZ2luQ29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvbWVudVwiLFxyXG4gICAgICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvbWVudS9tZW51Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNZW51Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudS5wcm9kdWN0cycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvcHJvZHVjdHNcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0cy5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdHNDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUucHJvZHVjdCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvcHJvZHVjdC86aWRcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LmNhcnQnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2NhcnRcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9jYXJ0L2NhcnQuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NhcnRDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUud2lzaGxpc3QnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3dpc2hsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvd2lzaGxpc3Qvd2lzaGxpc3QuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1dpc2hsaXN0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LmNoZWNrb3V0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jaGVja291dFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGVja291dENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudS5jaGVja291dF9lZGl0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jaGVja291dF9lZGl0XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXRfZWRpdC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ2hlY2tvdXRFZGl0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LnVzZXInLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3VzZXJcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC91c2VyL3VzZXIuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VzZXJDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgIH1cclxuXVxyXG47Il19
