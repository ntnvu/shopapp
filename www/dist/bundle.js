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
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(false);
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
                this.addAttribute
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


                var link_ajax = "http://shop10k.qrmartdemo.info/web_api.php?r=timespam";
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
    .controller("CartController", ['$scope', '$localstorage', 'WishlistService', 'CartService','CheckoutService','$state',
        function ($scope, $localstorage, WishlistService, CartService, CheckoutService, $state) {
            $scope.cartlist = $localstorage.getObject("cart");
            $scope.lengthCart = $scope.cartlist.length;
            CartService.setCartNumber();
            $scope.cartNumber = CartService.getCartNumber();
            $scope.total = CartService.convertMoney(0, ",", ".", CartService.sumCart());

            $scope.addToWishlist = function(item){
                WishlistService.addWishlist(item);
            }

            $scope.removeFromCart = function(item){
                CartService.removeCart(item);
                $scope.cartlist = $localstorage.getObject("cart");
                $scope.lengthCart = $scope.cartlist.length;
                $scope.cartNumber = CartService.getCartNumber();
            }

            $scope.cart_checkout = function(){
                CheckoutService.sumTotal();
                $state.go('menu.checkout', {location: true, notify: false});
            }

            $scope.$on('CartUpdate', function (event, data) {
                $scope.total = CartService.sumCart();
                $scope.cartNumber = CartService.getCartNumber();
            });

            $scope.updateQty = function(item){
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
                return cartNumber;
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
    .controller("CheckoutController", ['$scope', '$localstorage', 'ControlModalService', '$state','$rootScope', 'CheckoutService','UserService','ProductService','$ionicPopup',
        function ($scope, $localstorage, ControlModalService, $state, $rootScope, CheckoutService, UserService, ProductService, $ionicPopup) {
            $scope.user = UserService.currentUser;
            $scope.checkoutInfo = CheckoutService.checkoutInfo;


            if (Object.keys($scope.checkoutInfo["methodShip"]).length === 0){
                CheckoutService.shippingInfo().success(function(data){
                    var shippingInfo = data;
                    $scope.checkoutInfo["methodShip"] = shippingInfo[0].method[0];
                });
            }


            $scope.checkoutInfo["methodPayment"] = CheckoutService.paymentInfo.A;

            if(UserService.isLogin()){
                CheckoutService.updateCheckoutInfo($scope.user);
            }

            $scope.checkout = function(){
                if(!$scope.checkoutInfo.address){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Bổ sung',
                        template: 'Vui lòng nhập địa chỉ giao hàng'
                    });
                }
                else{
                    CheckoutService.setOrder();

                    $localstorage.setNull("cart");
                    $localstorage.addAttributeAll("wishlist", "added", false);//remove add to card attr in wishlist

                    $rootScope.$broadcast("CartUpdate");
                    $rootScope.$broadcast("CloseOrder");

                    ProductService.setType("new");
                    ProductService.setPage(1);
                    ProductService.updateLoadmore(true);
                    ProductService.filterProduct();

                    $state.go("menu.products");
                }

            }
        }]);
},{}],9:[function(require,module,exports){
'use strict';

module.exports = angular.module('checkoutEdit.controller', [])
    .controller("CheckoutEditController", ['$scope', '$localstorage', 'UserService', 'CheckoutService', '$state', 'CartService',
        function ($scope, $localstorage, UserService, CheckoutService, $state, CartService) {
            $scope.user = UserService.currentUser;
            $scope.regex = '/^[0-9]*$/';

            $scope.checkoutInfo = CheckoutService.checkoutInfo;

            $scope.paymentInfo = CheckoutService.paymentInfo;


            CheckoutService.shippingInfo().success(function (data) {
                $scope.shippingInfo = data;
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
                if (typeof obj1 === "undefined") {
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
    .controller("MenuController", ['$scope', '$ionicSideMenuDelegate', 'ProductService', '$state', 'ControlModalService', '$localstorage', 'UserService','$ionicScrollDelegate',
        function ($scope, $ionicSideMenuDelegate, ProductService, $state, ControlModalService, $localstorage, UserService, $ionicScrollDelegate) {
            $scope.wishlistNumber = $localstorage.getObject("wishlist").length;
            $scope.cartNumber = $localstorage.getObject("cart").length;
            $scope.user = UserService.currentUser;
            UserService.isLogin();

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
                {type: "new", name: 'Sản phẩm mới'},
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
                ProductService.filterProduct();
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

            $scope.getProducts("new");
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
            var link_ajax = "http://shop10k.qrmartdemo.info/api/rest/products";
            var link_ajax_new = "http://shop10k.qrmartdemo.info/web_api.php";

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
    .controller("ProductsController", ['$scope', '$ionicSideMenuDelegate', 'ProductService', 'ControlModalService', 'WishlistService', 'CartService',
        function ($scope, $ionicSideMenuDelegate, ProductService, ControlModalService, WishlistService, CartService) {
            $scope.products = ProductService.productCurrent;
            CartService.setCartNumber();
            $scope.cartNumber = CartService.getCartNumber();
            $scope.total = CartService.convertMoney(0, ",", ".", CartService.sumCart());
            $scope.loadMore = ProductService.loadMore;

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
                    function(md5key){
                        var link_ajax = "http://shop10k.qrmartdemo.info/api/rest/products";
                        $http.get("http://shop10k.qrmartdemo.info/web_api.php?r=" + filter.type + "&limit=" + filter.limit + "&page=" + filter.page + "&key=" + md5key).then(function (resp) {
                            if (!resp.data.Error) {
                                add_product(resp.data);

                                $ionicLoading.hide();

                                $localstorage.updateArray(products, $localstorage.getObject("cart"), "added");
                                $localstorage.updateArray(products, $localstorage.getObject("wishlist"), "like");

                                deferred.resolve(filter.page);
                            }
                            else{
                                deferred.reject(filter.page);
                            }
                        }, function (err) {
                            // err.status will contain the status code
                            console.error('ERR', err);
                            deferred.reject('ERR ' + err);
                        })
                    },
                    function(){
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

            updateLoadmore : function(load){
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

            filter : filter,

            loadMore : isLoadMore,

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

module.exports = angular.module("user", ['app.service',  "products", 'user.service', 'user.controller']);
},{"../.././app_service":3,".././products/products":16,"./user_controller.js":20,"./user_service.js":21}],20:[function(require,module,exports){
'use strict';

module.exports = angular.module('user.controller', [])
    .controller("UserController", ['$scope','UserService','$ionicPopup',
        function ($scope, UserService, $ionicPopup) {
            $scope.user = UserService.currentUser;

            $scope.updateUser = function(){
                UserService.updateUser($scope.user);
                var alertPopup = $ionicPopup.alert({
                    title: 'Cập nhật thành công',
                    template: 'Thông tin của bạn đã được thay đổi'
                });
            }
        }
    ]);
},{}],21:[function(require,module,exports){
'use strict';

module.exports = angular.module('user.service', [])
    .service('UserService', function ($q, $localstorage, ProductService, $rootScope) {
        var current_user = {
            portrait: "img/portrait.jpg"
        };

        return {
            currentUser : current_user,

            isLogin : function(){
                var user = $localstorage.getObject("user");
                if(user.login){
                    this.updateUser(user);
                    return 1;
                }
                return 0;
            },

            updateUser : function(info){
                for(var i in info){
                    current_user[i] = info[i];
                }
            },

            getUser : function(){
                return current_user;
            },

            signOut : function(){
                current_user.login = false;
                $localstorage.setNull("user");

                $localstorage.setNull("cart");
                $localstorage.setNull("wishlist");
                ProductService.setPage(1);
                ProductService.filterProduct();
                $rootScope.$broadcast("CartUpdate");
                $rootScope.$broadcast("WishlistUpdate");
            },

            login : function(user){

                for(var i in user){
                    current_user[i] = user[i];
                }
                current_user.login = true;
                $localstorage.setObject("user", current_user);

                $localstorage.setNull("cart");
                $localstorage.setNull("wishlist");
                ProductService.setPage(1);
                ProductService.filterProduct();
                $rootScope.$broadcast("CartUpdate");
                $rootScope.$broadcast("WishlistUpdate");
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
    .service('LoginService', function ($q, $http, $localstorage) {
        return {
            loginUser: loginUser,
            registerUser: registerUser,
            getInfo: getInfo
        }
        function getInfo(obj) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $localstorage.getKeyTime().then(
                function (md5key) {
                    $http.get("http://shop10k.qrmartdemo.info/web_api.php?r=user&check=" + obj.email + "&password=" + obj.password + "&detail=true" + "&key=" + md5key)
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
            $localstorage.getKeyTime().then(
                function (md5key) {
                    $http.get("http://shop10k.qrmartdemo.info/web_api.php?r=user&register=true&firstname=" + obj.name + "&lastname=" + obj.name + "&password=" + obj.password + "&email=" + obj.email + "&key=" + md5key)
                        .then(function (resp) {
                            console.log(resp.data.error);
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
                    $http.get("http://shop10k.qrmartdemo.info/web_api.php?r=user&login=" + obj.email + "&password=" + obj.password + "&key=" + md5key)
                        .then(function (resp) {
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
                                data.phone = data.shipping_address.telephone_ship;
                                data.address = data.shipping_address.street_ship[0];
                                data.district = data.shipping_address.dis_ship;
                                data.city = data.shipping_address.city_ship;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIi4vd3d3L2pzL2FwcC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvYXBwLW1haW4uanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2FwcF9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2FydC9jYXJ0LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2FydC9jYXJ0X2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9jYXJ0L2NhcnRfc2VydmljZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXRfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0X2VkaXRfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0X3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9ob21lL2hvbWUuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9ob21lL2hvbWVfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L21lbnUvbWVudS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L21lbnUvbWVudV9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdF9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHMuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0c19jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHNfZmFjdG9yeS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3VzZXIvdXNlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3VzZXIvdXNlcl9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvdXNlci91c2VyX3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC93aXNobGlzdC93aXNobGlzdC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3dpc2hsaXN0L3dpc2hsaXN0X2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC93aXNobGlzdC93aXNobGlzdF9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL2NvbnRhY3QvY29udGFjdC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9jb250YWN0L2NvbnRhY3RfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9jb250YWN0L2NvbnRhY3Rfc2VydmljZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9yZWdpc3RlckxvZ2luL2xvZ2luX3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJfbG9naW5fY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvcm91dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vbW9kdWxlIG5vZGVcclxuLy9yZXF1aXJlKFwiYW5ndWxhclwiKTtcclxuXHJcbi8vbW9kdWxlIGZ1bmN0aW9uc1xyXG5yZXF1aXJlKFwiLi9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJMb2dpblwiKTtcclxucmVxdWlyZShcIi4vbW9kdWxlcy9jb250YWN0L2NvbnRhY3RcIik7XHJcbi8vbW9kdWxlIGxheW91dFxyXG5yZXF1aXJlKFwiLi9sYXlvdXQvaG9tZS9ob21lXCIpO1xyXG5yZXF1aXJlKFwiLi9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHNcIik7XHJcbnJlcXVpcmUoXCIuL2xheW91dC9tZW51L21lbnVcIik7XHJcbnJlcXVpcmUoXCIuL2xheW91dC9jYXJ0L2NhcnRcIik7XHJcbnJlcXVpcmUoXCIuL2xheW91dC9jaGVja291dC9jaGVja291dFwiKTtcclxucmVxdWlyZShcIi4vbGF5b3V0L3dpc2hsaXN0L3dpc2hsaXN0XCIpO1xyXG5yZXF1aXJlKFwiLi9sYXlvdXQvdXNlci91c2VyXCIpO1xyXG5yZXF1aXJlKFwiLi9hcHBfc2VydmljZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnQgPSBhbmd1bGFyLm1vZHVsZSgnc3RhcnRlcicsIFsnaW9uaWMnLCAnYWtvZW5pZy5kZWNrZ3JpZCcsICduZy1tZmInLFxyXG4gICAgICAgIC8vZnVuY3Rpb25zXHJcbiAgICAgICAgJ3JlZ2lzdGVyTG9naW4nLFxyXG4gICAgICAgICdjb250YWN0JyxcclxuXHJcbiAgICAgICAgLy9sYXlvdXRcclxuICAgICAgICAnaG9tZScsXHJcbiAgICAgICAgJ21lbnUnLFxyXG4gICAgICAgICdwcm9kdWN0cycsXHJcbiAgICAgICAgJ2NhcnQnLFxyXG4gICAgICAgICdjaGVja291dCcsXHJcbiAgICAgICAgJ3dpc2hsaXN0JyxcclxuICAgICAgICAndXNlcicsXHJcblxyXG4gICAgICAgICdhcHAuc2VydmljZScsXHJcblxyXG4gICAgXSlcclxuICAgIC5jb25maWcocmVxdWlyZSgnLi9yb3V0ZXInKSlcclxuICAgIC5ydW4ocmVxdWlyZSgnLi9hcHAtbWFpbicpKTtcclxuXHJcblxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5mdW5jdGlvbiBBcHBNYWluKCRpb25pY1BsYXRmb3JtLCAkc3RhdGUpe1xyXG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxyXG4gICAgICAgIC8vIGZvciBmb3JtIGlucHV0cylcclxuICAgICAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZCkge1xyXG4gICAgICAgICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xyXG4gICAgICAgICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuZGlzYWJsZVNjcm9sbChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XHJcbiAgICAgICAgICAgIC8vIG9yZy5hcGFjaGUuY29yZG92YS5zdGF0dXNiYXIgcmVxdWlyZWRcclxuICAgICAgICAgICAgU3RhdHVzQmFyLnN0eWxlRGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICRpb25pY1BsYXRmb3JtLm9uKCdyZXN1bWUnLCBmdW5jdGlvbigpe1xyXG4vLyAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XHJcbiAgICB9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbJyRpb25pY1BsYXRmb3JtJywgJyRzdGF0ZScsIEFwcE1haW5dOyIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VcIiwgW10pXHJcbiAgICAuZmFjdG9yeSgnJGxvY2Fsc3RvcmFnZScsIGZ1bmN0aW9uICgkcSwgJGh0dHAsICR3aW5kb3csICRpb25pY0hpc3RvcnkpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChrZXksIGRlZmF1bHRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gfHwgZGVmYXVsdFZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0T2JqZWN0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0T2JqZWN0OiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8ICd7fScpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0TnVsbDogZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRPYmplY3Qoa2V5LCB7fSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEF0dHJpYnV0ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXROdWxsQWxsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5jbGVhckNhY2hlKCk7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFySGlzdG9yeSgpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkT2JqZWN0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gbmV3IEFycmF5KHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHZhciBhcnIgPSB0aGlzLmdldE9iamVjdChrZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNoYXJlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnJbaV0uZW50aXR5X2lkID09IHZhbHVlWzBdLmVudGl0eV9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2hhcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuY29uY2F0KGFycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGFycjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldE9iamVjdChrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIG9iakFyck5lZWRVcGRhdGUgOiBpcyBhbiBhcnJheSBuZWVkIHVwZGF0ZSBhZnRlciBtYWluIGFycmF5IGlzXHJcbiAgICAgICAgICAgICAqICovXHJcbiAgICAgICAgICAgIHJlbW92ZU9iamVjdDogZnVuY3Rpb24gKGtleSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IHRoaXMuZ2V0T2JqZWN0KGtleSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGFycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcnJbaV0uZW50aXR5X2lkID09IGl0ZW0uZW50aXR5X2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0T2JqZWN0KGtleSwgYXJyKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIG1lcmdlQXJyYXk6IGZ1bmN0aW9uIChhcnIxLCBhcnIyKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyMyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhcnIxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNoYXJlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gYXJyMilcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycjJbal0uZW50aXR5X2lkID09IGFycjFbaV0uZW50aXR5X2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNoYXJlZCkgYXJyMy5wdXNoKGFycjFbaV0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhcnIzID0gYXJyMy5jb25jYXQoYXJyMik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyMztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy9pbnB1dCAyIGFycmF5XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIGFycmF5IGNvbnRhaW4gYWxsIGVsZW1lbnRzIHdoaWNoIGFyZSBpbiBib3RoIGFycmF5IGFuZCB1cGRhdGUgZm9sbG93IGFycjJcclxuICAgICAgICAgICAgdXBkYXRlQXJyYXk6IGZ1bmN0aW9uIChhcnIxLCBhcnIyLCBrZXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYXJyMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gYXJyMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyMltqXS5lbnRpdHlfaWQgPT0gYXJyMVtpXS5lbnRpdHlfaWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnIxW2ldW2tleV0gPSBhcnIyW2pdW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRBdHRyaWJ1dGU6IGZ1bmN0aW9uIChrZXksIGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gdGhpcy5nZXRPYmplY3Qoa2V5KTtcclxuICAgICAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnJbaV0uZW50aXR5X2lkID09IGl0ZW0uZW50aXR5X2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJbaV1baW5kZXhdID0gaXRlbVtpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRPYmplY3Qoa2V5LCBhcnIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkQXR0cmlidXRlQWxsOiBmdW5jdGlvbiAoa2V5LCBhdHRyLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IHRoaXMuZ2V0T2JqZWN0KGtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGFycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJbaV1bYXR0cl0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRPYmplY3Qoa2V5LCBhcnIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0S2V5VGltZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGxpbmtfYWpheCA9IFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL3dlYl9hcGkucGhwP3I9dGltZXNwYW1cIjtcclxuICAgICAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXgpLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3AuZGF0YS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gcmVzcC5kYXRhLnRpbWVzcGFtICsgJ2FwcCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZDVrZXkgPSBtZDUoa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShtZDVrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoW3tcInByb2R1Y3RpZFwiOlwiMTg3M1wiLFwicXVhbnRpdHlcIjpcIjJcIn0se1wicHJvZHVjdGlkXCI6XCIxODcxXCIsXCJxdWFudGl0eVwiOlwiMlwifV0pKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QocmVzcC5kYXRhLmVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZXJyLnN0YXR1cyB3aWxsIGNvbnRhaW4gdGhlIHN0YXR1cyBjb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRVJSJywgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0VSUiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICAuc2VydmljZSgnQ29udHJvbE1vZGFsU2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGlvbmljTW9kYWwsICRyb290U2NvcGUsICR0aW1lb3V0LCAkY29udHJvbGxlcikge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNob3c6IHNob3dcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gc2hvdyh0ZW1wbGV0ZVVybCwgY29udHJvbGxlciwgYXV0b3Nob3csIHBhcmFtZXRlcnMsIG9wdGlvbnMsIHdyYXBDYWxzcykge1xyXG4gICAgICAgICAgICAvLyBHcmFiIHRoZSBpbmplY3RvciBhbmQgY3JlYXRlIGEgbmV3IHNjb3BlXHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCksXHJcbiAgICAgICAgICAgICAgICBjdHJsSW5zdGFuY2UsXHJcbiAgICAgICAgICAgICAgICBtb2RhbFNjb3BlID0gJHJvb3RTY29wZS4kbmV3KCksXHJcbiAgICAgICAgICAgICAgICB0aGlzU2NvcGVJZCA9IG1vZGFsU2NvcGUuJGlkLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiAnc2xpZGUtaW4tdXAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvY3VzRmlyc3RJbnB1dDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2Ryb3BDbGlja1RvQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgaGFyZHdhcmVCYWNrQnV0dG9uQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxDYWxsYmFjazogbnVsbFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgJGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKHRlbXBsZXRlVXJsLCB7XHJcbiAgICAgICAgICAgICAgICBzY29wZTogbW9kYWxTY29wZSxcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogb3B0aW9ucy5hbmltYXRpb24sXHJcbiAgICAgICAgICAgICAgICBmb2N1c0ZpcnN0SW5wdXQ6IG9wdGlvbnMuZm9jdXNGaXJzdElucHV0LFxyXG4gICAgICAgICAgICAgICAgYmFja2Ryb3BDbGlja1RvQ2xvc2U6IG9wdGlvbnMuYmFja2Ryb3BDbGlja1RvQ2xvc2UsXHJcbiAgICAgICAgICAgICAgICBoYXJkd2FyZUJhY2tCdXR0b25DbG9zZTogb3B0aW9ucy5oYXJkd2FyZUJhY2tCdXR0b25DbG9zZVxyXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWwgPSBtb2RhbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWwuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLm1vZGFsLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLiRvbignbW9kYWwuaGlkZGVuJywgZnVuY3Rpb24gKHRoaXNNb2RhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc01vZGFsLmN1cnJlbnRTY29wZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1vZGFsU2NvcGVJZCA9IHRoaXNNb2RhbC5jdXJyZW50U2NvcGUuJGlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNTY29wZUlkID09PSBtb2RhbFNjb3BlSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jbGVhbnVwKHRoaXNNb2RhbC5jdXJyZW50U2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEludm9rZSB0aGUgY29udHJvbGxlclxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsb2NhbHMgPSB7ICckc2NvcGUnOiBtb2RhbFNjb3BlLCAncGFyYW1ldGVycyc6IHBhcmFtZXRlcnMgfTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY3RybEV2YWwgPSBfZXZhbENvbnRyb2xsZXIoY29udHJvbGxlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybEluc3RhbmNlID0gJGNvbnRyb2xsZXIoY29udHJvbGxlciwgbG9jYWxzKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3RybEV2YWwuaXNDb250cm9sbGVyQXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RybEluc3RhbmNlLm9wZW5Nb2RhbCA9IG1vZGFsU2NvcGUub3Blbk1vZGFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHJsSW5zdGFuY2UuY2xvc2VNb2RhbCA9IG1vZGFsU2NvcGUuY2xvc2VNb2RhbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdXRvc2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLm1vZGFsLnNob3coKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUuJGJyb2FkY2FzdCgnbW9kYWwuYWZ0ZXJTaG93JywgbW9kYWxTY29wZS5tb2RhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24ob3B0aW9ucy5tb2RhbENhbGxiYWNrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm1vZGFsQ2FsbGJhY2sobW9kYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX2NsZWFudXAoc2NvcGUpIHtcclxuICAgICAgICAgICAgc2NvcGUuJGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgaWYgKHNjb3BlLm1vZGFsKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5tb2RhbC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX2V2YWxDb250cm9sbGVyKGN0cmxOYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7XHJcbiAgICAgICAgICAgICAgICBpc0NvbnRyb2xsZXJBczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyTmFtZTogJycsXHJcbiAgICAgICAgICAgICAgICBwcm9wTmFtZTogJydcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdmFyIGZyYWdtZW50cyA9IChjdHJsTmFtZSB8fCAnJykudHJpbSgpLnNwbGl0KC9cXHMrLyk7XHJcbiAgICAgICAgICAgIHJlc3VsdC5pc0NvbnRyb2xsZXJBcyA9IGZyYWdtZW50cy5sZW5ndGggPT09IDMgJiYgKGZyYWdtZW50c1sxXSB8fCAnJykudG9Mb3dlckNhc2UoKSA9PT0gJ2FzJztcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5pc0NvbnRyb2xsZXJBcykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmNvbnRyb2xsZXJOYW1lID0gZnJhZ21lbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnByb3BOYW1lID0gZnJhZ21lbnRzWzJdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmNvbnRyb2xsZXJOYW1lID0gY3RybE5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9jYXJ0X3NlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi9jYXJ0X2NvbnRyb2xsZXIuanMnKTtcclxucmVxdWlyZSgnLi4vLi9wcm9kdWN0cy9wcm9kdWN0cycpO1xyXG5yZXF1aXJlKCcuLi8uL2NoZWNrb3V0L2NoZWNrb3V0Jyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJjYXJ0XCIsIFsnYXBwLnNlcnZpY2UnLCAnY2hlY2tvdXQnLCAncHJvZHVjdHMnLCAnY2FydC5zZXJ2aWNlcycsICdjYXJ0LmNvbnRyb2xsZXInXSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnY2FydC5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIkNhcnRDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRsb2NhbHN0b3JhZ2UnLCAnV2lzaGxpc3RTZXJ2aWNlJywgJ0NhcnRTZXJ2aWNlJywnQ2hlY2tvdXRTZXJ2aWNlJywnJHN0YXRlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYWxzdG9yYWdlLCBXaXNobGlzdFNlcnZpY2UsIENhcnRTZXJ2aWNlLCBDaGVja291dFNlcnZpY2UsICRzdGF0ZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUuY2FydGxpc3QgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIik7XHJcbiAgICAgICAgICAgICRzY29wZS5sZW5ndGhDYXJ0ID0gJHNjb3BlLmNhcnRsaXN0Lmxlbmd0aDtcclxuICAgICAgICAgICAgQ2FydFNlcnZpY2Uuc2V0Q2FydE51bWJlcigpO1xyXG4gICAgICAgICAgICAkc2NvcGUuY2FydE51bWJlciA9IENhcnRTZXJ2aWNlLmdldENhcnROdW1iZXIoKTtcclxuICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gQ2FydFNlcnZpY2UuY29udmVydE1vbmV5KDAsIFwiLFwiLCBcIi5cIiwgQ2FydFNlcnZpY2Uuc3VtQ2FydCgpKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hZGRUb1dpc2hsaXN0ID0gZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgICBXaXNobGlzdFNlcnZpY2UuYWRkV2lzaGxpc3QoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5yZW1vdmVGcm9tQ2FydCA9IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgQ2FydFNlcnZpY2UucmVtb3ZlQ2FydChpdGVtKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jYXJ0bGlzdCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5sZW5ndGhDYXJ0ID0gJHNjb3BlLmNhcnRsaXN0Lmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jYXJ0TnVtYmVyID0gQ2FydFNlcnZpY2UuZ2V0Q2FydE51bWJlcigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY2FydF9jaGVja291dCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBDaGVja291dFNlcnZpY2Uuc3VtVG90YWwoKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5jaGVja291dCcsIHtsb2NhdGlvbjogdHJ1ZSwgbm90aWZ5OiBmYWxzZX0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdDYXJ0VXBkYXRlJywgZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudG90YWwgPSBDYXJ0U2VydmljZS5zdW1DYXJ0KCk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2FydE51bWJlciA9IENhcnRTZXJ2aWNlLmdldENhcnROdW1iZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlUXR5ID0gZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZEF0dHJpYnV0ZShcImNhcnRcIiwgaXRlbSwgXCJxdWFudGl0eVwiKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS50b3RhbCA9IENhcnRTZXJ2aWNlLmNvbnZlcnRNb25leSgwLCBcIixcIiwgXCIuXCIsIENhcnRTZXJ2aWNlLnN1bUNhcnQoKSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NhcnQuc2VydmljZXMnLCBbXSlcclxuICAgIC5zZXJ2aWNlKCdDYXJ0U2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGxvY2Fsc3RvcmFnZSwgJHJvb3RTY29wZSwgUHJvZHVjdFNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgY2FydE51bWJlciA9IDA7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYWRkQ2FydDogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmICghaXRlbS5hZGRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcnROdW1iZXIrKztcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmFkZGVkID0gIWl0ZW0uYWRkZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5xdWFudGl0eSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5hZGRPYmplY3QoXCJjYXJ0XCIsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuYWRkQXR0cmlidXRlKFwid2lzaGxpc3RcIiwgaXRlbSwgXCJhZGRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5hZGRBdHRyaWJ1dGUoaXRlbSwgXCJhZGRlZFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiQ2FydFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2FydChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHJlbW92ZUNhcnQ6IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjYXJ0TnVtYmVyLS07XHJcbiAgICAgICAgICAgICAgICBpdGVtLmFkZGVkID0gIWl0ZW0uYWRkZWQ7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnJlbW92ZU9iamVjdChcImNhcnRcIiwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZEF0dHJpYnV0ZShcIndpc2hsaXN0XCIsIGl0ZW0sIFwiYWRkZWRcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuYWRkQXR0cmlidXRlKGl0ZW0sIFwiYWRkZWRcIiwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIkNhcnRVcGRhdGVcIik7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzdW1DYXJ0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FydCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKTtcclxuICAgICAgICAgICAgICAgIHZhciB0b3RhbCA9IDA7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGNhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b3RhbCArPSBwYXJzZUludChjYXJ0W2ldLnByaWNlX251bWJlciAqIGNhcnRbaV0ucXVhbnRpdHkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRvdGFsO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgY29udmVydE1vbmV5IDogZnVuY3Rpb24oYywgZCwgdCwgbnVtYmVyKXtcclxuICAgICAgICAgICAgICAgIHZhciBuID0gbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIGMgPSBpc05hTihjID0gTWF0aC5hYnMoYykpID8gMiA6IGMsXHJcbiAgICAgICAgICAgICAgICAgICAgZCA9IGQgPT0gdW5kZWZpbmVkID8gXCIuXCIgOiBkLFxyXG4gICAgICAgICAgICAgICAgICAgIHQgPSB0ID09IHVuZGVmaW5lZCA/IFwiLFwiIDogdCxcclxuICAgICAgICAgICAgICAgICAgICBzID0gbiA8IDAgPyBcIi1cIiA6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaSA9IHBhcnNlSW50KG4gPSBNYXRoLmFicygrbiB8fCAwKS50b0ZpeGVkKGMpKSArIFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaiA9IChqID0gaS5sZW5ndGgpID4gMyA/IGogJSAzIDogMDtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzICsgKGogPyBpLnN1YnN0cigwLCBqKSArIHQgOiBcIlwiKSArIGkuc3Vic3RyKGopLnJlcGxhY2UoLyhcXGR7M30pKD89XFxkKS9nLCBcIiQxXCIgKyB0KSArIChjID8gZCArIE1hdGguYWJzKG4gLSBpKS50b0ZpeGVkKGMpLnNsaWNlKDIpIDogXCJcIikgKyBcIiDEkSBcIjtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldENhcnROdW1iZXIgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgY2FydE51bWJlciA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKS5sZW5ndGggPiAwID8gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpLmxlbmd0aCA6IDA7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRDYXJ0TnVtYmVyIDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjYXJ0TnVtYmVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9jaGVja291dF9jb250cm9sbGVyJyk7XHJcbnJlcXVpcmUoJy4vY2hlY2tvdXRfZWRpdF9jb250cm9sbGVyJyk7XHJcbnJlcXVpcmUoJy4vY2hlY2tvdXRfc2VydmljZScpO1xyXG5yZXF1aXJlKCcuLi8uL3VzZXIvdXNlcicpO1xyXG5yZXF1aXJlKFwiLi4vLi9wcm9kdWN0cy9wcm9kdWN0c1wiKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcImNoZWNrb3V0XCIsIFsnYXBwLnNlcnZpY2UnLCAndXNlcicsICdwcm9kdWN0cycsICdjaGVja291dC5zZXJ2aWNlJywgJ2NoZWNrb3V0LmNvbnRyb2xsZXInLCAnY2hlY2tvdXRFZGl0LmNvbnRyb2xsZXInXSkiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjaGVja291dC5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIkNoZWNrb3V0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckbG9jYWxzdG9yYWdlJywgJ0NvbnRyb2xNb2RhbFNlcnZpY2UnLCAnJHN0YXRlJywnJHJvb3RTY29wZScsICdDaGVja291dFNlcnZpY2UnLCdVc2VyU2VydmljZScsJ1Byb2R1Y3RTZXJ2aWNlJywnJGlvbmljUG9wdXAnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhbHN0b3JhZ2UsIENvbnRyb2xNb2RhbFNlcnZpY2UsICRzdGF0ZSwgJHJvb3RTY29wZSwgQ2hlY2tvdXRTZXJ2aWNlLCBVc2VyU2VydmljZSwgUHJvZHVjdFNlcnZpY2UsICRpb25pY1BvcHVwKSB7XHJcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gVXNlclNlcnZpY2UuY3VycmVudFVzZXI7XHJcbiAgICAgICAgICAgICRzY29wZS5jaGVja291dEluZm8gPSBDaGVja291dFNlcnZpY2UuY2hlY2tvdXRJbmZvO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cygkc2NvcGUuY2hlY2tvdXRJbmZvW1wibWV0aG9kU2hpcFwiXSkubGVuZ3RoID09PSAwKXtcclxuICAgICAgICAgICAgICAgIENoZWNrb3V0U2VydmljZS5zaGlwcGluZ0luZm8oKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzaGlwcGluZ0luZm8gPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jaGVja291dEluZm9bXCJtZXRob2RTaGlwXCJdID0gc2hpcHBpbmdJbmZvWzBdLm1ldGhvZFswXTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0SW5mb1tcIm1ldGhvZFBheW1lbnRcIl0gPSBDaGVja291dFNlcnZpY2UucGF5bWVudEluZm8uQTtcclxuXHJcbiAgICAgICAgICAgIGlmKFVzZXJTZXJ2aWNlLmlzTG9naW4oKSl7XHJcbiAgICAgICAgICAgICAgICBDaGVja291dFNlcnZpY2UudXBkYXRlQ2hlY2tvdXRJbmZvKCRzY29wZS51c2VyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGlmKCEkc2NvcGUuY2hlY2tvdXRJbmZvLmFkZHJlc3Mpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0Lhu5Ugc3VuZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnVnVpIGzDsm5nIG5o4bqtcCDEkeG7i2EgY2jhu4kgZ2lhbyBow6BuZydcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgQ2hlY2tvdXRTZXJ2aWNlLnNldE9yZGVyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbChcImNhcnRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5hZGRBdHRyaWJ1dGVBbGwoXCJ3aXNobGlzdFwiLCBcImFkZGVkXCIsIGZhbHNlKTsvL3JlbW92ZSBhZGQgdG8gY2FyZCBhdHRyIGluIHdpc2hsaXN0XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIkNhcnRVcGRhdGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiQ2xvc2VPcmRlclwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2Uuc2V0VHlwZShcIm5ld1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5zZXRQYWdlKDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLnVwZGF0ZUxvYWRtb3JlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmZpbHRlclByb2R1Y3QoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwibWVudS5wcm9kdWN0c1wiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnY2hlY2tvdXRFZGl0LmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiQ2hlY2tvdXRFZGl0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckbG9jYWxzdG9yYWdlJywgJ1VzZXJTZXJ2aWNlJywgJ0NoZWNrb3V0U2VydmljZScsICckc3RhdGUnLCAnQ2FydFNlcnZpY2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhbHN0b3JhZ2UsIFVzZXJTZXJ2aWNlLCBDaGVja291dFNlcnZpY2UsICRzdGF0ZSwgQ2FydFNlcnZpY2UpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBVc2VyU2VydmljZS5jdXJyZW50VXNlcjtcclxuICAgICAgICAgICAgJHNjb3BlLnJlZ2V4ID0gJy9eWzAtOV0qJC8nO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0SW5mbyA9IENoZWNrb3V0U2VydmljZS5jaGVja291dEluZm87XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUucGF5bWVudEluZm8gPSBDaGVja291dFNlcnZpY2UucGF5bWVudEluZm87XHJcblxyXG5cclxuICAgICAgICAgICAgQ2hlY2tvdXRTZXJ2aWNlLnNoaXBwaW5nSW5mbygpLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5zaGlwcGluZ0luZm8gPSBkYXRhO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5iZWxvdzUwID0gZmFsc2U7XHJcbiAgICAgICAgICAgICRzY29wZS5iZWxvdzEwMCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAkc2NvcGUudG90YWxfdGVtcCA9IENhcnRTZXJ2aWNlLnN1bUNhcnQoKTtcclxuICAgICAgICAgICAgaWYgKCRzY29wZS50b3RhbF90ZW1wIDwgNTAwMDApIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5iZWxvdzUwID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICgkc2NvcGUudG90YWxfdGVtcCA8IDEwMDAwMCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmJlbG93MTAwID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUNoZWNrb3V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgQ2hlY2tvdXRTZXJ2aWNlLnVwZGF0ZUNoZWNrb3V0SW5mbygkc2NvcGUuY2hlY2tvdXRJbmZvKTtcclxuICAgICAgICAgICAgICAgIENoZWNrb3V0U2VydmljZS5hZGRTaGlwcGluZygkc2NvcGUuY2hlY2tvdXRJbmZvLm1ldGhvZFNoaXApO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdtZW51LmNoZWNrb3V0Jyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jb21wYXJlT2JqID0gZnVuY3Rpb24gKG9iajEsIG9iajIpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqMSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChvYmoxLnR5cGUgPT09IG9iajIudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NoZWNrb3V0LnNlcnZpY2UnLCBbXSlcclxuICAgIC5mYWN0b3J5KCdDaGVja291dFNlcnZpY2UnLCBmdW5jdGlvbiAoJHEsICRsb2NhbHN0b3JhZ2UsIENhcnRTZXJ2aWNlLCAkaHR0cCkge1xyXG4gICAgICAgIHZhciBjaGVja291dF9pbmZvID0ge1xyXG4gICAgICAgICAgICB0b3RhbDogMCxcclxuICAgICAgICAgICAgZ3JhbmRUb3RhbDogMCxcclxuICAgICAgICAgICAgbWV0aG9kU2hpcFRleHQ6IDAsXHJcbiAgICAgICAgICAgIG1ldGhvZFNoaXA6IHt9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdHJhbnNmb3JtQXJyKG9yaWcpIHtcclxuICAgICAgICAgICAgdmFyIG9yaWdfbmV3ID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBvcmlnKSB7XHJcbiAgICAgICAgICAgICAgICBvcmlnX25ldy5wdXNoKG9yaWdba2V5XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIG5ld0FyciA9IFtdLFxyXG4gICAgICAgICAgICAgICAgbmFtZXMgPSB7fSxcclxuICAgICAgICAgICAgICAgIGksIGosIGN1cjtcclxuICAgICAgICAgICAgZm9yIChpID0gMCwgaiA9IG9yaWdfbmV3Lmxlbmd0aDsgaSA8IGo7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY3VyID0gb3JpZ19uZXdbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoIShjdXIudGl0bGUgaW4gbmFtZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZXNbY3VyLnRpdGxlXSA9IHt0aXRsZTogY3VyLnRpdGxlLCBtZXRob2Q6IFtdfTtcclxuICAgICAgICAgICAgICAgICAgICBuZXdBcnIucHVzaChuYW1lc1tjdXIudGl0bGVdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGkgPCA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9hZGQgY2hpbGQgYXR0cmlidXRlIHRvIG1ldGhvZCB3aGljaCBpcyBjaGlsZC5cclxuICAgICAgICAgICAgICAgICAgICBuYW1lc1tjdXIudGl0bGVdLm1ldGhvZFswXS5jaGlsZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VyLmNoaWxkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjdXIucHJpY2UgPSBwYXJzZUludChjdXIucHJpY2UpO1xyXG4gICAgICAgICAgICAgICAgbmFtZXNbY3VyLnRpdGxlXS5tZXRob2QucHVzaChjdXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdBcnI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRfc2hpcHBpbmdfbWV0aG9kKCkge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuZ2V0S2V5VGltZSgpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAobWQ1a2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGh0dHAuZ2V0KFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL3dlYl9hcGkucGhwP3I9c2hpcHBpbmdcIiArIFwiJmtleT1cIiArIG1kNWtleSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdEYXRhID0gdHJhbnNmb3JtQXJyKHJlc3AuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKG5ld0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXJyLnN0YXR1cyB3aWxsIGNvbnRhaW4gdGhlIHN0YXR1cyBjb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFUlInLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdFUlIgJyArIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIClcclxuXHJcbiAgICAgICAgICAgIHByb21pc2Uuc3VjY2VzcyA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb21pc2UuZXJyb3IgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihudWxsLCBmbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcGF5bWVudF9tZXRob2QgPSB7XHJcbiAgICAgICAgICAgIFwiQVwiOiBcIkNhc2ggT24gRGVsaXZlcnkgKHRoYW5oIHRvw6FuIGtoaSBuaOG6rW4gaMOgbmcpXCIsXHJcbiAgICAgICAgICAgIFwiQlwiOiBcIkJhbmsgVHJhbnNmZXIgUGF5bWVudCAoY2h1eeG7g24gcXVhIG5nw6JuIGjDoG5nKVwiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdXBkYXRlQ2hlY2tvdXRJbmZvOiBmdW5jdGlvbiAoaW5mbykge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBpbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tvdXRfaW5mb1tpXSA9IGluZm9baV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzdW1Ub3RhbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY2hlY2tvdXRfaW5mby50b3RhbCA9IENhcnRTZXJ2aWNlLnN1bUNhcnQoKTtcclxuICAgICAgICAgICAgICAgIGNoZWNrb3V0X2luZm8udG90YWxUZXh0ID0gQ2FydFNlcnZpY2UuY29udmVydE1vbmV5KDAsIFwiLFwiLCBcIi5cIiwgY2hlY2tvdXRfaW5mby50b3RhbCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tvdXRfaW5mby5tZXRob2RTaGlwLnByaWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tvdXRfaW5mby5ncmFuZFRvdGFsID0gQ2FydFNlcnZpY2UuY29udmVydE1vbmV5KDAsIFwiLFwiLCBcIi5cIiwgKGNoZWNrb3V0X2luZm8udG90YWwgKyBjaGVja291dF9pbmZvLm1ldGhvZFNoaXAucHJpY2UpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrb3V0X2luZm8uZ3JhbmRUb3RhbCA9IENhcnRTZXJ2aWNlLmNvbnZlcnRNb25leSgwLCBcIixcIiwgXCIuXCIsIGNoZWNrb3V0X2luZm8udG90YWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkU2hpcHBpbmc6IGZ1bmN0aW9uIChtZXRob2RTaGlwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobWV0aG9kU2hpcC5jaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZFNoaXAuc2hpcEFkZHJlc3MgPSBtZXRob2RTaGlwLnRpdGxlICsgXCIgLSBcIiArIG1ldGhvZFNoaXAubmFtZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNoZWNrb3V0X2luZm8ubWV0aG9kU2hpcCA9IG1ldGhvZFNoaXA7XHJcblxyXG4gICAgICAgICAgICAgICAgY2hlY2tvdXRfaW5mby5tZXRob2RTaGlwVGV4dCA9IENhcnRTZXJ2aWNlLmNvbnZlcnRNb25leSgwLCBcIixcIiwgXCIuXCIsIGNoZWNrb3V0X2luZm8ubWV0aG9kU2hpcC5wcmljZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tvdXRfaW5mby5tZXRob2RTaGlwLnByaWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tvdXRfaW5mby5ncmFuZFRvdGFsID0gQ2FydFNlcnZpY2UuY29udmVydE1vbmV5KDAsIFwiLFwiLCBcIi5cIiwgKGNoZWNrb3V0X2luZm8udG90YWwgKyBjaGVja291dF9pbmZvLm1ldGhvZFNoaXAucHJpY2UpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrb3V0X2luZm8uZ3JhbmRUb3RhbCA9IENhcnRTZXJ2aWNlLmNvbnZlcnRNb25leSgwLCBcIixcIiwgXCIuXCIsIGNoZWNrb3V0X2luZm8udG90YWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0T3JkZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FydCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgY2FydFtpXS5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgY2FydFtpXS5ocmVmO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjYXJ0W2ldLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNhcnRbaV0ucHJpY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNhcnRbaV0ucHJpY2VfbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjYXJ0W2ldLnRodW1iO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjYXJ0W2ldLmFkZGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjYXJ0W2ldW1wiJGluZGV4XCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjYXJ0W2ldW1wiJCRoYXNoS2V5XCJdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIG5hbWVfb2JqID0gY2hlY2tvdXRfaW5mby5uYW1lLnNwbGl0KFwiIFwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBmaXJzdF9uYW1lID0gbmFtZV9vYmpbMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgbGFzdF9uYW1lX2FyciA9IG5hbWVfb2JqLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhc3RfbmFtZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RfbmFtZV9hcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXN0X25hbWUgKz0gbGFzdF9uYW1lX2FycltpXSArIFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICRodHRwLmdldChcImh0dHA6Ly9zaG9wMTBrLnFybWFydGRlbW8uaW5mby93ZWJfYXBpLnBocD9yPWd1ZXN0Jm9yZGVyPXRydWUmcHJvZHVjdHM9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY2FydCkpICsgXCImcGF5bWVudD1iYW5rdHJhbnNmZXImc2hpcHBpbmc9XCIgKyBjaGVja291dF9pbmZvLm1ldGhvZFNoaXAudHlwZSArIFwiJmxhc3RuYW1lPVwiICsgbGFzdF9uYW1lICsgXCImZmlyc3RuYW1lPVwiICsgZmlyc3RfbmFtZSArIFwiJnBvc3Rjb2RlPTcwMDAwJmNpdHk9XCIgKyBjaGVja291dF9pbmZvLmNpdHkgKyBcIiZyZWdpb249XCIgKyBjaGVja291dF9pbmZvLmRpc3RyaWN0ICsgXCImc3RyZWV0PVwiICsgY2hlY2tvdXRfaW5mby5hZGRyZXNzICsgXCImdGVsZXBob25lPVwiICsgY2hlY2tvdXRfaW5mby5waG9uZSArIFwiXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwLmRhdGEuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcC5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyZXNwLmRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlcnIuc3RhdHVzIHdpbGwgY29udGFpbiB0aGUgc3RhdHVzIGNvZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRVJSJywgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdFUlIgJyArIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnN1Y2Nlc3MgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oZm4pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5lcnJvciA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihudWxsLCBmbik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBjaGVja291dEluZm86IGNoZWNrb3V0X2luZm8sXHJcblxyXG4gICAgICAgICAgICBzaGlwcGluZ0luZm86IGdldF9zaGlwcGluZ19tZXRob2QsXHJcblxyXG4gICAgICAgICAgICBwYXltZW50SW5mbzogcGF5bWVudF9tZXRob2RcclxuICAgICAgICB9XHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcbnJlcXVpcmUoJy4vaG9tZV9jb250cm9sbGVyJyk7XHJcbnJlcXVpcmUoJy4uLy4vdXNlci91c2VyJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2hvbWUnLCBbJ2FwcC5zZXJ2aWNlJywgJ3VzZXInLCBcImhvbWUuY29udHJvbGxlclwiXSk7XHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiaG9tZS5jb250cm9sbGVyXCIsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJIb21lQ29udHJvbGxlclwiLCBbJyRzY29wZScsICdMb2dpblNlcnZpY2UnLCckbG9jYWxzdG9yYWdlJywnJHN0YXRlJywnQ29udHJvbE1vZGFsU2VydmljZScsJyR0aW1lb3V0JywnVXNlclNlcnZpY2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIExvZ2luU2VydmljZSwgJGxvY2Fsc3RvcmFnZSwgJHN0YXRlLCBDb250cm9sTW9kYWxTZXJ2aWNlLCAkdGltZW91dCwgVXNlclNlcnZpY2UpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjdXJyZW50X3VzZXJcIik7XHJcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBpZighVXNlclNlcnZpY2UuaXNMb2dpbigpKXtcclxuICAgICAgICAgICAgICAgICAgICBDb250cm9sTW9kYWxTZXJ2aWNlLnNob3coJ2pzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luLmh0bWwnLCAnUmVnaXN0ZXJMb2dpbkNvbnRyb2xsZXInLCAxKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5wcm9kdWN0cycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCAyMDAwKTtcclxuXHJcblxyXG4gICAgICAgICAgICAkc2NvcGUubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gZG8geW91ciAkKCkgc3R1ZmYgaGVyZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1dKTsiLCJcInVzZSBzdHJpY3RcIlxyXG5yZXF1aXJlKFwiLi9tZW51X2NvbnRyb2xsZXJcIik7XHJcbnJlcXVpcmUoJy4uLy4vdXNlci91c2VyJyk7XHJcbnJlcXVpcmUoXCIuLi8uL3Byb2R1Y3RzL3Byb2R1Y3RzXCIpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwibWVudVwiLCBbJ2FwcC5zZXJ2aWNlJywgJ3VzZXInLCBcInByb2R1Y3RzXCIsIFwibWVudS5jb250cm9sbGVyXCJdKVxyXG4gICAgLmNvbmZpZyhmdW5jdGlvbiAoJGlvbmljQ29uZmlnUHJvdmlkZXIpIHtcclxuICAgICAgICAkaW9uaWNDb25maWdQcm92aWRlci5iYWNrQnV0dG9uLnByZXZpb3VzVGl0bGVUZXh0KGZhbHNlKS50ZXh0KCcnKTtcclxuICAgIH0pOyIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwibWVudS5jb250cm9sbGVyXCIsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJNZW51Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckaW9uaWNTaWRlTWVudURlbGVnYXRlJywgJ1Byb2R1Y3RTZXJ2aWNlJywgJyRzdGF0ZScsICdDb250cm9sTW9kYWxTZXJ2aWNlJywgJyRsb2NhbHN0b3JhZ2UnLCAnVXNlclNlcnZpY2UnLCckaW9uaWNTY3JvbGxEZWxlZ2F0ZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgUHJvZHVjdFNlcnZpY2UsICRzdGF0ZSwgQ29udHJvbE1vZGFsU2VydmljZSwgJGxvY2Fsc3RvcmFnZSwgVXNlclNlcnZpY2UsICRpb25pY1Njcm9sbERlbGVnYXRlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS53aXNobGlzdE51bWJlciA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIikubGVuZ3RoO1xyXG4gICAgICAgICAgICAkc2NvcGUuY2FydE51bWJlciA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKS5sZW5ndGg7XHJcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gVXNlclNlcnZpY2UuY3VycmVudFVzZXI7XHJcbiAgICAgICAgICAgIFVzZXJTZXJ2aWNlLmlzTG9naW4oKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0b1N0YXRlLm5hbWUgPT0gXCJtZW51LnByb2R1Y3RzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2hvd1Byb2R1Y3RCYWNrQnRuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2hvd1Byb2R1Y3RCYWNrQnRuID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdXaXNobGlzdFVwZGF0ZScsIGZ1bmN0aW9uIChldmVudCwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLndpc2hsaXN0TnVtYmVyID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJ3aXNobGlzdFwiKS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignQ2FydFVwZGF0ZScsIGZ1bmN0aW9uIChldmVudCwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNhcnROdW1iZXIgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIikubGVuZ3RoO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5maWx0ZXJUeXBlID0gW1xyXG4gICAgICAgICAgICAgICAge3R5cGU6IFwibmV3XCIsIG5hbWU6ICdT4bqjbiBwaOG6qW0gbeG7m2knfSxcclxuICAgICAgICAgICAgICAgIHt0eXBlOiBcInByb21vXCIsIG5hbWU6ICdT4bqjbiBwaOG6qW0ga2h1eeG6v24gbcOjaSd9LFxyXG4gICAgICAgICAgICAgICAge3R5cGU6IFwicHJpY2U1MGtcIiAsIG5hbWU6ICdEdW9pIDUwLjAwMCd9LFxyXG4gICAgICAgICAgICAgICAge3R5cGU6IFwicHJpY2UxMDBrXCIgLCBuYW1lOiAnNTAuMDAwIGRlbiAxMDAuMDAwJ30sXHJcbiAgICAgICAgICAgICAgICB7dHlwZTogXCJwcmljZTIwMGtcIiAsIG5hbWU6ICcxMDAuMDAwIGRlbiAyMDAuMDAwJ30sXHJcbiAgICAgICAgICAgICAgICB7dHlwZTogXCJwcmljZTIwMHVwXCIgLCBuYW1lOiAnVHJlbiAyMDAuMDAwJ31cclxuICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5vcGVuTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUudG9nZ2xlTGVmdCgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignQ2xvc2VPcmRlcicsIGZ1bmN0aW9uIChldmVudCwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnR5cGUgPSBQcm9kdWN0U2VydmljZS5nZXRUeXBlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmdldFByb2R1Y3RzID0gZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS50eXBlID0gdHlwZTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcIm1lbnUucHJvZHVjdHNcIik7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNTY3JvbGxEZWxlZ2F0ZS5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLnNldFR5cGUodHlwZSk7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5zZXRQYWdlKDEpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UudXBkYXRlTG9hZG1vcmUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5maWx0ZXJQcm9kdWN0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jb250YWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgQ29udHJvbE1vZGFsU2VydmljZS5zaG93KCdqcy9tb2R1bGVzL2NvbnRhY3QvY29udGFjdC5odG1sJywgJ0NvbnRhY3RDb250cm9sbGVyJywgMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5zaG93X2NhcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJtZW51LmNhcnRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS51c2VyX2luZm8gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJtZW51LnVzZXJcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS50b19sb2dpbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIENvbnRyb2xNb2RhbFNlcnZpY2Uuc2hvdygnanMvbW9kdWxlcy9yZWdpc3RlckxvZ2luL3JlZ2lzdGVyTG9naW4uaHRtbCcsICdSZWdpc3RlckxvZ2luQ29udHJvbGxlcicsIDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2lnbm91dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIFVzZXJTZXJ2aWNlLnNpZ25PdXQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmdldFByb2R1Y3RzKFwibmV3XCIpO1xyXG4gICAgICAgIH1cclxuICAgIF0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcInByb2R1Y3QuY29udHJvbGxlclwiLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ3NwaW5uZXJPbkxvYWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUubG9hZGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmJpbmQoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbiAgICAuY29udHJvbGxlcihcIlByb2R1Y3RDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJ1Byb2R1Y3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsICdXaXNobGlzdFNlcnZpY2UnLCAnJGh0dHAnLCAnQ29udHJvbE1vZGFsU2VydmljZScsICckaW9uaWNTbGlkZUJveERlbGVnYXRlJywgJ0NhcnRTZXJ2aWNlJywgJyRsb2NhbHN0b3JhZ2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIFByb2R1Y3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMsIFdpc2hsaXN0U2VydmljZSwgJGh0dHAsIENvbnRyb2xNb2RhbFNlcnZpY2UsICRpb25pY1NsaWRlQm94RGVsZWdhdGUsIENhcnRTZXJ2aWNlLCAkbG9jYWxzdG9yYWdlKSB7XHJcbiAgICAgICAgICAgIHZhciBsaW5rX2FqYXggPSBcImh0dHA6Ly9zaG9wMTBrLnFybWFydGRlbW8uaW5mby9hcGkvcmVzdC9wcm9kdWN0c1wiO1xyXG4gICAgICAgICAgICB2YXIgbGlua19hamF4X25ldyA9IFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL3dlYl9hcGkucGhwXCI7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUucHJvZHVjdCA9IHt9O1xyXG4gICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmdldEtleVRpbWUoKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKG1kNWtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXhfbmV3ICsgXCI/cj1wcm9kdWN0JmlkPVwiICsgJHN0YXRlUGFyYW1zLmlkICsgXCIma2V5PVwiICsgbWQ1a2V5KS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXAucHVzaChyZXNwLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnVwZGF0ZUFycmF5KHRlbXAsICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKSwgXCJhZGRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS51cGRhdGVBcnJheSh0ZW1wLCAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcIndpc2hsaXN0XCIpLCBcImxpa2VcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJvZHVjdC5kZXRhaWwgPSB0ZW1wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJvZHVjdC5kZXRhaWxbXCJ0aHVtYlwiXSA9ICRzY29wZS5wcm9kdWN0LmRldGFpbC5pbWFnZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJGh0dHAuZ2V0KGxpbmtfYWpheCArIFwiL1wiICsgJHN0YXRlUGFyYW1zLmlkICsgXCIvaW1hZ2VzXCIgKyBcIj9rZXk9XCIgKyBtZDVrZXkpLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3QuaW1hZ2VzID0gcmVzcC5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlU2xpZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXggKyBcIi9cIiArICRzdGF0ZVBhcmFtcy5pZCArIFwiL2NhdGVnb3JpZXNcIiArIFwiP2tleT1cIiArIG1kNWtleSkudGhlbihmdW5jdGlvbiAoY2F0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9kdWN0LmNhdGVnb3J5ID0gY2F0LmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXggKyBcIj9jYXRlZ29yeV9pZD1cIiArICRzY29wZS5wcm9kdWN0LmNhdGVnb3J5WzBdLmNhdGVnb3J5X2lkICsgXCIma2V5PVwiICsgbWQ1a2V5KS50aGVuKGZ1bmN0aW9uIChyZWxhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9kdWN0LnJlbGF0ZWQgPSByZWxhdGUuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIClcclxuXHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVTbGlkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNTbGlkZUJveERlbGVnYXRlLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkVG9XaXNobGlzdCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBXaXNobGlzdFNlcnZpY2UuYWRkV2lzaGxpc3QoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hZGRfdG9fY2FydCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBDYXJ0U2VydmljZS5hZGRDYXJ0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY2hvb3NlUHJvZHVjdE9wdGlvbiA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBDb250cm9sTW9kYWxTZXJ2aWNlLnNob3coJ2pzL21vZHVsZXMvY2FydC9jYXJ0Lmh0bWwnLCAnQ2FydENvbnRyb2xsZXInLCAxLCBpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNsaWNrQ29uZmlnID0ge1xyXG4gICAgICAgICAgICAgICAgYXV0b3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGF1dG9wbGF5U3BlZWQ6IDEwMDAsXHJcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDMsXHJcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMyxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDoge31cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XSk7XHJcblxyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5yZXF1aXJlKFwiLi9wcm9kdWN0c19mYWN0b3J5LmpzXCIpO1xyXG5yZXF1aXJlKFwiLi9wcm9kdWN0c19jb250cm9sbGVyLmpzXCIpO1xyXG5yZXF1aXJlKFwiLi9wcm9kdWN0X2NvbnRyb2xsZXIuanNcIik7XHJcbnJlcXVpcmUoJy4uLy4vd2lzaGxpc3Qvd2lzaGxpc3Rfc2VydmljZS5qcycpO1xyXG5yZXF1aXJlKCcuLi8uL2NhcnQvY2FydF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwcm9kdWN0c1wiLCBbJ2FwcC5zZXJ2aWNlJywgJ3dpc2hsaXN0LnNlcnZpY2UnLCAnY2FydC5zZXJ2aWNlcycsIFwicHJvZHVjdHMuZmFjdG9yeVwiLCBcInByb2R1Y3RzLmNvbnRyb2xsZXJcIiwgXCJwcm9kdWN0LmNvbnRyb2xsZXJcIl0pXHJcbiAgICAuY29uZmlnKGZ1bmN0aW9uICgkaW9uaWNDb25maWdQcm92aWRlcikge1xyXG4gICAgICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLmJhY2tCdXR0b24ucHJldmlvdXNUaXRsZVRleHQoZmFsc2UpLnRleHQoJycpO1xyXG4gICAgfSk7IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwcm9kdWN0cy5jb250cm9sbGVyXCIsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJQcm9kdWN0c0NvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZScsICdQcm9kdWN0U2VydmljZScsICdDb250cm9sTW9kYWxTZXJ2aWNlJywgJ1dpc2hsaXN0U2VydmljZScsICdDYXJ0U2VydmljZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgUHJvZHVjdFNlcnZpY2UsIENvbnRyb2xNb2RhbFNlcnZpY2UsIFdpc2hsaXN0U2VydmljZSwgQ2FydFNlcnZpY2UpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3RzID0gUHJvZHVjdFNlcnZpY2UucHJvZHVjdEN1cnJlbnQ7XHJcbiAgICAgICAgICAgIENhcnRTZXJ2aWNlLnNldENhcnROdW1iZXIoKTtcclxuICAgICAgICAgICAgJHNjb3BlLmNhcnROdW1iZXIgPSBDYXJ0U2VydmljZS5nZXRDYXJ0TnVtYmVyKCk7XHJcbiAgICAgICAgICAgICRzY29wZS50b3RhbCA9IENhcnRTZXJ2aWNlLmNvbnZlcnRNb25leSgwLCBcIixcIiwgXCIuXCIsIENhcnRTZXJ2aWNlLnN1bUNhcnQoKSk7XHJcbiAgICAgICAgICAgICRzY29wZS5sb2FkTW9yZSA9IFByb2R1Y3RTZXJ2aWNlLmxvYWRNb3JlO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wZW5NZW51ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS50b2dnbGVMZWZ0KCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUubG9hZE1vcmVEYXRhID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYoJHNjb3BlLmxvYWRNb3JlWzBdKXtcclxuLy8gICAgICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmluaXQoOSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gUHJvZHVjdFNlcnZpY2UuZ2V0UGFnZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXAgPT0gMSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLnNldFBhZ2UoMik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmZpbHRlclByb2R1Y3QoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kYnJvYWRjYXN0KCdzY3JvbGwuaW5maW5pdGVTY3JvbGxDb21wbGV0ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5zZXRQYWdlKCsrZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLnVwZGF0ZUxvYWRtb3JlKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hZGRfdG9fY2FydCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBDYXJ0U2VydmljZS5hZGRDYXJ0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkVG9XaXNobGlzdCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBXaXNobGlzdFNlcnZpY2UuYWRkV2lzaGxpc3QoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kb24oJ0NhcnRVcGRhdGUnLCBmdW5jdGlvbiAoZXZlbnQsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jYXJ0TnVtYmVyID0gQ2FydFNlcnZpY2UuZ2V0Q2FydE51bWJlcigpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gQ2FydFNlcnZpY2UuY29udmVydE1vbmV5KDAsIFwiLFwiLCBcIi5cIiwgQ2FydFNlcnZpY2Uuc3VtQ2FydCgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgXSk7XHJcbiIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwicHJvZHVjdHMuZmFjdG9yeVwiLCBbXSlcclxuICAgIC5mYWN0b3J5KCdQcm9kdWN0U2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGh0dHAsICRsb2NhbHN0b3JhZ2UsICRpb25pY0xvYWRpbmcsICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgcHJvZHVjdHMgPSBbXTtcclxuICAgICAgICB2YXIgZmlsdGVyID0ge1xyXG4gICAgICAgICAgICBsaW1pdDogMjAsXHJcbiAgICAgICAgICAgIHR5cGU6ICcnXHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgaXNMb2FkTW9yZSA9IFtdO1xyXG4gICAgICAgIHZhciBjdXJyZW50X2luZGV4ID0gMDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkX3Byb2R1Y3QoZGF0YSkge1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSAkLm1hcChkYXRhLCBmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW3ZhbHVlXTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gYXJyYXkubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RzW2N1cnJlbnRfaW5kZXhdID0gYXJyYXlbaV07XHJcbi8vICAgICAgICAgICAgICBwcm9kdWN0cy5wdXNoKGFycmF5W2ldKTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRfaW5kZXgrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJue1xyXG4gICAgICAgICAgICBmaWx0ZXJQcm9kdWN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGZpbHRlci5saW1pdCA9IDIwO1xyXG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlci5wYWdlID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyUHJvZHVjdHMoKTtcclxuICAgICAgICAgICAgICAgICAgICAkaW9uaWNMb2FkaW5nLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ0xvYWRpbmcuLi4nXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyLmxpbWl0ID0gMjA7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5nZXRLZXlUaW1lKCkudGhlbihcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihtZDVrZXkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGlua19hamF4ID0gXCJodHRwOi8vc2hvcDEway5xcm1hcnRkZW1vLmluZm8vYXBpL3Jlc3QvcHJvZHVjdHNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGh0dHAuZ2V0KFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL3dlYl9hcGkucGhwP3I9XCIgKyBmaWx0ZXIudHlwZSArIFwiJmxpbWl0PVwiICsgZmlsdGVyLmxpbWl0ICsgXCImcGFnZT1cIiArIGZpbHRlci5wYWdlICsgXCIma2V5PVwiICsgbWQ1a2V5KS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3AuZGF0YS5FcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZF9wcm9kdWN0KHJlc3AuZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnVwZGF0ZUFycmF5KHByb2R1Y3RzLCAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIiksIFwiYWRkZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS51cGRhdGVBcnJheShwcm9kdWN0cywgJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJ3aXNobGlzdFwiKSwgXCJsaWtlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGZpbHRlci5wYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGZpbHRlci5wYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXJyLnN0YXR1cyB3aWxsIGNvbnRhaW4gdGhlIHN0YXR1cyBjb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFUlInLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdFUlIgJyArIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoXCJ3cm9uZyBrZXlcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldFBhZ2U6IGZ1bmN0aW9uIChudW1iZXIpIHtcclxuICAgICAgICAgICAgICAgIGZpbHRlci5wYWdlID0gbnVtYmVyO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0VHlwZTogZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGZpbHRlci50eXBlID0gdHlwZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldFR5cGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIudHlwZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldFBhZ2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIucGFnZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEluZGV4OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudF9pbmRleDtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZEF0dHJpYnV0ZTogZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHByb2R1Y3RzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2R1Y3RzW2ldLmVudGl0eV9pZCA9PSBpdGVtLmVudGl0eV9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0c1tpXVtpbmRleF0gPSBpdGVtW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICB1cGRhdGVMb2FkbW9yZSA6IGZ1bmN0aW9uKGxvYWQpe1xyXG4gICAgICAgICAgICAgICAgaXNMb2FkTW9yZVswXSA9IGxvYWQ7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBjbGVhclByb2R1Y3RzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0cy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudF9pbmRleCA9IDA7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAobnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bWJlcjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibG9hZGluZ1wiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBmaWx0ZXIgOiBmaWx0ZXIsXHJcblxyXG4gICAgICAgICAgICBsb2FkTW9yZSA6IGlzTG9hZE1vcmUsXHJcblxyXG4gICAgICAgICAgICBwcm9kdWN0Q3VycmVudDogcHJvZHVjdHNcclxuICAgICAgICB9XHJcbiAgICB9XHJcbilcclxuOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vdXNlcl9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4vdXNlcl9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoXCIuLi8uL3Byb2R1Y3RzL3Byb2R1Y3RzXCIpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwidXNlclwiLCBbJ2FwcC5zZXJ2aWNlJywgIFwicHJvZHVjdHNcIiwgJ3VzZXIuc2VydmljZScsICd1c2VyLmNvbnRyb2xsZXInXSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgndXNlci5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIlVzZXJDb250cm9sbGVyXCIsIFsnJHNjb3BlJywnVXNlclNlcnZpY2UnLCckaW9uaWNQb3B1cCcsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgVXNlclNlcnZpY2UsICRpb25pY1BvcHVwKSB7XHJcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gVXNlclNlcnZpY2UuY3VycmVudFVzZXI7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlVXNlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBVc2VyU2VydmljZS51cGRhdGVVc2VyKCRzY29wZS51c2VyKTtcclxuICAgICAgICAgICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQ+G6rXAgbmjhuq10IHRow6BuaCBjw7RuZycsXHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdUaMO0bmcgdGluIGPhu6dhIGLhuqFuIMSRw6MgxJHGsOG7o2MgdGhheSDEkeG7lWknXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIF0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ3VzZXIuc2VydmljZScsIFtdKVxyXG4gICAgLnNlcnZpY2UoJ1VzZXJTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkbG9jYWxzdG9yYWdlLCBQcm9kdWN0U2VydmljZSwgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHZhciBjdXJyZW50X3VzZXIgPSB7XHJcbiAgICAgICAgICAgIHBvcnRyYWl0OiBcImltZy9wb3J0cmFpdC5qcGdcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRVc2VyIDogY3VycmVudF91c2VyLFxyXG5cclxuICAgICAgICAgICAgaXNMb2dpbiA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXNlciA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwidXNlclwiKTtcclxuICAgICAgICAgICAgICAgIGlmKHVzZXIubG9naW4pe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVXNlcih1c2VyKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgdXBkYXRlVXNlciA6IGZ1bmN0aW9uKGluZm8pe1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpIGluIGluZm8pe1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRfdXNlcltpXSA9IGluZm9baV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRVc2VyIDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50X3VzZXI7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzaWduT3V0IDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRfdXNlci5sb2dpbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsKFwidXNlclwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE51bGwoXCJjYXJ0XCIpO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsKFwid2lzaGxpc3RcIik7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5zZXRQYWdlKDEpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuZmlsdGVyUHJvZHVjdCgpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiQ2FydFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIldpc2hsaXN0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgbG9naW4gOiBmdW5jdGlvbih1c2VyKXtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgaW4gdXNlcil7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudF91c2VyW2ldID0gdXNlcltpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1cnJlbnRfdXNlci5sb2dpbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE9iamVjdChcInVzZXJcIiwgY3VycmVudF91c2VyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE51bGwoXCJjYXJ0XCIpO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsKFwid2lzaGxpc3RcIik7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5zZXRQYWdlKDEpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuZmlsdGVyUHJvZHVjdCgpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiQ2FydFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIldpc2hsaXN0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi93aXNobGlzdF9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4vd2lzaGxpc3Rfc2VydmljZS5qcycpO1xyXG5yZXF1aXJlKCcuLi8uL3Byb2R1Y3RzL3Byb2R1Y3RzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJ3aXNobGlzdFwiLCBbJ2FwcC5zZXJ2aWNlJywgJ3Byb2R1Y3RzJywgJ3dpc2hsaXN0LnNlcnZpY2UnLCAnd2lzaGxpc3QuY29udHJvbGxlciddKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCd3aXNobGlzdC5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIldpc2hsaXN0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckbG9jYWxzdG9yYWdlJywnV2lzaGxpc3RTZXJ2aWNlJywnJHN0YXRlJywnQ2FydFNlcnZpY2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhbHN0b3JhZ2UsIFdpc2hsaXN0U2VydmljZSwgJHN0YXRlLCBDYXJ0U2VydmljZSkge1xyXG4vLyAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbEFsbCgpO1xyXG4gICAgICAgICAgICAkc2NvcGUud2lzaGxpc3ROdW1iZXIgPSBXaXNobGlzdFNlcnZpY2Uud2lzaGxpc3ROdW1iZXI7XHJcbiAgICAgICAgICAgICRzY29wZS53aXNobGlzdCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIik7XHJcbiAgICAgICAgICAgICRzY29wZS5sZW5ndGhXaXNobGlzdCA9ICRzY29wZS53aXNobGlzdC5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUucmVtb3ZlRnJvbVdpc2hsaXN0ID0gZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgICBXaXNobGlzdFNlcnZpY2UucmVtb3ZlV2lzaGxpc3QoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUud2lzaGxpc3QgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcIndpc2hsaXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxlbmd0aFdpc2hsaXN0ID0gJHNjb3BlLndpc2hsaXN0Lmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFkZF90b19jYXJ0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIENhcnRTZXJ2aWNlLmFkZENhcnQoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnd2lzaGxpc3Quc2VydmljZScsIFtdKVxyXG4gICAgLnNlcnZpY2UoJ1dpc2hsaXN0U2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGxvY2Fsc3RvcmFnZSwgJHJvb3RTY29wZSwgUHJvZHVjdFNlcnZpY2UpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhZGRXaXNobGlzdCA6IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgaWYoIWl0ZW0ubGlrZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5saWtlID0gIWl0ZW0ubGlrZTtcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZE9iamVjdChcIndpc2hsaXN0XCIsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuYWRkQXR0cmlidXRlKFwiY2FydFwiLCBpdGVtLCBcImxpa2VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuYWRkQXR0cmlidXRlKGl0ZW0sIFwibGlrZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiV2lzaGxpc3RVcGRhdGVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlV2lzaGxpc3QoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICByZW1vdmVXaXNobGlzdCA6IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgaXRlbS5saWtlID0gIWl0ZW0ubGlrZTtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UucmVtb3ZlT2JqZWN0KFwid2lzaGxpc3RcIiwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZEF0dHJpYnV0ZShcImNhcnRcIiwgaXRlbSwgXCJsaWtlXCIpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuYWRkQXR0cmlidXRlKGl0ZW0sIFwibGlrZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJXaXNobGlzdFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9jb250YWN0X3NlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi9jb250YWN0X2NvbnRyb2xsZXIuanMnKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcImNvbnRhY3RcIiwgWydhcHAuc2VydmljZScsICdjb250YWN0LnNlcnZpY2VzJywgJ2NvbnRhY3QuY29udHJvbGxlciddKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjb250YWN0LmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiQ29udGFjdENvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAncGFyYW1ldGVycycsICckbG9jYWxzdG9yYWdlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBwYXJhbWV0ZXJzLCAkbG9jYWxzdG9yYWdlKSB7XHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3Quc2VydmljZXMnLCBbXSlcclxuICAgIC5zZXJ2aWNlKCdDb250YWN0U2VydmljZScsIGZ1bmN0aW9uICgkcSkge1xyXG5cclxuXHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdyZWdpc3RlckxvZ2luLnNlcnZpY2VzJywgW10pXHJcbiAgICAuc2VydmljZSgnTG9naW5TZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkaHR0cCwgJGxvY2Fsc3RvcmFnZSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxvZ2luVXNlcjogbG9naW5Vc2VyLFxyXG4gICAgICAgICAgICByZWdpc3RlclVzZXI6IHJlZ2lzdGVyVXNlcixcclxuICAgICAgICAgICAgZ2V0SW5mbzogZ2V0SW5mb1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBnZXRJbmZvKG9iaikge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuZ2V0S2V5VGltZSgpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAobWQ1a2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGh0dHAuZ2V0KFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL3dlYl9hcGkucGhwP3I9dXNlciZjaGVjaz1cIiArIG9iai5lbWFpbCArIFwiJnBhc3N3b3JkPVwiICsgb2JqLnBhc3N3b3JkICsgXCImZGV0YWlsPXRydWVcIiArIFwiJmtleT1cIiArIG1kNWtleSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcmVzcC5kYXRhLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHJlc3AuZGF0YS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVyci5zdGF0dXMgd2lsbCBjb250YWluIHRoZSBzdGF0dXMgY29kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRVJSJywgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgnRVJSICcgKyBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoXCJ3cm9uZyBrZXlcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBwcm9taXNlLnN1Y2Nlc3MgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihmbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcm9taXNlLmVycm9yID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4obnVsbCwgZm4pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVnaXN0ZXJVc2VyKG9iaikge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuZ2V0S2V5VGltZSgpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAobWQ1a2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGh0dHAuZ2V0KFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL3dlYl9hcGkucGhwP3I9dXNlciZyZWdpc3Rlcj10cnVlJmZpcnN0bmFtZT1cIiArIG9iai5uYW1lICsgXCImbGFzdG5hbWU9XCIgKyBvYmoubmFtZSArIFwiJnBhc3N3b3JkPVwiICsgb2JqLnBhc3N3b3JkICsgXCImZW1haWw9XCIgKyBvYmouZW1haWwgKyBcIiZrZXk9XCIgKyBtZDVrZXkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwLmRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwLmRhdGEuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwLmRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyZXNwLmRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlcnIuc3RhdHVzIHdpbGwgY29udGFpbiB0aGUgc3RhdHVzIGNvZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0VSUicsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0VSUiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KFwid3Jvbmcga2V5XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApXHJcblxyXG4gICAgICAgICAgICBwcm9taXNlLnN1Y2Nlc3MgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihmbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcm9taXNlLmVycm9yID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4obnVsbCwgZm4pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9naW5Vc2VyKG9iaikge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuZ2V0S2V5VGltZSgpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAobWQ1a2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGh0dHAuZ2V0KFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL3dlYl9hcGkucGhwP3I9dXNlciZsb2dpbj1cIiArIG9iai5lbWFpbCArIFwiJnBhc3N3b3JkPVwiICsgb2JqLnBhc3N3b3JkICsgXCIma2V5PVwiICsgbWQ1a2V5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwLmRhdGEuRVhDRVBUSU9OX0lOVkFMSURfRU1BSUxfT1JfUEFTU1dPUkQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCdXZWxjb21lICcgKyBuYW1lICsgJyEnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyZXNwLmRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0VSUiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KFwid3Jvbmcga2V5XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIHByb21pc2Uuc3VjY2VzcyA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb21pc2UuZXJyb3IgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihudWxsLCBmbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9XHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCcuL2xvZ2luX3NlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi9yZWdpc3Rlcl9sb2dpbl9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vbGF5b3V0L3VzZXIvdXNlcicpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwicmVnaXN0ZXJMb2dpblwiLCBbJ2FwcC5zZXJ2aWNlJywgJ3VzZXInLCAncmVnaXN0ZXJMb2dpbi5zZXJ2aWNlcycsICdyZWdpc3RlckxvZ2luLmNvbnRyb2xsZXInXSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgncmVnaXN0ZXJMb2dpbi5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIlJlZ2lzdGVyTG9naW5Db250cm9sbGVyXCIsIFsnJHNjb3BlJywgJ0xvZ2luU2VydmljZScsICckc3RhdGUnLCAnJGlvbmljUG9wdXAnLCAnJGxvY2Fsc3RvcmFnZScsICdVc2VyU2VydmljZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgTG9naW5TZXJ2aWNlLCAkc3RhdGUsICRpb25pY1BvcHVwLCAkbG9jYWxzdG9yYWdlLCBVc2VyU2VydmljZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlciA9IFVzZXJTZXJ2aWNlLmN1cnJlbnRfdXNlcjtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kb24oJ21vZGFsLmhpZGRlbicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5wcm9kdWN0cycpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5sb2dpbkRhdGEgPSB7fTtcclxuICAgICAgICAgICAgJHNjb3BlLnJlZ2lzdGVyRGF0YSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wZW5Mb2dpbk1vZGFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm9wZW5Nb2RhbCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY2xvc2VMb2dpbk1vZGFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5wcm9kdWN0cycpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2xvZ2luIHNlY3Rpb25cclxuICAgICAgICAgICAgJHNjb3BlLmRvUmVnaXN0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBMb2dpblNlcnZpY2UucmVnaXN0ZXJVc2VyKCRzY29wZS5yZWdpc3RlckRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlZ2lzdGVyRGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnxJDEg25nIGvDvSB0aMOgbmggY8O0bmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdWdWkgbMOybmcgxJHEg25nIG5o4bqtcCDEkeG7gyB0aeG6v3AgdOG7pWMnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfEkMSDbmcga8O9IGtow7RuZyB0aMOgbmggY8O0bmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IGRhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy9yZWdpc3RlciBzZWN0aW9uXHJcbiAgICAgICAgICAgICRzY29wZS5kb0xvZ2luID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgTG9naW5TZXJ2aWNlLmxvZ2luVXNlcigkc2NvcGUubG9naW5EYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIExvZ2luU2VydmljZS5nZXRJbmZvKCRzY29wZS5sb2dpbkRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEubmFtZSA9IGRhdGEudXNlci5mdWxsbmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmVtYWlsID0gZGF0YS51c2VyLmVtYWlsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEucGhvbmUgPSBkYXRhLnNoaXBwaW5nX2FkZHJlc3MudGVsZXBob25lX3NoaXA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5hZGRyZXNzID0gZGF0YS5zaGlwcGluZ19hZGRyZXNzLnN0cmVldF9zaGlwWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZGlzdHJpY3QgPSBkYXRhLnNoaXBwaW5nX2FkZHJlc3MuZGlzX3NoaXA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jaXR5ID0gZGF0YS5zaGlwcGluZ19hZGRyZXNzLmNpdHlfc2hpcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnBhc3N3b3JkID0gJHNjb3BlLmxvZ2luRGF0YS5wYXNzd29yZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBVc2VyU2VydmljZS5sb2dpbihkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VNb2RhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5wcm9kdWN0cycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdtZW51LnVzZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTG9naW4gZmFpbGVkIScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ1BsZWFzZSBjaGVjayB5b3VyIGNyZWRlbnRpYWxzISdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXHJcbiAgICBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xyXG4gICAgICAgIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXHJcbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvXCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvaG9tZS9ob21lLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbG9naW4nLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2xvZ2luXCIsXHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZWdpc3RlckxvZ2luQ29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvbWVudVwiLFxyXG4gICAgICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvbWVudS9tZW51Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNZW51Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudS5wcm9kdWN0cycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvcHJvZHVjdHNcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0cy5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdHNDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUucHJvZHVjdCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvcHJvZHVjdC86aWRcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LmNhcnQnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2NhcnRcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9jYXJ0L2NhcnQuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NhcnRDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUud2lzaGxpc3QnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3dpc2hsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvd2lzaGxpc3Qvd2lzaGxpc3QuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1dpc2hsaXN0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LmNoZWNrb3V0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jaGVja291dFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGVja291dENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudS5jaGVja291dF9lZGl0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jaGVja291dF9lZGl0XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXRfZWRpdC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ2hlY2tvdXRFZGl0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LnVzZXInLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3VzZXJcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC91c2VyL3VzZXIuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VzZXJDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgIH1cclxuXVxyXG47Il19
