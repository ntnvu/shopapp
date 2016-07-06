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

module.export = angular.module('starter', ['ionic', 'akoenig.deckgrid', 'ng-mfb',
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
                        $http.get(link_ajax + "?category_id=" + $scope.product.category[0].category_id + "&key=" + md5key).then(function (relate) {
                            delete relate.data[$scope.product.detail[0].entity_id];
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

            $scope.slickConfig = {
                autoplay: true,
                infinite: true,
                autoplaySpeed: 1000,
                slidesToShow: 3,
                slidesToScroll: 3,
                method: {}
            };
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
            portrait: "img/portrait.jpg"
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
                    portrait: "img/portrait.jpg",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIi4vd3d3L2pzL2FwcC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvYXBwLW1haW4uanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2FwcF9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2FydC9jYXJ0LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2FydC9jYXJ0X2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9jYXJ0L2NhcnRfc2VydmljZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXRfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0X2VkaXRfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0X3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9ob21lL2hvbWUuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9ob21lL2hvbWVfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L21lbnUvbWVudS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L21lbnUvbWVudV9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdF9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHMuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0c19jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHNfZmFjdG9yeS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3VzZXIvdXNlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3VzZXIvdXNlcl9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvdXNlci91c2VyX3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC93aXNobGlzdC93aXNobGlzdC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3dpc2hsaXN0L3dpc2hsaXN0X2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC93aXNobGlzdC93aXNobGlzdF9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL2NvbnRhY3QvY29udGFjdC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9jb250YWN0L2NvbnRhY3RfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9jb250YWN0L2NvbnRhY3Rfc2VydmljZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9yZWdpc3RlckxvZ2luL2xvZ2luX3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJfbG9naW5fY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvcm91dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvL21vZHVsZSBub2RlXHJcbi8vcmVxdWlyZShcImFuZ3VsYXJcIik7XHJcblxyXG4vL21vZHVsZSBmdW5jdGlvbnNcclxucmVxdWlyZShcIi4vbW9kdWxlcy9yZWdpc3RlckxvZ2luL3JlZ2lzdGVyTG9naW5cIik7XHJcbnJlcXVpcmUoXCIuL21vZHVsZXMvY29udGFjdC9jb250YWN0XCIpO1xyXG4vL21vZHVsZSBsYXlvdXRcclxucmVxdWlyZShcIi4vbGF5b3V0L2hvbWUvaG9tZVwiKTtcclxucmVxdWlyZShcIi4vbGF5b3V0L3Byb2R1Y3RzL3Byb2R1Y3RzXCIpO1xyXG5yZXF1aXJlKFwiLi9sYXlvdXQvbWVudS9tZW51XCIpO1xyXG5yZXF1aXJlKFwiLi9sYXlvdXQvY2FydC9jYXJ0XCIpO1xyXG5yZXF1aXJlKFwiLi9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXRcIik7XHJcbnJlcXVpcmUoXCIuL2xheW91dC93aXNobGlzdC93aXNobGlzdFwiKTtcclxucmVxdWlyZShcIi4vbGF5b3V0L3VzZXIvdXNlclwiKTtcclxucmVxdWlyZShcIi4vYXBwX3NlcnZpY2VcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0ID0gYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXInLCBbJ2lvbmljJywgJ2Frb2VuaWcuZGVja2dyaWQnLCAnbmctbWZiJyxcclxuICAgICAgICAvL2Z1bmN0aW9uc1xyXG4gICAgICAgICdyZWdpc3RlckxvZ2luJyxcclxuICAgICAgICAnY29udGFjdCcsXHJcblxyXG4gICAgICAgIC8vbGF5b3V0XHJcbiAgICAgICAgJ2hvbWUnLFxyXG4gICAgICAgICdtZW51JyxcclxuICAgICAgICAncHJvZHVjdHMnLFxyXG4gICAgICAgICdjYXJ0JyxcclxuICAgICAgICAnY2hlY2tvdXQnLFxyXG4gICAgICAgICd3aXNobGlzdCcsXHJcbiAgICAgICAgJ3VzZXInLFxyXG5cclxuICAgICAgICAnYXBwLnNlcnZpY2UnLFxyXG5cclxuICAgIF0pXHJcbiAgICAuY29uZmlnKHJlcXVpcmUoJy4vcm91dGVyJykpXHJcblxyXG4gICAgLnJ1bihyZXF1aXJlKCcuL2FwcC1tYWluJykpO1xyXG5cclxuXHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcbmZ1bmN0aW9uIEFwcE1haW4oJGlvbmljUGxhdGZvcm0sICRzdGF0ZSl7XHJcbiAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXHJcbiAgICAgICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxyXG4gICAgICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XHJcbiAgICAgICAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIoZmFsc2UpO1xyXG4gICAgICAgICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuZGlzYWJsZVNjcm9sbCh0cnVlKTsvL21heWJlIGl0IGZpeCBzY3JvbGwgdXAgd2hlbiBmb2N1cyBpbnB1dCBvbiBJT1NcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcclxuICAgICAgICAgICAgLy8gb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxyXG4gICAgICAgICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGlvbmljUGxhdGZvcm0ub24oJ3Jlc3VtZScsIGZ1bmN0aW9uKCl7XHJcbi8vICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFsnJGlvbmljUGxhdGZvcm0nLCAnJHN0YXRlJywgQXBwTWFpbl07IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZVwiLCBbXSlcclxuICAgIC5mYWN0b3J5KCckbG9jYWxzdG9yYWdlJywgZnVuY3Rpb24gKCRxLCAkaHR0cCwgJHdpbmRvdywgJGlvbmljSGlzdG9yeSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKGtleSwgZGVmYXVsdFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSB8fCBkZWZhdWx0VmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXRPYmplY3Q6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXRPYmplY3Q6IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKCR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gfHwgJ3t9Jyk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXROdWxsOiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldE9iamVjdChrZXksIHt9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0TnVsbEFsbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgICRpb25pY0hpc3RvcnkuY2xlYXJDYWNoZSgpO1xyXG4gICAgICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5jbGVhckhpc3RvcnkoKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZE9iamVjdDogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IG5ldyBBcnJheSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gdGhpcy5nZXRPYmplY3Qoa2V5KTtcclxuICAgICAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzaGFyZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGFycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyW2ldLmVudGl0eV9pZCA9PSB2YWx1ZVswXS5lbnRpdHlfaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNoYXJlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLmNvbmNhdChhcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBhcnI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRPYmplY3Qoa2V5LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBvYmpBcnJOZWVkVXBkYXRlIDogaXMgYW4gYXJyYXkgbmVlZCB1cGRhdGUgYWZ0ZXIgbWFpbiBhcnJheSBpc1xyXG4gICAgICAgICAgICAgKiAqL1xyXG4gICAgICAgICAgICByZW1vdmVPYmplY3Q6IGZ1bmN0aW9uIChrZXksIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBhcnIgPSB0aGlzLmdldE9iamVjdChrZXkpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJyW2ldLmVudGl0eV9pZCA9PSBpdGVtLmVudGl0eV9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldE9iamVjdChrZXksIGFycik7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBtZXJnZUFycmF5OiBmdW5jdGlvbiAoYXJyMSwgYXJyMikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFycjMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYXJyMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzaGFyZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqIGluIGFycjIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnIyW2pdLmVudGl0eV9pZCA9PSBhcnIxW2ldLmVudGl0eV9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzaGFyZWQpIGFycjMucHVzaChhcnIxW2ldKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYXJyMyA9IGFycjMuY29uY2F0KGFycjIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFycjM7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vaW5wdXQgMiBhcnJheVxyXG4gICAgICAgICAgICAvL3JldHVybiBhcnJheSBjb250YWluIGFsbCBlbGVtZW50cyB3aGljaCBhcmUgaW4gYm90aCBhcnJheSBhbmQgdXBkYXRlIGZvbGxvdyBhcnIyXHJcbiAgICAgICAgICAgIHVwZGF0ZUFycmF5OiBmdW5jdGlvbiAoYXJyMSwgYXJyMiwga2V5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGFycjEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqIGluIGFycjIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycjJbal0uZW50aXR5X2lkID09IGFycjFbaV0uZW50aXR5X2lkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyMVtpXVtrZXldID0gYXJyMltqXVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkQXR0cmlidXRlOiBmdW5jdGlvbiAoa2V5LCBpdGVtLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IHRoaXMuZ2V0T2JqZWN0KGtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGFycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyW2ldLmVudGl0eV9pZCA9PSBpdGVtLmVudGl0eV9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyW2ldW2luZGV4XSA9IGl0ZW1baW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0T2JqZWN0KGtleSwgYXJyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZEF0dHJpYnV0ZUFsbDogZnVuY3Rpb24gKGtleSwgYXR0ciwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhcnIgPSB0aGlzLmdldE9iamVjdChrZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyW2ldW2F0dHJdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0T2JqZWN0KGtleSwgYXJyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEtleVRpbWU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2U7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBsaW5rX2FqYXggPSBcImh0dHA6Ly9zaG9wMTBrLnZuL3dlYl9hcGkucGhwP3I9dGltZXNwYW1cIjtcclxuICAgICAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXgpLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3AuZGF0YS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gcmVzcC5kYXRhLnRpbWVzcGFtICsgJ2FwcCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZDVrZXkgPSBtZDUoa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShtZDVrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoW3tcInByb2R1Y3RpZFwiOlwiMTg3M1wiLFwicXVhbnRpdHlcIjpcIjJcIn0se1wicHJvZHVjdGlkXCI6XCIxODcxXCIsXCJxdWFudGl0eVwiOlwiMlwifV0pKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QocmVzcC5kYXRhLmVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZXJyLnN0YXR1cyB3aWxsIGNvbnRhaW4gdGhlIHN0YXR1cyBjb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRVJSJywgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0VSUiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICAuc2VydmljZSgnQ29udHJvbE1vZGFsU2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGlvbmljTW9kYWwsICRyb290U2NvcGUsICR0aW1lb3V0LCAkY29udHJvbGxlcikge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNob3c6IHNob3dcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gc2hvdyh0ZW1wbGV0ZVVybCwgY29udHJvbGxlciwgYXV0b3Nob3csIHBhcmFtZXRlcnMsIG9wdGlvbnMsIHdyYXBDYWxzcykge1xyXG4gICAgICAgICAgICAvLyBHcmFiIHRoZSBpbmplY3RvciBhbmQgY3JlYXRlIGEgbmV3IHNjb3BlXHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCksXHJcbiAgICAgICAgICAgICAgICBjdHJsSW5zdGFuY2UsXHJcbiAgICAgICAgICAgICAgICBtb2RhbFNjb3BlID0gJHJvb3RTY29wZS4kbmV3KCksXHJcbiAgICAgICAgICAgICAgICB0aGlzU2NvcGVJZCA9IG1vZGFsU2NvcGUuJGlkLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiAnc2xpZGUtaW4tdXAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvY3VzRmlyc3RJbnB1dDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2Ryb3BDbGlja1RvQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgaGFyZHdhcmVCYWNrQnV0dG9uQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxDYWxsYmFjazogbnVsbFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgJGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKHRlbXBsZXRlVXJsLCB7XHJcbiAgICAgICAgICAgICAgICBzY29wZTogbW9kYWxTY29wZSxcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogb3B0aW9ucy5hbmltYXRpb24sXHJcbiAgICAgICAgICAgICAgICBmb2N1c0ZpcnN0SW5wdXQ6IG9wdGlvbnMuZm9jdXNGaXJzdElucHV0LFxyXG4gICAgICAgICAgICAgICAgYmFja2Ryb3BDbGlja1RvQ2xvc2U6IG9wdGlvbnMuYmFja2Ryb3BDbGlja1RvQ2xvc2UsXHJcbiAgICAgICAgICAgICAgICBoYXJkd2FyZUJhY2tCdXR0b25DbG9zZTogb3B0aW9ucy5oYXJkd2FyZUJhY2tCdXR0b25DbG9zZVxyXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWwgPSBtb2RhbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWwuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLm1vZGFsLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLiRvbignbW9kYWwuaGlkZGVuJywgZnVuY3Rpb24gKHRoaXNNb2RhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc01vZGFsLmN1cnJlbnRTY29wZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1vZGFsU2NvcGVJZCA9IHRoaXNNb2RhbC5jdXJyZW50U2NvcGUuJGlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNTY29wZUlkID09PSBtb2RhbFNjb3BlSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jbGVhbnVwKHRoaXNNb2RhbC5jdXJyZW50U2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEludm9rZSB0aGUgY29udHJvbGxlclxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsb2NhbHMgPSB7ICckc2NvcGUnOiBtb2RhbFNjb3BlLCAncGFyYW1ldGVycyc6IHBhcmFtZXRlcnMgfTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY3RybEV2YWwgPSBfZXZhbENvbnRyb2xsZXIoY29udHJvbGxlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybEluc3RhbmNlID0gJGNvbnRyb2xsZXIoY29udHJvbGxlciwgbG9jYWxzKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3RybEV2YWwuaXNDb250cm9sbGVyQXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RybEluc3RhbmNlLm9wZW5Nb2RhbCA9IG1vZGFsU2NvcGUub3Blbk1vZGFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHJsSW5zdGFuY2UuY2xvc2VNb2RhbCA9IG1vZGFsU2NvcGUuY2xvc2VNb2RhbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdXRvc2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLm1vZGFsLnNob3coKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUuJGJyb2FkY2FzdCgnbW9kYWwuYWZ0ZXJTaG93JywgbW9kYWxTY29wZS5tb2RhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24ob3B0aW9ucy5tb2RhbENhbGxiYWNrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm1vZGFsQ2FsbGJhY2sobW9kYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX2NsZWFudXAoc2NvcGUpIHtcclxuICAgICAgICAgICAgc2NvcGUuJGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgaWYgKHNjb3BlLm1vZGFsKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5tb2RhbC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX2V2YWxDb250cm9sbGVyKGN0cmxOYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7XHJcbiAgICAgICAgICAgICAgICBpc0NvbnRyb2xsZXJBczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyTmFtZTogJycsXHJcbiAgICAgICAgICAgICAgICBwcm9wTmFtZTogJydcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdmFyIGZyYWdtZW50cyA9IChjdHJsTmFtZSB8fCAnJykudHJpbSgpLnNwbGl0KC9cXHMrLyk7XHJcbiAgICAgICAgICAgIHJlc3VsdC5pc0NvbnRyb2xsZXJBcyA9IGZyYWdtZW50cy5sZW5ndGggPT09IDMgJiYgKGZyYWdtZW50c1sxXSB8fCAnJykudG9Mb3dlckNhc2UoKSA9PT0gJ2FzJztcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5pc0NvbnRyb2xsZXJBcykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmNvbnRyb2xsZXJOYW1lID0gZnJhZ21lbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnByb3BOYW1lID0gZnJhZ21lbnRzWzJdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmNvbnRyb2xsZXJOYW1lID0gY3RybE5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9jYXJ0X3NlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi9jYXJ0X2NvbnRyb2xsZXIuanMnKTtcclxucmVxdWlyZSgnLi4vLi9wcm9kdWN0cy9wcm9kdWN0cycpO1xyXG5yZXF1aXJlKCcuLi8uL2NoZWNrb3V0L2NoZWNrb3V0Jyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJjYXJ0XCIsIFsnYXBwLnNlcnZpY2UnLCAnY2hlY2tvdXQnLCAncHJvZHVjdHMnLCAnY2FydC5zZXJ2aWNlcycsICdjYXJ0LmNvbnRyb2xsZXInXSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnY2FydC5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIkNhcnRDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRsb2NhbHN0b3JhZ2UnLCAnV2lzaGxpc3RTZXJ2aWNlJywgJ0NhcnRTZXJ2aWNlJywgJ0NoZWNrb3V0U2VydmljZScsICckc3RhdGUnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhbHN0b3JhZ2UsIFdpc2hsaXN0U2VydmljZSwgQ2FydFNlcnZpY2UsIENoZWNrb3V0U2VydmljZSwgJHN0YXRlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5jYXJ0bGlzdCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKTtcclxuICAgICAgICAgICAgJHNjb3BlLmxlbmd0aENhcnQgPSAkc2NvcGUuY2FydGxpc3QubGVuZ3RoO1xyXG4gICAgICAgICAgICBDYXJ0U2VydmljZS5zZXRDYXJ0TnVtYmVyKCk7XHJcbiAgICAgICAgICAgICRzY29wZS5jYXJ0TnVtYmVyID0gQ2FydFNlcnZpY2UuZ2V0Q2FydE51bWJlcigpO1xyXG4gICAgICAgICAgICAkc2NvcGUudG90YWwgPSBDYXJ0U2VydmljZS5jb252ZXJ0TW9uZXkoMCwgXCIsXCIsIFwiLlwiLCBDYXJ0U2VydmljZS5zdW1DYXJ0KCkpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFkZFRvV2lzaGxpc3QgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgV2lzaGxpc3RTZXJ2aWNlLmFkZFdpc2hsaXN0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUucmVtb3ZlRnJvbUNhcnQgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgQ2FydFNlcnZpY2UucmVtb3ZlQ2FydChpdGVtKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jYXJ0bGlzdCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5sZW5ndGhDYXJ0ID0gJHNjb3BlLmNhcnRsaXN0Lmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jYXJ0TnVtYmVyID0gQ2FydFNlcnZpY2UuZ2V0Q2FydE51bWJlcigpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gQ2FydFNlcnZpY2UuY29udmVydE1vbmV5KDAsIFwiLFwiLCBcIi5cIiwgQ2FydFNlcnZpY2Uuc3VtQ2FydCgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNhcnRfY2hlY2tvdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBDaGVja291dFNlcnZpY2Uuc3VtVG90YWwoKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5jaGVja291dCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdDYXJ0VXBkYXRlJywgZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudG90YWwgPSBDYXJ0U2VydmljZS5zdW1DYXJ0KCk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2FydE51bWJlciA9IENhcnRTZXJ2aWNlLmdldENhcnROdW1iZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlUXR5ID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuYWRkQXR0cmlidXRlKFwiY2FydFwiLCBpdGVtLCBcInF1YW50aXR5XCIpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gQ2FydFNlcnZpY2UuY29udmVydE1vbmV5KDAsIFwiLFwiLCBcIi5cIiwgQ2FydFNlcnZpY2Uuc3VtQ2FydCgpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnY2FydC5zZXJ2aWNlcycsIFtdKVxyXG4gICAgLnNlcnZpY2UoJ0NhcnRTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkbG9jYWxzdG9yYWdlLCAkcm9vdFNjb3BlLCBQcm9kdWN0U2VydmljZSkge1xyXG4gICAgICAgIHZhciBjYXJ0TnVtYmVyID0gMDtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhZGRDYXJ0OiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpdGVtLmFkZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FydE51bWJlcisrO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uYWRkZWQgPSAhaXRlbS5hZGRlZDtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnF1YW50aXR5ID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZE9iamVjdChcImNhcnRcIiwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5hZGRBdHRyaWJ1dGUoXCJ3aXNobGlzdFwiLCBpdGVtLCBcImFkZGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmFkZEF0dHJpYnV0ZShpdGVtLCBcImFkZGVkXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJDYXJ0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVDYXJ0KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcmVtb3ZlQ2FydDogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNhcnROdW1iZXItLTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uYWRkZWQgPSAhaXRlbS5hZGRlZDtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UucmVtb3ZlT2JqZWN0KFwiY2FydFwiLCBpdGVtKTtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuYWRkQXR0cmlidXRlKFwid2lzaGxpc3RcIiwgaXRlbSwgXCJhZGRlZFwiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5hZGRBdHRyaWJ1dGUoaXRlbSwgXCJhZGRlZFwiLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiQ2FydFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHN1bUNhcnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjYXJ0ID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRvdGFsID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gY2FydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsICs9IHBhcnNlSW50KGNhcnRbaV0ucHJpY2VfbnVtYmVyICogY2FydFtpXS5xdWFudGl0eSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdG90YWw7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBjb252ZXJ0TW9uZXkgOiBmdW5jdGlvbihjLCBkLCB0LCBudW1iZXIpe1xyXG4gICAgICAgICAgICAgICAgdmFyIG4gPSBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgYyA9IGlzTmFOKGMgPSBNYXRoLmFicyhjKSkgPyAyIDogYyxcclxuICAgICAgICAgICAgICAgICAgICBkID0gZCA9PSB1bmRlZmluZWQgPyBcIi5cIiA6IGQsXHJcbiAgICAgICAgICAgICAgICAgICAgdCA9IHQgPT0gdW5kZWZpbmVkID8gXCIsXCIgOiB0LFxyXG4gICAgICAgICAgICAgICAgICAgIHMgPSBuIDwgMCA/IFwiLVwiIDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICBpID0gcGFyc2VJbnQobiA9IE1hdGguYWJzKCtuIHx8IDApLnRvRml4ZWQoYykpICsgXCJcIixcclxuICAgICAgICAgICAgICAgICAgICBqID0gKGogPSBpLmxlbmd0aCkgPiAzID8gaiAlIDMgOiAwO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHMgKyAoaiA/IGkuc3Vic3RyKDAsIGopICsgdCA6IFwiXCIpICsgaS5zdWJzdHIoaikucmVwbGFjZSgvKFxcZHszfSkoPz1cXGQpL2csIFwiJDFcIiArIHQpICsgKGMgPyBkICsgTWF0aC5hYnMobiAtIGkpLnRvRml4ZWQoYykuc2xpY2UoMikgOiBcIlwiKSArIFwiIMSRIFwiO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0Q2FydE51bWJlciA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBjYXJ0TnVtYmVyID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpLmxlbmd0aCA+IDAgPyAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIikubGVuZ3RoIDogMDtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldENhcnROdW1iZXIgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCcuL2NoZWNrb3V0X2NvbnRyb2xsZXInKTtcclxucmVxdWlyZSgnLi9jaGVja291dF9lZGl0X2NvbnRyb2xsZXInKTtcclxucmVxdWlyZSgnLi9jaGVja291dF9zZXJ2aWNlJyk7XHJcbnJlcXVpcmUoJy4uLy4vdXNlci91c2VyJyk7XHJcbnJlcXVpcmUoXCIuLi8uL3Byb2R1Y3RzL3Byb2R1Y3RzXCIpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiY2hlY2tvdXRcIiwgWydhcHAuc2VydmljZScsICd1c2VyJywgJ3Byb2R1Y3RzJywgJ2NoZWNrb3V0LnNlcnZpY2UnLCAnY2hlY2tvdXQuY29udHJvbGxlcicsICdjaGVja291dEVkaXQuY29udHJvbGxlciddKSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NoZWNrb3V0LmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiQ2hlY2tvdXRDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRsb2NhbHN0b3JhZ2UnLCAnQ29udHJvbE1vZGFsU2VydmljZScsICckc3RhdGUnLCAnJHJvb3RTY29wZScsICdDaGVja291dFNlcnZpY2UnLCAnVXNlclNlcnZpY2UnLCAnUHJvZHVjdFNlcnZpY2UnLCAnJGlvbmljUG9wdXAnLCAnJGlvbmljSGlzdG9yeScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2Fsc3RvcmFnZSwgQ29udHJvbE1vZGFsU2VydmljZSwgJHN0YXRlLCAkcm9vdFNjb3BlLCBDaGVja291dFNlcnZpY2UsIFVzZXJTZXJ2aWNlLCBQcm9kdWN0U2VydmljZSwgJGlvbmljUG9wdXAsICRpb25pY0hpc3RvcnkpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBVc2VyU2VydmljZS5jdXJyZW50VXNlcjtcclxuICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0SW5mbyA9IENoZWNrb3V0U2VydmljZS5jaGVja291dEluZm87XHJcblxyXG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoJHNjb3BlLmNoZWNrb3V0SW5mb1tcIm1ldGhvZFNoaXBcIl0pLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgQ2hlY2tvdXRTZXJ2aWNlLnNoaXBwaW5nSW5mbygpLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2hpcHBpbmdJbmZvID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2hlY2tvdXRJbmZvW1wibWV0aG9kU2hpcFwiXSA9IHNoaXBwaW5nSW5mb1swXS5tZXRob2RbMF07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKCRzY29wZS5jaGVja291dEluZm9bXCJtZXRob2RQYXltZW50XCJdKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIENoZWNrb3V0U2VydmljZS5wYXltZW50SW5mbygpLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2hlY2tvdXRJbmZvW1wibWV0aG9kUGF5bWVudFwiXSA9IGRhdGFbMV07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgQ2hlY2tvdXRTZXJ2aWNlLnVwZGF0ZUNoZWNrb3V0SW5mb1VzZXIoJHNjb3BlLnVzZXIpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCEkc2NvcGUuY2hlY2tvdXRJbmZvLnVzZXIubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0Lhu5Ugc3VuZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnVnVpIGzDsm5nIG5o4bqtcCB0w6puJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoISRzY29wZS5jaGVja291dEluZm8udXNlci5hZGRyZXNzICYmICgkc2NvcGUuY2hlY2tvdXRJbmZvLm1ldGhvZFNoaXAudHlwZSAhPSAnZnJlZXNoaXBwaW5nJykpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdC4buVIHN1bmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ1Z1aSBsw7JuZyBuaOG6rXAgxJHhu4thIGNo4buJIGdpYW8gaMOgbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBDaGVja291dFNlcnZpY2Uuc2V0T3JkZXIoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNQb3B1cC5hbGVydCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfEkOG6t3QgbXVhIHRow6BuaCBjw7RuZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdYaW4gY+G6o20gxqFuIHF1w70ga2jDoWNoJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbChcImNhcnRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuYWRkQXR0cmlidXRlQWxsKFwid2lzaGxpc3RcIiwgXCJhZGRlZFwiLCBmYWxzZSk7Ly9yZW1vdmUgYWRkIHRvIGNhcmQgYXR0ciBpbiB3aXNobGlzdFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiQ2FydFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiQ2xvc2VPcmRlclwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpb25pY0hpc3RvcnkuY2xlYXJIaXN0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpb25pY0hpc3RvcnkuY2xlYXJDYWNoZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hlY2tvdXRTZXJ2aWNlLnJlc2V0Q2hlY2tvdXRJbmZvKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENoZWNrb3V0U2VydmljZS5zaGlwcGluZ0luZm8oKS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2hpcHBpbmdJbmZvID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jaGVja291dEluZm9bXCJtZXRob2RTaGlwXCJdID0gc2hpcHBpbmdJbmZvWzBdLm1ldGhvZFswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGVja291dFNlcnZpY2UucGF5bWVudEluZm8oKS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2hlY2tvdXRJbmZvW1wibWV0aG9kUGF5bWVudFwiXSA9IGRhdGFbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2Uuc2V0UGFnZSgxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuZmlsdGVyUHJvZHVjdCgpLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTOG7l2knLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnQuG6oW4gdnVpIGzDsm5nIHRo4butIGNo4buNbiBs4bqhaSBz4bqjbiBwaOG6qW0nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJtZW51LnByb2R1Y3RzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjaGVja291dEVkaXQuY29udHJvbGxlcicsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJDaGVja291dEVkaXRDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRsb2NhbHN0b3JhZ2UnLCAnVXNlclNlcnZpY2UnLCAnQ2hlY2tvdXRTZXJ2aWNlJywgJyRzdGF0ZScsICdDYXJ0U2VydmljZScsJyRpb25pY0hpc3RvcnknLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhbHN0b3JhZ2UsIFVzZXJTZXJ2aWNlLCBDaGVja291dFNlcnZpY2UsICRzdGF0ZSwgQ2FydFNlcnZpY2UsICRpb25pY0hpc3RvcnkpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnJlZ2V4MldvcmQgPSAnL14oXFxkKSskLyc7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY2hlY2tvdXRJbmZvID0gQ2hlY2tvdXRTZXJ2aWNlLmNoZWNrb3V0SW5mbztcclxuXHJcbiAgICAgICAgICAgIENoZWNrb3V0U2VydmljZS5zaGlwcGluZ0luZm8oKS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2hpcHBpbmdJbmZvID0gZGF0YTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIENoZWNrb3V0U2VydmljZS5wYXltZW50SW5mbygpLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5wYXltZW50SW5mbyA9IGRhdGE7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYmVsb3c1MCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAkc2NvcGUuYmVsb3cxMDAgPSBmYWxzZTtcclxuICAgICAgICAgICAgJHNjb3BlLnRvdGFsX3RlbXAgPSBDYXJ0U2VydmljZS5zdW1DYXJ0KCk7XHJcbiAgICAgICAgICAgIGlmICgkc2NvcGUudG90YWxfdGVtcCA8IDUwMDAwKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYmVsb3c1MCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoJHNjb3BlLnRvdGFsX3RlbXAgPCAxMDAwMDApIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5iZWxvdzEwMCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVDaGVja291dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIENoZWNrb3V0U2VydmljZS51cGRhdGVDaGVja291dEluZm8oJHNjb3BlLmNoZWNrb3V0SW5mbyk7XHJcbiAgICAgICAgICAgICAgICBDaGVja291dFNlcnZpY2UuYWRkU2hpcHBpbmcoJHNjb3BlLmNoZWNrb3V0SW5mby5tZXRob2RTaGlwKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5jaGVja291dCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY29tcGFyZU9iaiA9IGZ1bmN0aW9uIChvYmoxLCBvYmoyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9iajEgPT09IFwidW5kZWZpbmVkXCIgfHwgdHlwZW9mIG9iajIgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqMS50eXBlID09PSBvYmoyLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjaGVja291dC5zZXJ2aWNlJywgW10pXHJcbiAgICAuZmFjdG9yeSgnQ2hlY2tvdXRTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkbG9jYWxzdG9yYWdlLCBDYXJ0U2VydmljZSwgJGh0dHAsIFVzZXJTZXJ2aWNlLCBMb2dpblNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgY2hlY2tvdXRfaW5mbyA9IHtcclxuICAgICAgICAgICAgdG90YWw6IDAsXHJcbiAgICAgICAgICAgIGdyYW5kVG90YWw6IDAsXHJcbiAgICAgICAgICAgIG1ldGhvZFNoaXBUZXh0OiAwLFxyXG4gICAgICAgICAgICBtZXRob2RTaGlwOiB7fSxcclxuICAgICAgICAgICAgbWV0aG9kUGF5bWVudDoge30sXHJcbiAgICAgICAgICAgIHVzZXI6IHt9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdHJhbnNmb3JtQXJyKG9yaWcpIHtcclxuICAgICAgICAgICAgdmFyIG9yaWdfbmV3ID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBvcmlnKSB7XHJcbiAgICAgICAgICAgICAgICBvcmlnX25ldy5wdXNoKG9yaWdba2V5XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIG5ld0FyciA9IFtdLFxyXG4gICAgICAgICAgICAgICAgbmFtZXMgPSB7fSxcclxuICAgICAgICAgICAgICAgIGksIGosIGN1cjtcclxuICAgICAgICAgICAgZm9yIChpID0gMCwgaiA9IG9yaWdfbmV3Lmxlbmd0aDsgaSA8IGo7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY3VyID0gb3JpZ19uZXdbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoIShjdXIudGl0bGUgaW4gbmFtZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZXNbY3VyLnRpdGxlXSA9IHt0aXRsZTogY3VyLnRpdGxlLCBtZXRob2Q6IFtdfTtcclxuICAgICAgICAgICAgICAgICAgICBuZXdBcnIucHVzaChuYW1lc1tjdXIudGl0bGVdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGkgPCA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9hZGQgY2hpbGQgYXR0cmlidXRlIHRvIG1ldGhvZCB3aGljaCBpcyBjaGlsZC5cclxuICAgICAgICAgICAgICAgICAgICBuYW1lc1tjdXIudGl0bGVdLm1ldGhvZFswXS5jaGlsZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VyLmNoaWxkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjdXIucHJpY2UgPSBwYXJzZUludChjdXIucHJpY2UpO1xyXG4gICAgICAgICAgICAgICAgbmFtZXNbY3VyLnRpdGxlXS5tZXRob2QucHVzaChjdXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdBcnI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRfc2hpcHBpbmdfbWV0aG9kKCkge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuZ2V0S2V5VGltZSgpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAobWQ1a2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGh0dHAuZ2V0KFwiaHR0cDovL3Nob3AxMGsudm4vd2ViX2FwaS5waHA/cj1zaGlwcGluZ1wiICsgXCIma2V5PVwiICsgbWQ1a2V5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0RhdGEgPSB0cmFuc2Zvcm1BcnIocmVzcC5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUobmV3RGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0VSUiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKVxyXG5cclxuICAgICAgICAgICAgcHJvbWlzZS5zdWNjZXNzID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oZm4pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvbWlzZS5lcnJvciA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKG51bGwsIGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldF9wYXltZW50X21ldGhvZCgpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmdldEtleVRpbWUoKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKG1kNWtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRodHRwLmdldChcImh0dHA6Ly9zaG9wMTBrLnZuL3dlYl9hcGkucGhwP3I9cGF5bWVudFwiICsgXCIma2V5PVwiICsgbWQ1a2V5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0RhdGEgPSByZXNwLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJyID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2gobmV3RGF0YSwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ICE9PSBcInBheXBhbF9iaWxsaW5nX2FncmVlbWVudFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnIucHVzaCh7XCJ0eXBlXCI6IGtleSwgXCJuYW1lXCI6IHZhbHVlfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoYXJyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgnRVJSICcgKyBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApXHJcblxyXG4gICAgICAgICAgICBwcm9taXNlLnN1Y2Nlc3MgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihmbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcm9taXNlLmVycm9yID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4obnVsbCwgZm4pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdXBkYXRlQ2hlY2tvdXRJbmZvOiBmdW5jdGlvbiAoaW5mbykge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBpbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja291dEluZm9baV0gPSBpbmZvW2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgdXBkYXRlQ2hlY2tvdXRJbmZvVXNlcjogZnVuY3Rpb24oaW5mbyl7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGluZm8pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrb3V0SW5mb1tcInVzZXJcIl1baV0gPSBpbmZvW2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jaGVja291dEluZm8pO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc3VtVG90YWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tvdXRJbmZvLnRvdGFsID0gQ2FydFNlcnZpY2Uuc3VtQ2FydCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tvdXRJbmZvLnRvdGFsVGV4dCA9IENhcnRTZXJ2aWNlLmNvbnZlcnRNb25leSgwLCBcIixcIiwgXCIuXCIsIHRoaXMuY2hlY2tvdXRJbmZvLnRvdGFsKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrb3V0SW5mby5tZXRob2RTaGlwLnByaWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja291dEluZm8uZ3JhbmRUb3RhbCA9IENhcnRTZXJ2aWNlLmNvbnZlcnRNb25leSgwLCBcIixcIiwgXCIuXCIsICh0aGlzLmNoZWNrb3V0SW5mby50b3RhbCArIHRoaXMuY2hlY2tvdXRJbmZvLm1ldGhvZFNoaXAucHJpY2UpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tvdXRJbmZvLmdyYW5kVG90YWwgPSBDYXJ0U2VydmljZS5jb252ZXJ0TW9uZXkoMCwgXCIsXCIsIFwiLlwiLCB0aGlzLmNoZWNrb3V0SW5mby50b3RhbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRTaGlwcGluZzogZnVuY3Rpb24gKG1ldGhvZFNoaXApIHtcclxuICAgICAgICAgICAgICAgIGlmIChtZXRob2RTaGlwLmNoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kU2hpcC5zaGlwQWRkcmVzcyA9IG1ldGhvZFNoaXAudGl0bGUgKyBcIiAtIFwiICsgbWV0aG9kU2hpcC5uYW1lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja291dEluZm8ubWV0aG9kU2hpcCA9IG1ldGhvZFNoaXA7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja291dEluZm8ubWV0aG9kU2hpcFRleHQgPSBDYXJ0U2VydmljZS5jb252ZXJ0TW9uZXkoMCwgXCIsXCIsIFwiLlwiLCB0aGlzLmNoZWNrb3V0SW5mby5tZXRob2RTaGlwLnByaWNlKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrb3V0SW5mby5tZXRob2RTaGlwLnByaWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja291dEluZm8uZ3JhbmRUb3RhbCA9IENhcnRTZXJ2aWNlLmNvbnZlcnRNb25leSgwLCBcIixcIiwgXCIuXCIsICh0aGlzLmNoZWNrb3V0SW5mby50b3RhbCArIHRoaXMuY2hlY2tvdXRJbmZvLm1ldGhvZFNoaXAucHJpY2UpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tvdXRJbmZvLmdyYW5kVG90YWwgPSBDYXJ0U2VydmljZS5jb252ZXJ0TW9uZXkoMCwgXCIsXCIsIFwiLlwiLCB0aGlzLmNoZWNrb3V0SW5mby50b3RhbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXRPcmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICAgICAgICAgIHZhciBjYXJ0ID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FydC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjYXJ0W2ldLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjYXJ0W2ldLmhyZWY7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNhcnRbaV0ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgY2FydFtpXS5wcmljZTtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgY2FydFtpXS5wcmljZV9udW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNhcnRbaV0udGh1bWI7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNhcnRbaV0uYWRkZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNhcnRbaV1bXCIkaW5kZXhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNhcnRbaV1bXCIkJGhhc2hLZXlcIl07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgTG9naW5TZXJ2aWNlLnNwbGl0VXNlcm5hbWUodGhpcy5jaGVja291dEluZm8udXNlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGFwaV91cmwgPSBcImh0dHA6Ly9zaG9wMTBrLnZuL3dlYl9hcGkucGhwP3I9Z3Vlc3RcIjtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZW1haWwgPSB0aGlzLmNoZWNrb3V0SW5mby51c2VyLmVtYWlsO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1c19hZGRyZXNzID0gdGhpcy5jaGVja291dEluZm8udXNlci5hZGRyZXNzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNpdHkgPSBcIiBUUCBcIiArIHRoaXMuY2hlY2tvdXRJbmZvLnVzZXIuY2l0eTtcclxuICAgICAgICAgICAgICAgIHZhciBkaXN0cmljdCA9IFwiIHF14bqtbiBcIiArIHRoaXMuY2hlY2tvdXRJbmZvLnVzZXIuZGlzdHJpY3Q7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja291dEluZm8ubWV0aG9kU2hpcC50eXBlID09PSAnZnJlZXNoaXBwaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1c19hZGRyZXNzID0gXCJU4buxIGzhuqV5IGjDoG5nIHThuqFpIGPhu61hIGjDoG5nIDE2NCB0cuG6p24gYsOsbmggdHLhu41uZ1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIGNpdHkgPSBcIlRQIEhDTVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0ID0gXCJxdeG6rW4gNVwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChVc2VyU2VydmljZS5pc0xvZ2luKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcGlfdXJsID0gXCJodHRwOi8vc2hvcDEway52bi93ZWJfYXBpLnBocD9yPXVzZXImY2hlY2s9XCIgKyB0aGlzLmNoZWNrb3V0SW5mby51c2VyLmVtYWlsICsgXCImcGFzc3dvcmQ9XCIgKyB0aGlzLmNoZWNrb3V0SW5mby51c2VyLnBhc3N3b3JkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJGh0dHAuZ2V0KGFwaV91cmwgKyBcIiZvcmRlcj10cnVlJnByb2R1Y3RzPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNhcnQpKSArIFwiJnBheW1lbnQ9XCIgKyB0aGlzLmNoZWNrb3V0SW5mby5tZXRob2RQYXltZW50LnR5cGUgKyBcIiZzaGlwcGluZz1cIiArIHRoaXMuY2hlY2tvdXRJbmZvLm1ldGhvZFNoaXAudHlwZSArIFwiJmxhc3RuYW1lPVwiICsgdGhpcy5jaGVja291dEluZm8udXNlci5sYXN0bmFtZSArIFwiJmZpcnN0bmFtZT1cIiArIHRoaXMuY2hlY2tvdXRJbmZvLnVzZXIuZmlyc3RuYW1lICsgXCImcG9zdGNvZGU9NzAwMDAmY2l0eT1cIiArIGNpdHkgKyBcIiZkaXN0cmljdD1cIiArIGRpc3RyaWN0ICsgXCImc3RyZWV0PVwiICsgY3VzX2FkZHJlc3MgKyBcIiZ0ZWxlcGhvbmU9XCIgKyB0aGlzLmNoZWNrb3V0SW5mby51c2VyLnBob25lICsgXCImZW1haWw9XCIgKyBlbWFpbCArIFwiXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwLmRhdGEuZXJyb3IgJiYgIXJlc3AuZGF0YS5ub3RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3AuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QocmVzcC5kYXRhLmVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdFUlIgJyArIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnN1Y2Nlc3MgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oZm4pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5lcnJvciA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihudWxsLCBmbik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICByZXNldENoZWNrb3V0SW5mbzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja291dEluZm8udG90YWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja291dEluZm8uZ3JhbmRUb3RhbCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrb3V0SW5mby5tZXRob2RTaGlwVGV4dCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrb3V0SW5mby5tZXRob2RTaGlwID0ge307XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrb3V0SW5mby5tZXRob2RQYXltZW50ID0ge307XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICByZXNldENoZWNrb3V0SW5mb0xvZ2luTm91dDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRDaGVja291dEluZm8oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tvdXRJbmZvLnVzZXIgPSB7fTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGNoZWNrb3V0SW5mbzogY2hlY2tvdXRfaW5mbyxcclxuXHJcbiAgICAgICAgICAgIHNoaXBwaW5nSW5mbzogZ2V0X3NoaXBwaW5nX21ldGhvZCxcclxuXHJcbiAgICAgICAgICAgIHBheW1lbnRJbmZvOiBnZXRfcGF5bWVudF9tZXRob2RcclxuICAgICAgICB9XHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcbnJlcXVpcmUoJy4vaG9tZV9jb250cm9sbGVyJyk7XHJcbnJlcXVpcmUoJy4uLy4vdXNlci91c2VyJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2hvbWUnLCBbJ2FwcC5zZXJ2aWNlJywgJ3VzZXInLCBcImhvbWUuY29udHJvbGxlclwiXSk7XHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiaG9tZS5jb250cm9sbGVyXCIsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJIb21lQ29udHJvbGxlclwiLCBbJyRzY29wZScsICdMb2dpblNlcnZpY2UnLCckbG9jYWxzdG9yYWdlJywnJHN0YXRlJywnQ29udHJvbE1vZGFsU2VydmljZScsJyR0aW1lb3V0JywnVXNlclNlcnZpY2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIExvZ2luU2VydmljZSwgJGxvY2Fsc3RvcmFnZSwgJHN0YXRlLCBDb250cm9sTW9kYWxTZXJ2aWNlLCAkdGltZW91dCwgVXNlclNlcnZpY2UpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjdXJyZW50X3VzZXJcIik7XHJcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBpZighVXNlclNlcnZpY2UuaXNMb2dpbigpKXtcclxuICAgICAgICAgICAgICAgICAgICBDb250cm9sTW9kYWxTZXJ2aWNlLnNob3coJ2pzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luLmh0bWwnLCAnUmVnaXN0ZXJMb2dpbkNvbnRyb2xsZXInLCAxKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5wcm9kdWN0cycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCAyMDAwKTtcclxuXHJcblxyXG4gICAgICAgICAgICAkc2NvcGUubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gZG8geW91ciAkKCkgc3R1ZmYgaGVyZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1dKTsiLCJcInVzZSBzdHJpY3RcIlxyXG5yZXF1aXJlKFwiLi9tZW51X2NvbnRyb2xsZXJcIik7XHJcbnJlcXVpcmUoJy4uLy4vdXNlci91c2VyJyk7XHJcbnJlcXVpcmUoXCIuLi8uL3Byb2R1Y3RzL3Byb2R1Y3RzXCIpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwibWVudVwiLCBbJ2FwcC5zZXJ2aWNlJywgJ3VzZXInLCBcInByb2R1Y3RzXCIsIFwibWVudS5jb250cm9sbGVyXCJdKVxyXG4gICAgLmNvbmZpZyhmdW5jdGlvbiAoJGlvbmljQ29uZmlnUHJvdmlkZXIpIHtcclxuICAgICAgICAkaW9uaWNDb25maWdQcm92aWRlci5iYWNrQnV0dG9uLnByZXZpb3VzVGl0bGVUZXh0KGZhbHNlKS50ZXh0KCcnKTtcclxuICAgIH0pOyIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwibWVudS5jb250cm9sbGVyXCIsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJNZW51Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckaW9uaWNTaWRlTWVudURlbGVnYXRlJywgJ1Byb2R1Y3RTZXJ2aWNlJywgJyRzdGF0ZScsICdDb250cm9sTW9kYWxTZXJ2aWNlJywgJyRsb2NhbHN0b3JhZ2UnLCAnVXNlclNlcnZpY2UnLCckaW9uaWNTY3JvbGxEZWxlZ2F0ZScsJyRpb25pY0hpc3RvcnknLCckaW9uaWNMb2FkaW5nJywnJGlvbmljUG9wdXAnLCdDaGVja291dFNlcnZpY2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsIFByb2R1Y3RTZXJ2aWNlLCAkc3RhdGUsIENvbnRyb2xNb2RhbFNlcnZpY2UsICRsb2NhbHN0b3JhZ2UsIFVzZXJTZXJ2aWNlLCAkaW9uaWNTY3JvbGxEZWxlZ2F0ZSwgJGlvbmljSGlzdG9yeSwgJGlvbmljTG9hZGluZywgJGlvbmljUG9wdXAsIENoZWNrb3V0U2VydmljZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUud2lzaGxpc3ROdW1iZXIgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcIndpc2hsaXN0XCIpLmxlbmd0aDtcclxuICAgICAgICAgICAgJHNjb3BlLmNhcnROdW1iZXIgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIikubGVuZ3RoO1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlciA9IFVzZXJTZXJ2aWNlLmN1cnJlbnRVc2VyO1xyXG4gICAgICAgICAgICBVc2VyU2VydmljZS5pc0xvZ2luKCk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdVc2VyTG9naW4nLCBmdW5jdGlvbiAoZXZlbnQsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS51c2VyID0gVXNlclNlcnZpY2UuY3VycmVudFVzZXI7XHJcbiAgICAgICAgICAgICAgICBDaGVja291dFNlcnZpY2UucmVzZXRDaGVja291dEluZm9Mb2dpbk5vdXQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRzY29wZS4kb24oJ1VzZXJMb2dvdXQnLCBmdW5jdGlvbiAoZXZlbnQsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS51c2VyID0gVXNlclNlcnZpY2UuY3VycmVudFVzZXI7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFyQ2FjaGUoKTtcclxuICAgICAgICAgICAgICAgICRpb25pY0hpc3RvcnkuY2xlYXJIaXN0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICBDaGVja291dFNlcnZpY2UucmVzZXRDaGVja291dEluZm9Mb2dpbk5vdXQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9TdGF0ZS5uYW1lID09IFwibWVudS5wcm9kdWN0c1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNob3dQcm9kdWN0QmFja0J0biA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNob3dQcm9kdWN0QmFja0J0biA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignV2lzaGxpc3RVcGRhdGUnLCBmdW5jdGlvbiAoZXZlbnQsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS53aXNobGlzdE51bWJlciA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIikubGVuZ3RoO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kb24oJ0NhcnRVcGRhdGUnLCBmdW5jdGlvbiAoZXZlbnQsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jYXJ0TnVtYmVyID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpLmxlbmd0aDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZmlsdGVyVHlwZSA9IFtcclxuICAgICAgICAgICAgICAgIHt0eXBlOiBcImFsbFwiLCBuYW1lOiAnU+G6o24gcGjhuqltIG3hu5tpJ30sXHJcbiAgICAgICAgICAgICAgICB7dHlwZTogXCJwcm9tb1wiLCBuYW1lOiAnU+G6o24gcGjhuqltIGtodXnhur9uIG3Do2knfSxcclxuICAgICAgICAgICAgICAgIHt0eXBlOiBcInByaWNlNTBrXCIgLCBuYW1lOiAnRHVvaSA1MC4wMDAnfSxcclxuICAgICAgICAgICAgICAgIHt0eXBlOiBcInByaWNlMTAwa1wiICwgbmFtZTogJzUwLjAwMCBkZW4gMTAwLjAwMCd9LFxyXG4gICAgICAgICAgICAgICAge3R5cGU6IFwicHJpY2UyMDBrXCIgLCBuYW1lOiAnMTAwLjAwMCBkZW4gMjAwLjAwMCd9LFxyXG4gICAgICAgICAgICAgICAge3R5cGU6IFwicHJpY2UyMDB1cFwiICwgbmFtZTogJ1RyZW4gMjAwLjAwMCd9XHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUub3Blbk1lbnUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLnRvZ2dsZUxlZnQoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kb24oJ0Nsb3NlT3JkZXInLCBmdW5jdGlvbiAoZXZlbnQsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS50eXBlID0gUHJvZHVjdFNlcnZpY2UuZ2V0VHlwZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5nZXRQcm9kdWN0cyA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJtZW51LnByb2R1Y3RzXCIpO1xyXG4gICAgICAgICAgICAgICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5zZXRUeXBlKHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2Uuc2V0UGFnZSgxKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLnVwZGF0ZUxvYWRtb3JlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuZmlsdGVyUHJvZHVjdCgpLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3NcIilcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0zhu5dpJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdC4bqhbiB2dWkgbMOybmcgdGjhu60gY2jhu41uIGzhuqFpIHPhuqNuIHBo4bqpbSdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY29udGFjdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIENvbnRyb2xNb2RhbFNlcnZpY2Uuc2hvdygnanMvbW9kdWxlcy9jb250YWN0L2NvbnRhY3QuaHRtbCcsICdDb250YWN0Q29udHJvbGxlcicsIDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2hvd19jYXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwibWVudS5jYXJ0XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXNlcl9pbmZvID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwibWVudS51c2VyXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudG9fbG9naW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBDb250cm9sTW9kYWxTZXJ2aWNlLnNob3coJ2pzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luLmh0bWwnLCAnUmVnaXN0ZXJMb2dpbkNvbnRyb2xsZXInLCAxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNpZ25vdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBVc2VyU2VydmljZS5zaWduT3V0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5nZXRQcm9kdWN0cyhcImFsbFwiKTtcclxuICAgICAgICB9XHJcbiAgICBdKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwcm9kdWN0LmNvbnRyb2xsZXJcIiwgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdzcGlubmVyT25Mb2FkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmxvYWRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5iaW5kKCdsb2FkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG4gICAgLmNvbnRyb2xsZXIoXCJQcm9kdWN0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICdQcm9kdWN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCAnV2lzaGxpc3RTZXJ2aWNlJywgJyRodHRwJywgJ0NvbnRyb2xNb2RhbFNlcnZpY2UnLCAnJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZScsICdDYXJ0U2VydmljZScsICckbG9jYWxzdG9yYWdlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBQcm9kdWN0U2VydmljZSwgJHN0YXRlUGFyYW1zLCBXaXNobGlzdFNlcnZpY2UsICRodHRwLCBDb250cm9sTW9kYWxTZXJ2aWNlLCAkaW9uaWNTbGlkZUJveERlbGVnYXRlLCBDYXJ0U2VydmljZSwgJGxvY2Fsc3RvcmFnZSkge1xyXG4gICAgICAgICAgICB2YXIgbGlua19hamF4ID0gXCJodHRwOi8vc2hvcDEway52bi9hcGkvcmVzdC9wcm9kdWN0c1wiO1xyXG4gICAgICAgICAgICB2YXIgbGlua19hamF4X25ldyA9IFwiaHR0cDovL3Nob3AxMGsudm4vd2ViX2FwaS5waHBcIjtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5wcm9kdWN0ID0ge307XHJcbiAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuZ2V0S2V5VGltZSgpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAobWQ1a2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGh0dHAuZ2V0KGxpbmtfYWpheF9uZXcgKyBcIj9yPXByb2R1Y3QmaWQ9XCIgKyAkc3RhdGVQYXJhbXMuaWQgKyBcIiZrZXk9XCIgKyBtZDVrZXkpLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKHJlc3AuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UudXBkYXRlQXJyYXkodGVtcCwgJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpLCBcImFkZGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnVwZGF0ZUFycmF5KHRlbXAsICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIiksIFwibGlrZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9kdWN0LmRldGFpbCA9IHRlbXA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9kdWN0LmRldGFpbFtcInRodW1iXCJdID0gJHNjb3BlLnByb2R1Y3QuZGV0YWlsLmltYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkaHR0cC5nZXQobGlua19hamF4ICsgXCIvXCIgKyAkc3RhdGVQYXJhbXMuaWQgKyBcIi9pbWFnZXNcIiArIFwiP2tleT1cIiArIG1kNWtleSkudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJvZHVjdC5pbWFnZXMgPSByZXNwLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVTbGlkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJGh0dHAuZ2V0KGxpbmtfYWpheCArIFwiL1wiICsgJHN0YXRlUGFyYW1zLmlkICsgXCIvY2F0ZWdvcmllc1wiICsgXCI/a2V5PVwiICsgbWQ1a2V5KS50aGVuKGZ1bmN0aW9uIChjYXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3QuY2F0ZWdvcnkgPSBjYXQuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGh0dHAuZ2V0KGxpbmtfYWpheCArIFwiP2NhdGVnb3J5X2lkPVwiICsgJHNjb3BlLnByb2R1Y3QuY2F0ZWdvcnlbMF0uY2F0ZWdvcnlfaWQgKyBcIiZrZXk9XCIgKyBtZDVrZXkpLnRoZW4oZnVuY3Rpb24gKHJlbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHJlbGF0ZS5kYXRhWyRzY29wZS5wcm9kdWN0LmRldGFpbFswXS5lbnRpdHlfaWRdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3QucmVsYXRlZCA9IHJlbGF0ZS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZVNsaWRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRpb25pY1NsaWRlQm94RGVsZWdhdGUudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hZGRUb1dpc2hsaXN0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIFdpc2hsaXN0U2VydmljZS5hZGRXaXNobGlzdChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFkZF90b19jYXJ0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIENhcnRTZXJ2aWNlLmFkZENhcnQoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jaG9vc2VQcm9kdWN0T3B0aW9uID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIENvbnRyb2xNb2RhbFNlcnZpY2Uuc2hvdygnanMvbW9kdWxlcy9jYXJ0L2NhcnQuaHRtbCcsICdDYXJ0Q29udHJvbGxlcicsIDEsIGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2xpY2tDb25maWcgPSB7XHJcbiAgICAgICAgICAgICAgICBhdXRvcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYXV0b3BsYXlTcGVlZDogMTAwMCxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMyxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAzLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiB7fVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1dKTtcclxuXHJcbiIsIlwidXNlIHN0cmljdFwiXHJcbnJlcXVpcmUoXCIuL3Byb2R1Y3RzX2ZhY3RvcnkuanNcIik7XHJcbnJlcXVpcmUoXCIuL3Byb2R1Y3RzX2NvbnRyb2xsZXIuanNcIik7XHJcbnJlcXVpcmUoXCIuL3Byb2R1Y3RfY29udHJvbGxlci5qc1wiKTtcclxucmVxdWlyZSgnLi4vLi93aXNobGlzdC93aXNobGlzdF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4vY2FydC9jYXJ0X3NlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcInByb2R1Y3RzXCIsIFsnYXBwLnNlcnZpY2UnLCAnd2lzaGxpc3Quc2VydmljZScsICdjYXJ0LnNlcnZpY2VzJywgXCJwcm9kdWN0cy5mYWN0b3J5XCIsIFwicHJvZHVjdHMuY29udHJvbGxlclwiLCBcInByb2R1Y3QuY29udHJvbGxlclwiXSlcclxuICAgIC5jb25maWcoZnVuY3Rpb24gKCRpb25pY0NvbmZpZ1Byb3ZpZGVyKSB7XHJcbiAgICAgICAgJGlvbmljQ29uZmlnUHJvdmlkZXIuYmFja0J1dHRvbi5wcmV2aW91c1RpdGxlVGV4dChmYWxzZSkudGV4dCgnJyk7XHJcbiAgICB9KTsiLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcInByb2R1Y3RzLmNvbnRyb2xsZXJcIiwgW10pXHJcbiAgICAuY29udHJvbGxlcihcIlByb2R1Y3RzQ29udHJvbGxlclwiLCBbJyRzY29wZScsICckaW9uaWNTaWRlTWVudURlbGVnYXRlJywgJ1Byb2R1Y3RTZXJ2aWNlJywgJ0NvbnRyb2xNb2RhbFNlcnZpY2UnLCAnV2lzaGxpc3RTZXJ2aWNlJywgJ0NhcnRTZXJ2aWNlJywgJ0NoZWNrb3V0U2VydmljZScsJ1VzZXJTZXJ2aWNlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCBQcm9kdWN0U2VydmljZSwgQ29udHJvbE1vZGFsU2VydmljZSwgV2lzaGxpc3RTZXJ2aWNlLCBDYXJ0U2VydmljZSwgQ2hlY2tvdXRTZXJ2aWNlLCBVc2VyU2VydmljZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUuY2FydE51bWJlciA9IENhcnRTZXJ2aWNlLmdldENhcnROdW1iZXIoKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kb24oJ1VzZXJMb2dvdXQnLCBmdW5jdGlvbiAoZXZlbnQsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIENoZWNrb3V0U2VydmljZS5yZXNldENoZWNrb3V0SW5mbygpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5wcm9kdWN0cyA9IFByb2R1Y3RTZXJ2aWNlLnByb2R1Y3RDdXJyZW50O1xyXG4gICAgICAgICAgICBDYXJ0U2VydmljZS5zZXRDYXJ0TnVtYmVyKCk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudG90YWwgPSBDYXJ0U2VydmljZS5jb252ZXJ0TW9uZXkoMCwgXCIsXCIsIFwiLlwiLCBDYXJ0U2VydmljZS5zdW1DYXJ0KCkpO1xyXG4gICAgICAgICAgICAkc2NvcGUubG9hZE1vcmUgPSBQcm9kdWN0U2VydmljZS5sb2FkTW9yZTtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBVc2VyU2VydmljZS5jdXJyZW50VXNlcjtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5vcGVuTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUudG9nZ2xlTGVmdCgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmxvYWRNb3JlRGF0YSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmKCRzY29wZS5sb2FkTW9yZVswXSl7XHJcbi8vICAgICAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5pbml0KDkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IFByb2R1Y3RTZXJ2aWNlLmdldFBhZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wID09IDEpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5zZXRQYWdlKDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5maWx0ZXJQcm9kdWN0KCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdCgnc2Nyb2xsLmluZmluaXRlU2Nyb2xsQ29tcGxldGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2Uuc2V0UGFnZSgrK2RhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS51cGRhdGVMb2FkbW9yZShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkX3RvX2NhcnQgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgQ2FydFNlcnZpY2UuYWRkQ2FydChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFkZFRvV2lzaGxpc3QgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgV2lzaGxpc3RTZXJ2aWNlLmFkZFdpc2hsaXN0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdDYXJ0VXBkYXRlJywgZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2FydE51bWJlciA9IENhcnRTZXJ2aWNlLmdldENhcnROdW1iZXIoKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS50b3RhbCA9IENhcnRTZXJ2aWNlLmNvbnZlcnRNb25leSgwLCBcIixcIiwgXCIuXCIsIENhcnRTZXJ2aWNlLnN1bUNhcnQoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignJGlvbmljVmlldy5lbnRlcicsIGZ1bmN0aW9uICh2aWV3SW5mbywgc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jYXJ0TnVtYmVyID0gQ2FydFNlcnZpY2UuZ2V0Q2FydE51bWJlcigpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gQ2FydFNlcnZpY2UuY29udmVydE1vbmV5KDAsIFwiLFwiLCBcIi5cIiwgQ2FydFNlcnZpY2Uuc3VtQ2FydCgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgXSk7XHJcbiIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwicHJvZHVjdHMuZmFjdG9yeVwiLCBbXSlcclxuICAgIC5mYWN0b3J5KCdQcm9kdWN0U2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGh0dHAsICRsb2NhbHN0b3JhZ2UsICRpb25pY0xvYWRpbmcsICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgcHJvZHVjdHMgPSBbXTtcclxuICAgICAgICB2YXIgZmlsdGVyID0ge1xyXG4gICAgICAgICAgICBsaW1pdDogMjAsXHJcbiAgICAgICAgICAgIHR5cGU6ICcnXHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgaXNMb2FkTW9yZSA9IFtdO1xyXG4gICAgICAgIHZhciBjdXJyZW50X2luZGV4ID0gMDtcclxuICAgICAgICB2YXIgY3VycmVudF9wb3NpdGlvbiA9IDA7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZF9wcm9kdWN0KGRhdGEpIHtcclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gJC5tYXAoZGF0YSwgZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFt2YWx1ZV07XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGFycmF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0c1tjdXJyZW50X2luZGV4XSA9IGFycmF5W2ldO1xyXG4vLyAgICAgICAgICAgICAgcHJvZHVjdHMucHVzaChhcnJheVtpXSk7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50X2luZGV4Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybntcclxuICAgICAgICAgICAgc2V0Q3VycmVudFBvczogZnVuY3Rpb24ocG9zKXtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRfcG9zaXRpb24gPSBwb3M7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldEN1cnJlbnRQb3M6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudF9wb3NpdGlvbjtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZmlsdGVyUHJvZHVjdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBmaWx0ZXIubGltaXQgPSAyMDtcclxuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXIucGFnZSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhclByb2R1Y3RzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5zaG93KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdMb2FkaW5nLi4uJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlci5saW1pdCA9IDIwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuZ2V0S2V5VGltZSgpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKG1kNWtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGlua19hamF4ID0gXCJodHRwOi8vc2hvcDEway52bi9hcGkvcmVzdC9wcm9kdWN0c1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkaHR0cC5nZXQoXCJodHRwOi8vc2hvcDEway52bi93ZWJfYXBpLnBocD9yPVwiICsgZmlsdGVyLnR5cGUgKyBcIiZsaW1pdD1cIiArIGZpbHRlci5saW1pdCArIFwiJnBhZ2U9XCIgKyBmaWx0ZXIucGFnZSArIFwiJmtleT1cIiArIG1kNWtleSkudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwLmRhdGEuRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRfcHJvZHVjdChyZXNwLmRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS51cGRhdGVBcnJheShwcm9kdWN0cywgJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpLCBcImFkZGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UudXBkYXRlQXJyYXkocHJvZHVjdHMsICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIiksIFwibGlrZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShmaWx0ZXIucGFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZmlsdGVyLnBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlcnIuc3RhdHVzIHdpbGwgY29udGFpbiB0aGUgc3RhdHVzIGNvZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0VSUicsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0VSUiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KFwid3Jvbmcga2V5XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIClcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXRQYWdlOiBmdW5jdGlvbiAobnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXIucGFnZSA9IG51bWJlcjtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldFR5cGU6IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXIudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRUeXBlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnR5cGU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRQYWdlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnBhZ2U7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRJbmRleDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRfaW5kZXg7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRBdHRyaWJ1dGU6IGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBwcm9kdWN0cykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9kdWN0c1tpXS5lbnRpdHlfaWQgPT0gaXRlbS5lbnRpdHlfaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHNbaV1baW5kZXhdID0gaXRlbVtpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgdXBkYXRlTG9hZG1vcmU6IGZ1bmN0aW9uIChsb2FkKSB7XHJcbiAgICAgICAgICAgICAgICBpc0xvYWRNb3JlWzBdID0gbG9hZDtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGNsZWFyUHJvZHVjdHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50X2luZGV4ID0gMDtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uIChudW1iZXIpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtYmVyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsb2FkaW5nXCI6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGZpbHRlcjogZmlsdGVyLFxyXG5cclxuICAgICAgICAgICAgbG9hZE1vcmU6IGlzTG9hZE1vcmUsXHJcblxyXG4gICAgICAgICAgICBwcm9kdWN0Q3VycmVudDogcHJvZHVjdHNcclxuICAgICAgICB9XHJcbiAgICB9XHJcbilcclxuOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vdXNlcl9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4vdXNlcl9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoXCIuLi8uL3Byb2R1Y3RzL3Byb2R1Y3RzXCIpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwidXNlclwiLCBbJ2FwcC5zZXJ2aWNlJywgXCJwcm9kdWN0c1wiLCAndXNlci5zZXJ2aWNlJywgJ3VzZXIuY29udHJvbGxlciddKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCd1c2VyLmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiVXNlckNvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCdVc2VyU2VydmljZScsJyRpb25pY1BvcHVwJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBVc2VyU2VydmljZSwgJGlvbmljUG9wdXApIHtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBVc2VyU2VydmljZS5jdXJyZW50VXNlcjtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVVc2VyID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIFVzZXJTZXJ2aWNlLnVwZGF0ZVVzZXIoJHNjb3BlLnVzZXIpLnN1Y2Nlc3MoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdD4bqtcCBuaOG6rXQgdGjDoG5oIGPDtG5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdUaMO0bmcgdGluIGPhu6dhIGLhuqFuIMSRw6MgxJHGsOG7o2MgdGhheSDEkeG7lWknXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgndXNlci5zZXJ2aWNlJywgW10pXHJcbiAgICAuc2VydmljZSgnVXNlclNlcnZpY2UnLCBmdW5jdGlvbiAoJHEsICRsb2NhbHN0b3JhZ2UsIFByb2R1Y3RTZXJ2aWNlLCAkcm9vdFNjb3BlLCAkaW9uaWNIaXN0b3J5LCAkc3RhdGUsICRpb25pY0xvYWRpbmcsICRpb25pY1BvcHVwLCAkaHR0cCwgTG9naW5TZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRfdXNlciA9IHtcclxuICAgICAgICAgICAgcG9ydHJhaXQ6IFwiaW1nL3BvcnRyYWl0LmpwZ1wiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY3VycmVudFVzZXI6IGN1cnJlbnRfdXNlcixcclxuXHJcbiAgICAgICAgICAgIGlzTG9naW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciB1c2VyID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJ1c2VyXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHVzZXIubG9naW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHVzZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VXNlcltpXSA9IHVzZXJbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICB1cGRhdGVVc2VyOiBmdW5jdGlvbiAoaW5mbykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlbXAgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGluZm8pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRVc2VyW2ldID0gaW5mb1tpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBMb2dpblNlcnZpY2Uuc3BsaXRVc2VybmFtZSh0aGlzLmN1cnJlbnRVc2VyKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgYXBpX3VybCA9IFwiaHR0cDovL3Nob3AxMGsudm4vd2ViX2FwaS5waHA/cj11c2VyXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgJGh0dHAuZ2V0KGFwaV91cmwgKyBcIiZ1cGRhdGVpbmZvPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHRoaXMuY3VycmVudFVzZXIpKSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcC5kYXRhLmNoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcC5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0T2JqZWN0KFwidXNlclwiLCB0ZW1wLmN1cnJlbnRVc2VyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyZXNwLmRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0VSUiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc3VjY2VzcyA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihmbik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLmVycm9yID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKG51bGwsIGZuKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldFVzZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRVc2VyO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2lnbk91dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICAgICAgICAgIHZhciBhcGlfdXJsID0gXCJodHRwOi8vc2hvcDEway52bi93ZWJfYXBpLnBocD9yPWxvZ291dFwiO1xyXG4gICAgICAgICAgICAgICAgJGh0dHAuZ2V0KGFwaV91cmwpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3AuZGF0YS5sb2dvdXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcC5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyZXNwLmRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0VSUiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRVc2VyID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvZ2luOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBwb3J0cmFpdDogXCJpbWcvcG9ydHJhaXQuanBnXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9nb3V0Q2hlY2tvdXQ6IFwibG9nb3V0ZWRcIlxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5jbGVhckNhY2hlKCk7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFySGlzdG9yeSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbChcInVzZXJcIik7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE51bGwoXCJjYXJ0XCIpO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsKFwid2lzaGxpc3RcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2Uuc2V0UGFnZSgxKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmZpbHRlclByb2R1Y3QoKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3NcIilcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAkaW9uaWNQb3B1cC5hbGVydCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTOG7l2knLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ0LhuqFuIHZ1aSBsw7JuZyB0aOG7rSBjaOG7jW4gbOG6oWkgc+G6o24gcGjhuqltJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiQ2FydFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIldpc2hsaXN0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiVXNlckxvZ291dFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJtZW51LnByb2R1Y3RzXCIpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgbG9naW46IGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHVzZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRVc2VyW2ldID0gdXNlcltpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFVzZXIubG9naW4gPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0T2JqZWN0KFwidXNlclwiLCB0aGlzLmN1cnJlbnRVc2VyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE51bGwoXCJjYXJ0XCIpO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsKFwid2lzaGxpc3RcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2Uuc2V0UGFnZSgxKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmZpbHRlclByb2R1Y3QoKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3NcIilcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAkaW9uaWNQb3B1cC5hbGVydCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTOG7l2knLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ0LhuqFuIHZ1aSBsw7JuZyB0aOG7rSBjaOG7jW4gbOG6oWkgc+G6o24gcGjhuqltJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiQ2FydFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIldpc2hsaXN0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiVXNlckxvZ2luXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi93aXNobGlzdF9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4vd2lzaGxpc3Rfc2VydmljZS5qcycpO1xyXG5yZXF1aXJlKCcuLi8uL3Byb2R1Y3RzL3Byb2R1Y3RzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJ3aXNobGlzdFwiLCBbJ2FwcC5zZXJ2aWNlJywgJ3Byb2R1Y3RzJywgJ3dpc2hsaXN0LnNlcnZpY2UnLCAnd2lzaGxpc3QuY29udHJvbGxlciddKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCd3aXNobGlzdC5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIldpc2hsaXN0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckbG9jYWxzdG9yYWdlJywnV2lzaGxpc3RTZXJ2aWNlJywnJHN0YXRlJywnQ2FydFNlcnZpY2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhbHN0b3JhZ2UsIFdpc2hsaXN0U2VydmljZSwgJHN0YXRlLCBDYXJ0U2VydmljZSkge1xyXG4vLyAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbEFsbCgpO1xyXG4gICAgICAgICAgICAkc2NvcGUud2lzaGxpc3ROdW1iZXIgPSBXaXNobGlzdFNlcnZpY2Uud2lzaGxpc3ROdW1iZXI7XHJcbiAgICAgICAgICAgICRzY29wZS53aXNobGlzdCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIik7XHJcbiAgICAgICAgICAgICRzY29wZS5sZW5ndGhXaXNobGlzdCA9ICRzY29wZS53aXNobGlzdC5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUucmVtb3ZlRnJvbVdpc2hsaXN0ID0gZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgICBXaXNobGlzdFNlcnZpY2UucmVtb3ZlV2lzaGxpc3QoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUud2lzaGxpc3QgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcIndpc2hsaXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxlbmd0aFdpc2hsaXN0ID0gJHNjb3BlLndpc2hsaXN0Lmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFkZF90b19jYXJ0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIENhcnRTZXJ2aWNlLmFkZENhcnQoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnd2lzaGxpc3Quc2VydmljZScsIFtdKVxyXG4gICAgLnNlcnZpY2UoJ1dpc2hsaXN0U2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGxvY2Fsc3RvcmFnZSwgJHJvb3RTY29wZSwgUHJvZHVjdFNlcnZpY2UpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhZGRXaXNobGlzdCA6IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgaWYoIWl0ZW0ubGlrZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5saWtlID0gIWl0ZW0ubGlrZTtcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZE9iamVjdChcIndpc2hsaXN0XCIsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuYWRkQXR0cmlidXRlKFwiY2FydFwiLCBpdGVtLCBcImxpa2VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuYWRkQXR0cmlidXRlKGl0ZW0sIFwibGlrZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiV2lzaGxpc3RVcGRhdGVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlV2lzaGxpc3QoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICByZW1vdmVXaXNobGlzdCA6IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgaXRlbS5saWtlID0gIWl0ZW0ubGlrZTtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UucmVtb3ZlT2JqZWN0KFwid2lzaGxpc3RcIiwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZEF0dHJpYnV0ZShcImNhcnRcIiwgaXRlbSwgXCJsaWtlXCIpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuYWRkQXR0cmlidXRlKGl0ZW0sIFwibGlrZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJXaXNobGlzdFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9jb250YWN0X3NlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi9jb250YWN0X2NvbnRyb2xsZXIuanMnKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcImNvbnRhY3RcIiwgWydhcHAuc2VydmljZScsICdjb250YWN0LnNlcnZpY2VzJywgJ2NvbnRhY3QuY29udHJvbGxlciddKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjb250YWN0LmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiQ29udGFjdENvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAncGFyYW1ldGVycycsICckbG9jYWxzdG9yYWdlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBwYXJhbWV0ZXJzLCAkbG9jYWxzdG9yYWdlKSB7XHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3Quc2VydmljZXMnLCBbXSlcclxuICAgIC5zZXJ2aWNlKCdDb250YWN0U2VydmljZScsIGZ1bmN0aW9uICgkcSkge1xyXG5cclxuXHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdyZWdpc3RlckxvZ2luLnNlcnZpY2VzJywgW10pXHJcbiAgICAuc2VydmljZSgnTG9naW5TZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkaHR0cCwgJGxvY2Fsc3RvcmFnZSwgJGlvbmljSGlzdG9yeSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxvZ2luVXNlcjogbG9naW5Vc2VyLFxyXG4gICAgICAgICAgICByZWdpc3RlclVzZXI6IHJlZ2lzdGVyVXNlcixcclxuICAgICAgICAgICAgZ2V0SW5mbzogZ2V0SW5mbyxcclxuICAgICAgICAgICAgc3BsaXRVc2VybmFtZSA6IHNwbGl0VXNlcm5hbWVcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3BsaXRVc2VybmFtZSh1c2VyKXtcclxuICAgICAgICAgICAgdmFyIG5hbWVfb2JqID0gdXNlci5uYW1lLnNwbGl0KFwiIFwiKTtcclxuICAgICAgICAgICAgdXNlci5maXJzdG5hbWUgPSBuYW1lX29ialswXTtcclxuICAgICAgICAgICAgdXNlci5sYXN0bmFtZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIHZhciBsYXN0X25hbWVfYXJyID0gbmFtZV9vYmouc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdF9uYW1lX2Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdXNlci5sYXN0bmFtZSArPSBsYXN0X25hbWVfYXJyW2ldICsgXCIgXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldEluZm8ob2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5nZXRLZXlUaW1lKCkudGhlbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChtZDVrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAkaHR0cC5nZXQoXCJodHRwOi8vc2hvcDEway52bi93ZWJfYXBpLnBocD9yPXVzZXImY2hlY2s9XCIgKyBvYmouZW1haWwgKyBcIiZwYXNzd29yZD1cIiArIG9iai5wYXNzd29yZCArIFwiJmRldGFpbD10cnVlXCIgKyBcIiZrZXk9XCIgKyBtZDVrZXkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3AuZGF0YS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcC5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyZXNwLmRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0VSUiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KFwid3Jvbmcga2V5XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgcHJvbWlzZS5zdWNjZXNzID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oZm4pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvbWlzZS5lcnJvciA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKG51bGwsIGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlZ2lzdGVyVXNlcihvYmopIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zcGxpdFVzZXJuYW1lKG9iaik7XHJcblxyXG4gICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmdldEtleVRpbWUoKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKG1kNWtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRodHRwLmdldChcImh0dHA6Ly9zaG9wMTBrLnZuL3dlYl9hcGkucGhwP3I9dXNlciZyZWdpc3Rlcj10cnVlJmZpcnN0bmFtZT1cIiArIG9iai5maXJzdG5hbWUgKyBcIiZsYXN0bmFtZT1cIiArIG9iai5sYXN0bmFtZSArIFwiJnBhc3N3b3JkPVwiICsgb2JqLnBhc3N3b3JkICsgXCImZW1haWw9XCIgKyBvYmouZW1haWwgKyBcIiZrZXk9XCIgKyBtZDVrZXkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3AuZGF0YS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3AuZGF0YS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHJlc3AuZGF0YS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVyci5zdGF0dXMgd2lsbCBjb250YWluIHRoZSBzdGF0dXMgY29kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRVJSJywgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgnRVJSICcgKyBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoXCJ3cm9uZyBrZXlcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIClcclxuXHJcbiAgICAgICAgICAgIHByb21pc2Uuc3VjY2VzcyA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb21pc2UuZXJyb3IgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihudWxsLCBmbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dpblVzZXIob2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5nZXRLZXlUaW1lKCkudGhlbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChtZDVrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAkaHR0cC5nZXQoXCJodHRwOi8vc2hvcDEway52bi93ZWJfYXBpLnBocD9yPXVzZXImbG9naW49XCIgKyBvYmouZW1haWwgKyBcIiZwYXNzd29yZD1cIiArIG9iai5wYXNzd29yZCArIFwiJmtleT1cIiArIG1kNWtleSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpb25pY0hpc3RvcnkuY2xlYXJIaXN0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFyQ2FjaGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcmVzcC5kYXRhLkVYQ0VQVElPTl9JTlZBTElEX0VNQUlMX09SX1BBU1NXT1JEKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgnV2VsY29tZSAnICsgbmFtZSArICchJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QocmVzcC5kYXRhLmVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdFUlIgJyArIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChcIndyb25nIGtleVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICBwcm9taXNlLnN1Y2Nlc3MgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihmbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcm9taXNlLmVycm9yID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4obnVsbCwgZm4pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9sb2dpbl9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4vcmVnaXN0ZXJfbG9naW5fY29udHJvbGxlci5qcycpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2xheW91dC91c2VyL3VzZXInKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcInJlZ2lzdGVyTG9naW5cIiwgWydhcHAuc2VydmljZScsICd1c2VyJywgJ3JlZ2lzdGVyTG9naW4uc2VydmljZXMnLCAncmVnaXN0ZXJMb2dpbi5jb250cm9sbGVyJ10pO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ3JlZ2lzdGVyTG9naW4uY29udHJvbGxlcicsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJSZWdpc3RlckxvZ2luQ29udHJvbGxlclwiLCBbJyRzY29wZScsICdMb2dpblNlcnZpY2UnLCAnJHN0YXRlJywgJyRpb25pY1BvcHVwJywgJyRsb2NhbHN0b3JhZ2UnLCAnVXNlclNlcnZpY2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIExvZ2luU2VydmljZSwgJHN0YXRlLCAkaW9uaWNQb3B1cCwgJGxvY2Fsc3RvcmFnZSwgVXNlclNlcnZpY2UpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBVc2VyU2VydmljZS5jdXJyZW50X3VzZXI7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdtb2RhbC5oaWRkZW4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUucHJvZHVjdHMnKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUubG9naW5EYXRhID0ge307XHJcbiAgICAgICAgICAgICRzY29wZS5yZWdpc3RlckRhdGEgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5vcGVuTG9naW5Nb2RhbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5vcGVuTW9kYWwoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNsb3NlTG9naW5Nb2RhbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUucHJvZHVjdHMnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9sb2dpbiBzZWN0aW9uXHJcbiAgICAgICAgICAgICRzY29wZS5kb1JlZ2lzdGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgTG9naW5TZXJ2aWNlLnJlZ2lzdGVyVXNlcigkc2NvcGUucmVnaXN0ZXJEYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5yZWdpc3RlckRhdGEgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ8SQxINuZyBrw70gdGjDoG5oIGPDtG5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnVnVpIGzDsm5nIMSRxINuZyBuaOG6rXAgxJHhu4MgdGnhur9wIHThu6VjJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnxJDEg25nIGvDvSBraMO0bmcgdGjDoG5oIGPDtG5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBkYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vcmVnaXN0ZXIgc2VjdGlvblxyXG4gICAgICAgICAgICAkc2NvcGUuZG9Mb2dpbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIExvZ2luU2VydmljZS5sb2dpblVzZXIoJHNjb3BlLmxvZ2luRGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBMb2dpblNlcnZpY2UuZ2V0SW5mbygkc2NvcGUubG9naW5EYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLm5hbWUgPSBkYXRhLnVzZXIuZnVsbG5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5lbWFpbCA9IGRhdGEudXNlci5lbWFpbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnBob25lID0gZGF0YS5waG9uZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmFkZHJlc3MgPSBkYXRhLmFkZHJlc3M7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5kaXN0cmljdCA9IGRhdGEuZGlzdHJpY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jaXR5ID0gZGF0YS5jaXR5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEucGFzc3dvcmQgPSAkc2NvcGUubG9naW5EYXRhLnBhc3N3b3JkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVzZXJTZXJ2aWNlLmxvZ2luKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdtZW51LnByb2R1Y3RzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUudXNlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdMb2dpbiBmYWlsZWQhJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnUGxlYXNlIGNoZWNrIHlvdXIgY3JlZGVudGlhbHMhJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcclxuICAgIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XHJcbiAgICAgICAgLy8gaWYgbm9uZSBvZiB0aGUgYWJvdmUgc3RhdGVzIGFyZSBtYXRjaGVkLCB1c2UgdGhpcyBhcyB0aGUgZmFsbGJhY2tcclxuICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdob21lJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9cIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9ob21lL2hvbWUuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdsb2dpbicsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvbG9naW5cIixcclxuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbW9kdWxlcy9yZWdpc3RlckxvZ2luL3JlZ2lzdGVyTG9naW4uaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlZ2lzdGVyTG9naW5Db250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9tZW51XCIsXHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9tZW51L21lbnUuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01lbnVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LnByb2R1Y3RzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9kdWN0c1wiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L3Byb2R1Y3RzL3Byb2R1Y3RzLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0c0NvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudS5wcm9kdWN0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9kdWN0LzppZFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L3Byb2R1Y3RzL3Byb2R1Y3QuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2R1Y3RDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUuY2FydCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvY2FydFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L2NhcnQvY2FydC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ2FydENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudS53aXNobGlzdCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvd2lzaGxpc3RcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC93aXNobGlzdC93aXNobGlzdC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnV2lzaGxpc3RDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUuY2hlY2tvdXQnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2NoZWNrb3V0XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXQuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NoZWNrb3V0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LmNoZWNrb3V0X2VkaXQnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2NoZWNrb3V0X2VkaXRcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9jaGVja291dC9jaGVja291dF9lZGl0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGVja291dEVkaXRDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUudXNlcicsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvdXNlclwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L3VzZXIvdXNlci5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVXNlckNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgfVxyXG5dXHJcbjsiXX0=
