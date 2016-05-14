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

module.export = angular.module('starter', ['ionic', 'slick', 'akoenig.deckgrid', 'ng-mfb',
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
    .factory('$localstorage', function ($window, $ionicHistory) {
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
                $state.go('menu.checkout');
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
                cartNumber = $localstorage.getObject("cart").length;
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
    .controller("CheckoutController", ['$scope', '$localstorage', 'ControlModalService', '$state','$rootScope', 'CheckoutService','UserService','ProductService',
        function ($scope, $localstorage, ControlModalService, $state, $rootScope, CheckoutService, UserService, ProductService) {
            $scope.user = UserService.currentUser;
            $scope.checkoutInfo = CheckoutService.checkoutInfo;

            var shippingInfo = CheckoutService.shippingInfo_1;

            $scope.checkoutInfo["methodShip"] = shippingInfo.A;
            $scope.checkoutInfo["methodPayment"] = CheckoutService.paymentInfo.A;

            if(UserService.isLogin()){
                CheckoutService.updateCheckoutInfo($scope.user);
            }

            $scope.checkout = function(){
                CheckoutService.setOrder();
                $localstorage.setNull("cart");
                $rootScope.$broadcast("CartUpdate");

                ProductService.setType("all");
                ProductService.setPage(1);
                ProductService.updateLoadmore(true);
                ProductService.filterProduct();

                $state.go("menu.products");
            }
        }]);
},{}],9:[function(require,module,exports){
'use strict';

module.exports = angular.module('checkoutEdit.controller', [])
    .controller("CheckoutEditController", ['$scope', '$localstorage', 'UserService', 'CheckoutService', '$state', 'CartService',
        function ($scope, $localstorage, UserService, CheckoutService, $state, CartService) {
            $scope.user = UserService.currentUser;
            $scope.shippingInfo = CheckoutService.shippingInfo_1;
            $scope.checkoutInfo = CheckoutService.checkoutInfo;

            $scope.paymentInfo = CheckoutService.paymentInfo;
            $scope.below50 = false;
            $scope.below100 = false;



            var total = CartService.sumCart();

            if (total < 50000) {
                $scope.below50 = true;
            }
            else if (total < 100000) {
                $scope.below100 = true;
            }

            $scope.updateCheckout = function () {
                CheckoutService.addShipping($scope.checkoutInfo.methodShip);
                $state.go('menu.checkout');
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

            $scope.getProducts = function (type) {
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
    .controller("ProductController", ['$scope', 'ProductService', '$stateParams', 'WishlistService', '$http', 'ControlModalService', '$ionicSlideBoxDelegate', 'CartService','$localstorage',
        function ($scope, ProductService, $stateParams, WishlistService, $http, ControlModalService, $ionicSlideBoxDelegate, CartService, $localstorage) {
            var link_ajax = "http://shop10k.qrmartdemo.info/api/rest/products";
            var link_ajax_new = "http://shop10k.qrmartdemo.info/web_api.php";
            $scope.product = {};
            $http.get(link_ajax_new + "?r=product&id=" + $stateParams.id).then(function (resp) {
                var temp = [];
                temp.push(resp.data);
                $localstorage.updateArray(temp, $localstorage.getObject("cart"),"added");
                $localstorage.updateArray(temp, $localstorage.getObject("wishlist"), "like");

                $scope.product.detail = temp;
                $scope.product.detail["thumb"] = $scope.product.detail.image;
                console.log($scope.product.detail);
            });

            $http.get(link_ajax + "/" + $stateParams.id + "/images").then(function (resp) {
                $scope.product.images = resp.data;
                $scope.updateSlider();
            });

            $http.get(link_ajax + "/" + $stateParams.id + "/categories").then(function (cat) {
                $scope.product.category = cat.data;
                $http.get(link_ajax + "?category_id=" + $scope.product.category[0].category_id).then(function (relate) {
                    $scope.product.related = relate.data;
                });
            });

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
                $scope.total = CartService.convertMoney(0, ",", ".", CartService.sumCart());
                $scope.cartNumber = CartService.getCartNumber();
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
//                products.push(array[i]);
                current_index++;
            }
        }

        return{
            filterProduct: function () {
                var deferred = $q.defer();
                var promise = deferred.promise;
//                var link_ajax = "http://liquordelivery.com.sg/wp-admin/admin-ajax.php";
//                $http.get(link_ajax + "?action=latest_products_app&filter=" + filterType + "&page=" + page_next).then(function (resp) {
                filter.limit = 20;
                if (filter.page == 1) {
                    this.clearProducts();
                    $ionicLoading.show({
                        template: 'Loading...'
                    });
                    filter.limit = 20;
                }
//                var link_ajax = "http://shop10k.qrmartdemo.info/api/rest/products";
//                $http.get(link_ajax + "?page=" + filter.page + "&limit="+ filter.limit +"&order=entity_id&dir=dsc").then(function (resp) {

                var link_ajax = "http://shop10k.qrmartdemo.info/api/rest/products";
                $http.get("http://shop10k.qrmartdemo.info/web_api.php?r=" + filter.type + "&limit=" + filter.limit + "&page=" + filter.page).then(function (resp) {
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
                return promise;
            },

            setPage: function (number) {
                filter.page = number;
            },

            setType: function (type) {
                filter.type = type;
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
    .controller("UserController", ['$scope','UserService',
        function ($scope, UserService) {
            $scope.user = UserService.currentUser;

            $scope.updateUser = function(){
                UserService.updateUser($scope.user);
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
    .service('LoginService', function ($q, $http) {
        return {
            loginUser: loginUser,
            registerUser: registerUser,
            getInfo: getInfo
        }
        function getInfo(obj){
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get("http://shop10k.qrmartdemo.info/web_api.php?r=user&check=" + obj.email + "&password=" + obj.password + "&detail=true")
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
        }

        function registerUser(obj) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get("http://shop10k.qrmartdemo.info/web_api.php?r=user&register=true&firstname=" + obj.name + "&lastname=" + obj.name + "&password=" + obj.password + "&email=" + obj.email)
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

            $http.get("http://shop10k.qrmartdemo.info/web_api.php?r=user&login=" + obj.email + "&password=" + obj.password)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIi4vd3d3L2pzL2FwcC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvYXBwLW1haW4uanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2FwcF9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2FydC9jYXJ0LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2FydC9jYXJ0X2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9jYXJ0L2NhcnRfc2VydmljZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXRfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0X2VkaXRfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0X3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9ob21lL2hvbWUuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9ob21lL2hvbWVfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L21lbnUvbWVudS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L21lbnUvbWVudV9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdF9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHMuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0c19jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHNfZmFjdG9yeS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3VzZXIvdXNlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3VzZXIvdXNlcl9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvdXNlci91c2VyX3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC93aXNobGlzdC93aXNobGlzdC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3dpc2hsaXN0L3dpc2hsaXN0X2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC93aXNobGlzdC93aXNobGlzdF9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL2NvbnRhY3QvY29udGFjdC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9jb250YWN0L2NvbnRhY3RfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9jb250YWN0L2NvbnRhY3Rfc2VydmljZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9yZWdpc3RlckxvZ2luL2xvZ2luX3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJfbG9naW5fY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvcm91dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vbW9kdWxlIG5vZGVcclxuLy9yZXF1aXJlKFwiYW5ndWxhclwiKTtcclxuXHJcbi8vbW9kdWxlIGZ1bmN0aW9uc1xyXG5yZXF1aXJlKFwiLi9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJMb2dpblwiKTtcclxucmVxdWlyZShcIi4vbW9kdWxlcy9jb250YWN0L2NvbnRhY3RcIik7XHJcbi8vbW9kdWxlIGxheW91dFxyXG5yZXF1aXJlKFwiLi9sYXlvdXQvaG9tZS9ob21lXCIpO1xyXG5yZXF1aXJlKFwiLi9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHNcIik7XHJcbnJlcXVpcmUoXCIuL2xheW91dC9tZW51L21lbnVcIik7XHJcbnJlcXVpcmUoXCIuL2xheW91dC9jYXJ0L2NhcnRcIik7XHJcbnJlcXVpcmUoXCIuL2xheW91dC9jaGVja291dC9jaGVja291dFwiKTtcclxucmVxdWlyZShcIi4vbGF5b3V0L3dpc2hsaXN0L3dpc2hsaXN0XCIpO1xyXG5yZXF1aXJlKFwiLi9sYXlvdXQvdXNlci91c2VyXCIpO1xyXG5yZXF1aXJlKFwiLi9hcHBfc2VydmljZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnQgPSBhbmd1bGFyLm1vZHVsZSgnc3RhcnRlcicsIFsnaW9uaWMnLCAnc2xpY2snLCAnYWtvZW5pZy5kZWNrZ3JpZCcsICduZy1tZmInLFxyXG4gICAgICAgIC8vZnVuY3Rpb25zXHJcbiAgICAgICAgJ3JlZ2lzdGVyTG9naW4nLFxyXG4gICAgICAgICdjb250YWN0JyxcclxuXHJcbiAgICAgICAgLy9sYXlvdXRcclxuICAgICAgICAnaG9tZScsXHJcbiAgICAgICAgJ21lbnUnLFxyXG4gICAgICAgICdwcm9kdWN0cycsXHJcbiAgICAgICAgJ2NhcnQnLFxyXG4gICAgICAgICdjaGVja291dCcsXHJcbiAgICAgICAgJ3dpc2hsaXN0JyxcclxuICAgICAgICAndXNlcicsXHJcblxyXG4gICAgICAgICdhcHAuc2VydmljZScsXHJcblxyXG4gICAgXSlcclxuICAgIC5jb25maWcocmVxdWlyZSgnLi9yb3V0ZXInKSlcclxuICAgIC5ydW4ocmVxdWlyZSgnLi9hcHAtbWFpbicpKTtcclxuXHJcblxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5mdW5jdGlvbiBBcHBNYWluKCRpb25pY1BsYXRmb3JtLCAkc3RhdGUpe1xyXG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxyXG4gICAgICAgIC8vIGZvciBmb3JtIGlucHV0cylcclxuICAgICAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZCkge1xyXG4gICAgICAgICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xyXG4gICAgICAgICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuZGlzYWJsZVNjcm9sbChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XHJcbiAgICAgICAgICAgIC8vIG9yZy5hcGFjaGUuY29yZG92YS5zdGF0dXNiYXIgcmVxdWlyZWRcclxuICAgICAgICAgICAgU3RhdHVzQmFyLnN0eWxlRGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICRpb25pY1BsYXRmb3JtLm9uKCdyZXN1bWUnLCBmdW5jdGlvbigpe1xyXG4vLyAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XHJcbiAgICB9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbJyRpb25pY1BsYXRmb3JtJywgJyRzdGF0ZScsIEFwcE1haW5dOyIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VcIiwgW10pXHJcbiAgICAuZmFjdG9yeSgnJGxvY2Fsc3RvcmFnZScsIGZ1bmN0aW9uICgkd2luZG93LCAkaW9uaWNIaXN0b3J5KSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoa2V5LCBkZWZhdWx0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8IGRlZmF1bHRWYWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldE9iamVjdDogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldE9iamVjdDogZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSB8fCAne30nKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldE51bGw6IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0T2JqZWN0KGtleSwge30pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXROdWxsQWxsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5jbGVhckNhY2hlKCk7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFySGlzdG9yeSgpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkT2JqZWN0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gbmV3IEFycmF5KHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHZhciBhcnIgPSB0aGlzLmdldE9iamVjdChrZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNoYXJlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnJbaV0uZW50aXR5X2lkID09IHZhbHVlWzBdLmVudGl0eV9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2hhcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuY29uY2F0KGFycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGFycjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldE9iamVjdChrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIG9iakFyck5lZWRVcGRhdGUgOiBpcyBhbiBhcnJheSBuZWVkIHVwZGF0ZSBhZnRlciBtYWluIGFycmF5IGlzXHJcbiAgICAgICAgICAgICAqICovXHJcbiAgICAgICAgICAgIHJlbW92ZU9iamVjdDogZnVuY3Rpb24gKGtleSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IHRoaXMuZ2V0T2JqZWN0KGtleSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGFycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcnJbaV0uZW50aXR5X2lkID09IGl0ZW0uZW50aXR5X2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0T2JqZWN0KGtleSwgYXJyKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIG1lcmdlQXJyYXk6IGZ1bmN0aW9uIChhcnIxLCBhcnIyKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyMyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhcnIxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNoYXJlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gYXJyMilcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycjJbal0uZW50aXR5X2lkID09IGFycjFbaV0uZW50aXR5X2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNoYXJlZCkgYXJyMy5wdXNoKGFycjFbaV0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhcnIzID0gYXJyMy5jb25jYXQoYXJyMik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyMztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy9pbnB1dCAyIGFycmF5XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIGFycmF5IGNvbnRhaW4gYWxsIGVsZW1lbnRzIHdoaWNoIGFyZSBpbiBib3RoIGFycmF5IGFuZCB1cGRhdGUgZm9sbG93IGFycjJcclxuICAgICAgICAgICAgdXBkYXRlQXJyYXk6IGZ1bmN0aW9uIChhcnIxLCBhcnIyLCBrZXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYXJyMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gYXJyMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyMltqXS5lbnRpdHlfaWQgPT0gYXJyMVtpXS5lbnRpdHlfaWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnIxW2ldW2tleV0gPSBhcnIyW2pdW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRBdHRyaWJ1dGU6IGZ1bmN0aW9uIChrZXksIGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gdGhpcy5nZXRPYmplY3Qoa2V5KTtcclxuICAgICAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnJbaV0uZW50aXR5X2lkID09IGl0ZW0uZW50aXR5X2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJbaV1baW5kZXhdID0gaXRlbVtpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRPYmplY3Qoa2V5LCBhcnIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIC5zZXJ2aWNlKCdDb250cm9sTW9kYWxTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkaW9uaWNNb2RhbCwgJHJvb3RTY29wZSwgJHRpbWVvdXQsICRjb250cm9sbGVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2hvdzogc2hvd1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBzaG93KHRlbXBsZXRlVXJsLCBjb250cm9sbGVyLCBhdXRvc2hvdywgcGFyYW1ldGVycywgb3B0aW9ucywgd3JhcENhbHNzKSB7XHJcbiAgICAgICAgICAgIC8vIEdyYWIgdGhlIGluamVjdG9yIGFuZCBjcmVhdGUgYSBuZXcgc2NvcGVcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKSxcclxuICAgICAgICAgICAgICAgIGN0cmxJbnN0YW5jZSxcclxuICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKSxcclxuICAgICAgICAgICAgICAgIHRoaXNTY29wZUlkID0gbW9kYWxTY29wZS4kaWQsXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb246ICdzbGlkZS1pbi11cCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZm9jdXNGaXJzdElucHV0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZHJvcENsaWNrVG9DbG9zZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBoYXJkd2FyZUJhY2tCdXR0b25DbG9zZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBtb2RhbENhbGxiYWNrOiBudWxsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwodGVtcGxldGVVcmwsIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlOiBtb2RhbFNjb3BlLFxyXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBvcHRpb25zLmFuaW1hdGlvbixcclxuICAgICAgICAgICAgICAgIGZvY3VzRmlyc3RJbnB1dDogb3B0aW9ucy5mb2N1c0ZpcnN0SW5wdXQsXHJcbiAgICAgICAgICAgICAgICBiYWNrZHJvcENsaWNrVG9DbG9zZTogb3B0aW9ucy5iYWNrZHJvcENsaWNrVG9DbG9zZSxcclxuICAgICAgICAgICAgICAgIGhhcmR3YXJlQmFja0J1dHRvbkNsb3NlOiBvcHRpb25zLmhhcmR3YXJlQmFja0J1dHRvbkNsb3NlXHJcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKG1vZGFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS5tb2RhbCA9IG1vZGFsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS5tb2RhbC5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWwuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUuJG9uKCdtb2RhbC5oaWRkZW4nLCBmdW5jdGlvbiAodGhpc01vZGFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzTW9kYWwuY3VycmVudFNjb3BlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbW9kYWxTY29wZUlkID0gdGhpc01vZGFsLmN1cnJlbnRTY29wZS4kaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc1Njb3BlSWQgPT09IG1vZGFsU2NvcGVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2NsZWFudXAodGhpc01vZGFsLmN1cnJlbnRTY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSW52b2tlIHRoZSBjb250cm9sbGVyXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2FscyA9IHsgJyRzY29wZSc6IG1vZGFsU2NvcGUsICdwYXJhbWV0ZXJzJzogcGFyYW1ldGVycyB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdHJsRXZhbCA9IF9ldmFsQ29udHJvbGxlcihjb250cm9sbGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBjdHJsSW5zdGFuY2UgPSAkY29udHJvbGxlcihjb250cm9sbGVyLCBsb2NhbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdHJsRXZhbC5pc0NvbnRyb2xsZXJBcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHJsSW5zdGFuY2Uub3Blbk1vZGFsID0gbW9kYWxTY29wZS5vcGVuTW9kYWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0cmxJbnN0YW5jZS5jbG9zZU1vZGFsID0gbW9kYWxTY29wZS5jbG9zZU1vZGFsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF1dG9zaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWwuc2hvdygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS4kYnJvYWRjYXN0KCdtb2RhbC5hZnRlclNob3cnLCBtb2RhbFNjb3BlLm1vZGFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihvcHRpb25zLm1vZGFsQ2FsbGJhY2spKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubW9kYWxDYWxsYmFjayhtb2RhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBfY2xlYW51cChzY29wZSkge1xyXG4gICAgICAgICAgICBzY29wZS4kZGVzdHJveSgpO1xyXG4gICAgICAgICAgICBpZiAoc2NvcGUubW9kYWwpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLm1vZGFsLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBfZXZhbENvbnRyb2xsZXIoY3RybE5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgICAgICAgICAgIGlzQ29udHJvbGxlckFzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJOYW1lOiAnJyxcclxuICAgICAgICAgICAgICAgIHByb3BOYW1lOiAnJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB2YXIgZnJhZ21lbnRzID0gKGN0cmxOYW1lIHx8ICcnKS50cmltKCkuc3BsaXQoL1xccysvKTtcclxuICAgICAgICAgICAgcmVzdWx0LmlzQ29udHJvbGxlckFzID0gZnJhZ21lbnRzLmxlbmd0aCA9PT0gMyAmJiAoZnJhZ21lbnRzWzFdIHx8ICcnKS50b0xvd2VyQ2FzZSgpID09PSAnYXMnO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LmlzQ29udHJvbGxlckFzKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuY29udHJvbGxlck5hbWUgPSBmcmFnbWVudHNbMF07XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHJvcE5hbWUgPSBmcmFnbWVudHNbMl07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuY29udHJvbGxlck5hbWUgPSBjdHJsTmFtZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCcuL2NhcnRfc2VydmljZS5qcycpO1xyXG5yZXF1aXJlKCcuL2NhcnRfY29udHJvbGxlci5qcycpO1xyXG5yZXF1aXJlKCcuLi8uL3Byb2R1Y3RzL3Byb2R1Y3RzJyk7XHJcbnJlcXVpcmUoJy4uLy4vY2hlY2tvdXQvY2hlY2tvdXQnKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcImNhcnRcIiwgWydhcHAuc2VydmljZScsICdjaGVja291dCcsICdwcm9kdWN0cycsICdjYXJ0LnNlcnZpY2VzJywgJ2NhcnQuY29udHJvbGxlciddKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjYXJ0LmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiQ2FydENvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnJGxvY2Fsc3RvcmFnZScsICdXaXNobGlzdFNlcnZpY2UnLCAnQ2FydFNlcnZpY2UnLCdDaGVja291dFNlcnZpY2UnLCckc3RhdGUnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhbHN0b3JhZ2UsIFdpc2hsaXN0U2VydmljZSwgQ2FydFNlcnZpY2UsIENoZWNrb3V0U2VydmljZSwgJHN0YXRlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5jYXJ0bGlzdCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKTtcclxuICAgICAgICAgICAgJHNjb3BlLmxlbmd0aENhcnQgPSAkc2NvcGUuY2FydGxpc3QubGVuZ3RoO1xyXG4gICAgICAgICAgICBDYXJ0U2VydmljZS5zZXRDYXJ0TnVtYmVyKCk7XHJcbiAgICAgICAgICAgICRzY29wZS5jYXJ0TnVtYmVyID0gQ2FydFNlcnZpY2UuZ2V0Q2FydE51bWJlcigpO1xyXG4gICAgICAgICAgICAkc2NvcGUudG90YWwgPSBDYXJ0U2VydmljZS5jb252ZXJ0TW9uZXkoMCwgXCIsXCIsIFwiLlwiLCBDYXJ0U2VydmljZS5zdW1DYXJ0KCkpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFkZFRvV2lzaGxpc3QgPSBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgIFdpc2hsaXN0U2VydmljZS5hZGRXaXNobGlzdChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnJlbW92ZUZyb21DYXJ0ID0gZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgICBDYXJ0U2VydmljZS5yZW1vdmVDYXJ0KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNhcnRsaXN0ID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxlbmd0aENhcnQgPSAkc2NvcGUuY2FydGxpc3QubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNhcnROdW1iZXIgPSBDYXJ0U2VydmljZS5nZXRDYXJ0TnVtYmVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jYXJ0X2NoZWNrb3V0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIENoZWNrb3V0U2VydmljZS5zdW1Ub3RhbCgpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdtZW51LmNoZWNrb3V0Jyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kb24oJ0NhcnRVcGRhdGUnLCBmdW5jdGlvbiAoZXZlbnQsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS50b3RhbCA9IENhcnRTZXJ2aWNlLnN1bUNhcnQoKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jYXJ0TnVtYmVyID0gQ2FydFNlcnZpY2UuZ2V0Q2FydE51bWJlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVRdHkgPSBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuYWRkQXR0cmlidXRlKFwiY2FydFwiLCBpdGVtLCBcInF1YW50aXR5XCIpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gQ2FydFNlcnZpY2UuY29udmVydE1vbmV5KDAsIFwiLFwiLCBcIi5cIiwgQ2FydFNlcnZpY2Uuc3VtQ2FydCgpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnY2FydC5zZXJ2aWNlcycsIFtdKVxyXG4gICAgLnNlcnZpY2UoJ0NhcnRTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkbG9jYWxzdG9yYWdlLCAkcm9vdFNjb3BlLCBQcm9kdWN0U2VydmljZSkge1xyXG4gICAgICAgIHZhciBjYXJ0TnVtYmVyID0gMDtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhZGRDYXJ0OiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpdGVtLmFkZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FydE51bWJlcisrO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uYWRkZWQgPSAhaXRlbS5hZGRlZDtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnF1YW50aXR5ID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZE9iamVjdChcImNhcnRcIiwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5hZGRBdHRyaWJ1dGUoXCJ3aXNobGlzdFwiLCBpdGVtLCBcImFkZGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmFkZEF0dHJpYnV0ZShpdGVtLCBcImFkZGVkXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJDYXJ0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVDYXJ0KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcmVtb3ZlQ2FydDogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNhcnROdW1iZXItLTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uYWRkZWQgPSAhaXRlbS5hZGRlZDtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UucmVtb3ZlT2JqZWN0KFwiY2FydFwiLCBpdGVtKTtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuYWRkQXR0cmlidXRlKFwid2lzaGxpc3RcIiwgaXRlbSwgXCJhZGRlZFwiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5hZGRBdHRyaWJ1dGUoaXRlbSwgXCJhZGRlZFwiLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiQ2FydFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHN1bUNhcnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjYXJ0ID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRvdGFsID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gY2FydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsICs9IHBhcnNlSW50KGNhcnRbaV0ucHJpY2VfbnVtYmVyICogY2FydFtpXS5xdWFudGl0eSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdG90YWw7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBjb252ZXJ0TW9uZXkgOiBmdW5jdGlvbihjLCBkLCB0LCBudW1iZXIpe1xyXG4gICAgICAgICAgICAgICAgdmFyIG4gPSBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgYyA9IGlzTmFOKGMgPSBNYXRoLmFicyhjKSkgPyAyIDogYyxcclxuICAgICAgICAgICAgICAgICAgICBkID0gZCA9PSB1bmRlZmluZWQgPyBcIi5cIiA6IGQsXHJcbiAgICAgICAgICAgICAgICAgICAgdCA9IHQgPT0gdW5kZWZpbmVkID8gXCIsXCIgOiB0LFxyXG4gICAgICAgICAgICAgICAgICAgIHMgPSBuIDwgMCA/IFwiLVwiIDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICBpID0gcGFyc2VJbnQobiA9IE1hdGguYWJzKCtuIHx8IDApLnRvRml4ZWQoYykpICsgXCJcIixcclxuICAgICAgICAgICAgICAgICAgICBqID0gKGogPSBpLmxlbmd0aCkgPiAzID8gaiAlIDMgOiAwO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHMgKyAoaiA/IGkuc3Vic3RyKDAsIGopICsgdCA6IFwiXCIpICsgaS5zdWJzdHIoaikucmVwbGFjZSgvKFxcZHszfSkoPz1cXGQpL2csIFwiJDFcIiArIHQpICsgKGMgPyBkICsgTWF0aC5hYnMobiAtIGkpLnRvRml4ZWQoYykuc2xpY2UoMikgOiBcIlwiKSArIFwiIMSRIFwiO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0Q2FydE51bWJlciA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBjYXJ0TnVtYmVyID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpLmxlbmd0aDtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldENhcnROdW1iZXIgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhcnROdW1iZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCcuL2NoZWNrb3V0X2NvbnRyb2xsZXInKTtcclxucmVxdWlyZSgnLi9jaGVja291dF9lZGl0X2NvbnRyb2xsZXInKTtcclxucmVxdWlyZSgnLi9jaGVja291dF9zZXJ2aWNlJyk7XHJcbnJlcXVpcmUoJy4uLy4vdXNlci91c2VyJyk7XHJcbnJlcXVpcmUoXCIuLi8uL3Byb2R1Y3RzL3Byb2R1Y3RzXCIpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiY2hlY2tvdXRcIiwgWydhcHAuc2VydmljZScsICd1c2VyJywgJ3Byb2R1Y3RzJywgJ2NoZWNrb3V0LnNlcnZpY2UnLCAnY2hlY2tvdXQuY29udHJvbGxlcicsICdjaGVja291dEVkaXQuY29udHJvbGxlciddKSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NoZWNrb3V0LmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiQ2hlY2tvdXRDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRsb2NhbHN0b3JhZ2UnLCAnQ29udHJvbE1vZGFsU2VydmljZScsICckc3RhdGUnLCckcm9vdFNjb3BlJywgJ0NoZWNrb3V0U2VydmljZScsJ1VzZXJTZXJ2aWNlJywnUHJvZHVjdFNlcnZpY2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhbHN0b3JhZ2UsIENvbnRyb2xNb2RhbFNlcnZpY2UsICRzdGF0ZSwgJHJvb3RTY29wZSwgQ2hlY2tvdXRTZXJ2aWNlLCBVc2VyU2VydmljZSwgUHJvZHVjdFNlcnZpY2UpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBVc2VyU2VydmljZS5jdXJyZW50VXNlcjtcclxuICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0SW5mbyA9IENoZWNrb3V0U2VydmljZS5jaGVja291dEluZm87XHJcblxyXG4gICAgICAgICAgICB2YXIgc2hpcHBpbmdJbmZvID0gQ2hlY2tvdXRTZXJ2aWNlLnNoaXBwaW5nSW5mb18xO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0SW5mb1tcIm1ldGhvZFNoaXBcIl0gPSBzaGlwcGluZ0luZm8uQTtcclxuICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0SW5mb1tcIm1ldGhvZFBheW1lbnRcIl0gPSBDaGVja291dFNlcnZpY2UucGF5bWVudEluZm8uQTtcclxuXHJcbiAgICAgICAgICAgIGlmKFVzZXJTZXJ2aWNlLmlzTG9naW4oKSl7XHJcbiAgICAgICAgICAgICAgICBDaGVja291dFNlcnZpY2UudXBkYXRlQ2hlY2tvdXRJbmZvKCRzY29wZS51c2VyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIENoZWNrb3V0U2VydmljZS5zZXRPcmRlcigpO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsKFwiY2FydFwiKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIkNhcnRVcGRhdGVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2Uuc2V0VHlwZShcImFsbFwiKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLnNldFBhZ2UoMSk7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS51cGRhdGVMb2FkbW9yZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmZpbHRlclByb2R1Y3QoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJtZW51LnByb2R1Y3RzXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NoZWNrb3V0RWRpdC5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIkNoZWNrb3V0RWRpdENvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnJGxvY2Fsc3RvcmFnZScsICdVc2VyU2VydmljZScsICdDaGVja291dFNlcnZpY2UnLCAnJHN0YXRlJywgJ0NhcnRTZXJ2aWNlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYWxzdG9yYWdlLCBVc2VyU2VydmljZSwgQ2hlY2tvdXRTZXJ2aWNlLCAkc3RhdGUsIENhcnRTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gVXNlclNlcnZpY2UuY3VycmVudFVzZXI7XHJcbiAgICAgICAgICAgICRzY29wZS5zaGlwcGluZ0luZm8gPSBDaGVja291dFNlcnZpY2Uuc2hpcHBpbmdJbmZvXzE7XHJcbiAgICAgICAgICAgICRzY29wZS5jaGVja291dEluZm8gPSBDaGVja291dFNlcnZpY2UuY2hlY2tvdXRJbmZvO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnBheW1lbnRJbmZvID0gQ2hlY2tvdXRTZXJ2aWNlLnBheW1lbnRJbmZvO1xyXG4gICAgICAgICAgICAkc2NvcGUuYmVsb3c1MCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAkc2NvcGUuYmVsb3cxMDAgPSBmYWxzZTtcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIHRvdGFsID0gQ2FydFNlcnZpY2Uuc3VtQ2FydCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRvdGFsIDwgNTAwMDApIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5iZWxvdzUwID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0b3RhbCA8IDEwMDAwMCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmJlbG93MTAwID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUNoZWNrb3V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgQ2hlY2tvdXRTZXJ2aWNlLmFkZFNoaXBwaW5nKCRzY29wZS5jaGVja291dEluZm8ubWV0aG9kU2hpcCk7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUuY2hlY2tvdXQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjaGVja291dC5zZXJ2aWNlJywgW10pXHJcbiAgICAuZmFjdG9yeSgnQ2hlY2tvdXRTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkbG9jYWxzdG9yYWdlLCBDYXJ0U2VydmljZSwgJGh0dHApIHtcclxuICAgICAgICB2YXIgY2hlY2tvdXRfaW5mbyA9IHtcclxuICAgICAgICAgICAgdG90YWw6IDAsXHJcbiAgICAgICAgICAgIGdyYW5kVG90YWw6IDAsXHJcbiAgICAgICAgICAgIG1ldGhvZFNoaXBUZXh0OiAwLFxyXG4gICAgICAgICAgICBtZXRob2RTaGlwOiB7fVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldF9zaGlwcGluZ19tZXRob2QoKXtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xyXG5cclxuICAgICAgICAgICAgJGh0dHAuZ2V0KFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL3dlYl9hcGkucGhwP3I9c2hpcHBpbmdcIilcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwLmRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBlcnIuc3RhdHVzIHdpbGwgY29udGFpbiB0aGUgc3RhdHVzIGNvZGVcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFUlInLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgnRVJSICcgKyBlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHByb21pc2Uuc3VjY2VzcyA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb21pc2UuZXJyb3IgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihudWxsLCBmbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc2hpcHBpbmdfbWV0aG9kID0ge1xyXG4gICAgICAgICAgICBcIkFcIjoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogXCJUPyBsP3kgaMOgbmcgdD9pIGM/YSBow6BuZyAxNjQgVHI/biBCw6xuaCBUcj9uZyBRNSAtIEhDTSAwP1wiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJCXCI6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFwiUXU/biAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCAxMCwgMTEsIFTDom4gQsOsbmgsIFTDom4gUGjDuiwgUGjDuiBOaHU/biwgQsOsbmggVGg/bmgsIEfDsiBWP3BcIixcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IFwiQlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIjEgbmfDoHkgKDE1LjAwMCA/KVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogMTUwMDBcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IFwiQlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIjItMyBuZ8OgeSAoMTIuMDAwID8pXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAxMjAwMFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJDXCI6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFwiUXU/biA5LCAxMiwgQsOsbmggVMOibiwgVGg/ID8/Y1wiLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogXCJDXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiMSBuZ8OgeSAoMjUuMDAwID8pXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAyNTAwMFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogXCJDXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiMi0zIG5nw6B5ICgyMC4wMDAgPylcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDIwMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcIkRcIjoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogXCJDPyBDaGksIE5ow6AgQsOoLCBCw6xuaCBDaMOhbmgsIEjDs2MgTcO0biwgQz9uIEdpPyAoMzAuMDAwID8pXCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogMzAwMDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJFXCI6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFwiVD9uaCwgVGjDoG5oIHBoPyBuZ2/DoGkgVHAuSD8gQ2jDrSBNaW5oIChUPyB2P24gdmnDqm4gcz8gbGnDqm4gaD8gdj9pIEtIIHF1YSA/VCB0aMO0bmcgYsOhbyBwaMOtICYgdGg/aSBnaWFuIGdpYW8gaMOgbmcpXCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIHBheW1lbnRfbWV0aG9kID0ge1xyXG4gICAgICAgICAgICBcIkFcIjogXCJDYXNoIE9uIERlbGl2ZXJ5ICh0aGFuaCB0b8OhbiBraGkgbmjhuq1uIGjDoG5nKVwiLFxyXG4gICAgICAgICAgICBcIkJcIjogXCJCYW5rIFRyYW5zZmVyIFBheW1lbnQgKGNodXnhu4NuIHF1YSBuZ8OibiBow6BuZylcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHVwZGF0ZUNoZWNrb3V0SW5mbzogZnVuY3Rpb24gKGluZm8pIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gaW5mbykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrb3V0X2luZm9baV0gPSBpbmZvW2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc3VtVG90YWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNoZWNrb3V0X2luZm8udG90YWwgPSBDYXJ0U2VydmljZS5zdW1DYXJ0KCk7XHJcbiAgICAgICAgICAgICAgICBjaGVja291dF9pbmZvLnRvdGFsVGV4dCA9IENhcnRTZXJ2aWNlLmNvbnZlcnRNb25leSgwLCBcIixcIiwgXCIuXCIsIGNoZWNrb3V0X2luZm8udG90YWwpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrb3V0X2luZm8ubWV0aG9kU2hpcC52YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICBjaGVja291dF9pbmZvLmdyYW5kVG90YWwgPSBDYXJ0U2VydmljZS5jb252ZXJ0TW9uZXkoMCwgXCIsXCIsIFwiLlwiLCAoY2hlY2tvdXRfaW5mby50b3RhbCArIGNoZWNrb3V0X2luZm8ubWV0aG9kU2hpcC52YWx1ZSkpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrb3V0X2luZm8uZ3JhbmRUb3RhbCA9IENhcnRTZXJ2aWNlLmNvbnZlcnRNb25leSgwLCBcIixcIiwgXCIuXCIsIGNoZWNrb3V0X2luZm8udG90YWwpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkU2hpcHBpbmc6IGZ1bmN0aW9uIChtZXRob2RTaGlwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobWV0aG9kU2hpcC5pbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZFNoaXAudGV4dCA9IHNoaXBwaW5nX21ldGhvZFttZXRob2RTaGlwLmluZGV4XS50ZXh0ICsgXCIgLSBcIiArIG1ldGhvZFNoaXAudGV4dDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNoZWNrb3V0X2luZm8ubWV0aG9kU2hpcCA9IG1ldGhvZFNoaXA7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGVja291dF9pbmZvLm1ldGhvZFNoaXApO1xyXG4gICAgICAgICAgICAgICAgY2hlY2tvdXRfaW5mby5tZXRob2RTaGlwVGV4dCA9IENhcnRTZXJ2aWNlLmNvbnZlcnRNb25leSgwLCBcIixcIiwgXCIuXCIsIGNoZWNrb3V0X2luZm8ubWV0aG9kU2hpcC52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBjaGVja291dF9pbmZvLmdyYW5kVG90YWwgPSBDYXJ0U2VydmljZS5jb252ZXJ0TW9uZXkoMCwgXCIsXCIsIFwiLlwiLCAoY2hlY2tvdXRfaW5mby50b3RhbCArIGNoZWNrb3V0X2luZm8ubWV0aG9kU2hpcC52YWx1ZSkpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0T3JkZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FydCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL3dlYl9hcGkucGhwXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcjogXCJ1c2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrOiBcImxvbmdhbmh2bkBnbWFpbC5jb21cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IFwibG9uZ2FuaEAxMjNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3RpZDogMTcxNyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXR5OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXltZW50OiBcImJhbmt0cmFuc2ZlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlwcGluZzogXCJmbGF0cmF0ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdG5hbWU6IFwibG9uZ2FuaFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0bmFtZTogXCJkYW5nXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc3Rjb2RlOiBcIjcwMDAwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNpdHk6IFwicXVhbjVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVnaW9uOiBcImhjbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJlZXQ6IFwiMTY0IFRyYW4gQmluaCBUcm9uZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZWxlcGhvbmU6IFwiMDk4MTExMjQ1MVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKVxyXG4vLyAgICAgICAgICAgICAgICAkaHR0cC5nZXQoXCJodHRwOi8vc2hvcDEway5xcm1hcnRkZW1vLmluZm8vd2ViX2FwaS5waHA/cj11c2VyJmNoZWNrPWxvbmdhbmh2bkBnbWFpbC5jb20mcGFzc3dvcmQ9bG9uZ2FuaEAxMjMmb3JkZXI9dHJ1ZSZwcm9kdWN0aWQ9MTcxNyZxdHk9MSZwYXltZW50PWJhbmt0cmFuc2ZlciZzaGlwcGluZz1mbGF0cmF0ZSZmaXJzdG5hbWU9bG9uZ2FuaCZsYXN0bmFtZT1kYW5nJnBvc3Rjb2RlPTcwMDAwJmNpdHk9cXVhbjUmcmVnaW9uPWhjbSZzdHJlZXQ9dHJhbiUyMGJpbmglMjB0cm9uZyZ0ZWxlcGhvbmU9MDk4NDQ0NDQ0XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwLmRhdGEuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcC5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyZXNwLmRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlcnIuc3RhdHVzIHdpbGwgY29udGFpbiB0aGUgc3RhdHVzIGNvZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRVJSJywgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdFUlIgJyArIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnN1Y2Nlc3MgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oZm4pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS5lcnJvciA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihudWxsLCBmbik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBjaGVja291dEluZm86IGNoZWNrb3V0X2luZm8sXHJcblxyXG4gICAgICAgICAgICBzaGlwcGluZ0luZm9fMTogc2hpcHBpbmdfbWV0aG9kLFxyXG5cclxuICAgICAgICAgICAgcGF5bWVudEluZm86IHBheW1lbnRfbWV0aG9kXHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5yZXF1aXJlKCcuL2hvbWVfY29udHJvbGxlcicpO1xyXG5yZXF1aXJlKCcuLi8uL3VzZXIvdXNlcicpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdob21lJywgWydhcHAuc2VydmljZScsICd1c2VyJywgXCJob21lLmNvbnRyb2xsZXJcIl0pO1xyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcImhvbWUuY29udHJvbGxlclwiLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiSG9tZUNvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnTG9naW5TZXJ2aWNlJywnJGxvY2Fsc3RvcmFnZScsJyRzdGF0ZScsJ0NvbnRyb2xNb2RhbFNlcnZpY2UnLCckdGltZW91dCcsJ1VzZXJTZXJ2aWNlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBMb2dpblNlcnZpY2UsICRsb2NhbHN0b3JhZ2UsICRzdGF0ZSwgQ29udHJvbE1vZGFsU2VydmljZSwgJHRpbWVvdXQsIFVzZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50VXNlciA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY3VycmVudF91c2VyXCIpO1xyXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgaWYoIVVzZXJTZXJ2aWNlLmlzTG9naW4oKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29udHJvbE1vZGFsU2VydmljZS5zaG93KCdqcy9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJMb2dpbi5odG1sJywgJ1JlZ2lzdGVyTG9naW5Db250cm9sbGVyJywgMSk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUucHJvZHVjdHMnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgMjAwMCk7XHJcblxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vIGRvIHlvdXIgJCgpIHN0dWZmIGhlcmVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XSk7IiwiXCJ1c2Ugc3RyaWN0XCJcclxucmVxdWlyZShcIi4vbWVudV9jb250cm9sbGVyXCIpO1xyXG5yZXF1aXJlKCcuLi8uL3VzZXIvdXNlcicpO1xyXG5yZXF1aXJlKFwiLi4vLi9wcm9kdWN0cy9wcm9kdWN0c1wiKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcIm1lbnVcIiwgWydhcHAuc2VydmljZScsICd1c2VyJywgXCJwcm9kdWN0c1wiLCBcIm1lbnUuY29udHJvbGxlclwiXSlcclxuICAgIC5jb25maWcoZnVuY3Rpb24gKCRpb25pY0NvbmZpZ1Byb3ZpZGVyKSB7XHJcbiAgICAgICAgJGlvbmljQ29uZmlnUHJvdmlkZXIuYmFja0J1dHRvbi5wcmV2aW91c1RpdGxlVGV4dChmYWxzZSkudGV4dCgnJyk7XHJcbiAgICB9KTsiLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcIm1lbnUuY29udHJvbGxlclwiLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiTWVudUNvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZScsICdQcm9kdWN0U2VydmljZScsICckc3RhdGUnLCAnQ29udHJvbE1vZGFsU2VydmljZScsICckbG9jYWxzdG9yYWdlJywgJ1VzZXJTZXJ2aWNlJywnJGlvbmljU2Nyb2xsRGVsZWdhdGUnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsIFByb2R1Y3RTZXJ2aWNlLCAkc3RhdGUsIENvbnRyb2xNb2RhbFNlcnZpY2UsICRsb2NhbHN0b3JhZ2UsIFVzZXJTZXJ2aWNlLCAkaW9uaWNTY3JvbGxEZWxlZ2F0ZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUud2lzaGxpc3ROdW1iZXIgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcIndpc2hsaXN0XCIpLmxlbmd0aDtcclxuICAgICAgICAgICAgJHNjb3BlLmNhcnROdW1iZXIgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIikubGVuZ3RoO1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlciA9IFVzZXJTZXJ2aWNlLmN1cnJlbnRVc2VyO1xyXG4gICAgICAgICAgICBVc2VyU2VydmljZS5pc0xvZ2luKCk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9TdGF0ZS5uYW1lID09IFwibWVudS5wcm9kdWN0c1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNob3dQcm9kdWN0QmFja0J0biA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNob3dQcm9kdWN0QmFja0J0biA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignV2lzaGxpc3RVcGRhdGUnLCBmdW5jdGlvbiAoZXZlbnQsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS53aXNobGlzdE51bWJlciA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIikubGVuZ3RoO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kb24oJ0NhcnRVcGRhdGUnLCBmdW5jdGlvbiAoZXZlbnQsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jYXJ0TnVtYmVyID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpLmxlbmd0aDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZmlsdGVyVHlwZSA9IFtcclxuICAgICAgICAgICAgICAgIHt0eXBlOiBcIm5ld1wiLCBuYW1lOiAnU+G6o24gcGjhuqltIG3hu5tpJ30sXHJcbiAgICAgICAgICAgICAgICB7dHlwZTogXCJwcm9tb1wiLCBuYW1lOiAnU+G6o24gcGjhuqltIGtodXnhur9uIG3Do2knfSxcclxuICAgICAgICAgICAgICAgIHt0eXBlOiBcInByaWNlNTBrXCIgLCBuYW1lOiAnRHVvaSA1MC4wMDAnfSxcclxuICAgICAgICAgICAgICAgIHt0eXBlOiBcInByaWNlMTAwa1wiICwgbmFtZTogJzUwLjAwMCBkZW4gMTAwLjAwMCd9LFxyXG4gICAgICAgICAgICAgICAge3R5cGU6IFwicHJpY2UyMDBrXCIgLCBuYW1lOiAnMTAwLjAwMCBkZW4gMjAwLjAwMCd9LFxyXG4gICAgICAgICAgICAgICAge3R5cGU6IFwicHJpY2UyMDB1cFwiICwgbmFtZTogJ1RyZW4gMjAwLjAwMCd9XHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUub3Blbk1lbnUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLnRvZ2dsZUxlZnQoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5nZXRQcm9kdWN0cyA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJtZW51LnByb2R1Y3RzXCIpO1xyXG4gICAgICAgICAgICAgICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5zZXRUeXBlKHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2Uuc2V0UGFnZSgxKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLnVwZGF0ZUxvYWRtb3JlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuZmlsdGVyUHJvZHVjdCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY29udGFjdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIENvbnRyb2xNb2RhbFNlcnZpY2Uuc2hvdygnanMvbW9kdWxlcy9jb250YWN0L2NvbnRhY3QuaHRtbCcsICdDb250YWN0Q29udHJvbGxlcicsIDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2hvd19jYXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwibWVudS5jYXJ0XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXNlcl9pbmZvID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwibWVudS51c2VyXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudG9fbG9naW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBDb250cm9sTW9kYWxTZXJ2aWNlLnNob3coJ2pzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luLmh0bWwnLCAnUmVnaXN0ZXJMb2dpbkNvbnRyb2xsZXInLCAxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNpZ25vdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBVc2VyU2VydmljZS5zaWduT3V0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5nZXRQcm9kdWN0cyhcImFsbFwiKTtcclxuICAgICAgICB9XHJcbiAgICBdKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwcm9kdWN0LmNvbnRyb2xsZXJcIiwgW10pXHJcbiAgICAuZGlyZWN0aXZlKCdzcGlubmVyT25Mb2FkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmxvYWRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5iaW5kKCdsb2FkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KVxyXG4gICAgLmNvbnRyb2xsZXIoXCJQcm9kdWN0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICdQcm9kdWN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCAnV2lzaGxpc3RTZXJ2aWNlJywgJyRodHRwJywgJ0NvbnRyb2xNb2RhbFNlcnZpY2UnLCAnJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZScsICdDYXJ0U2VydmljZScsJyRsb2NhbHN0b3JhZ2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIFByb2R1Y3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMsIFdpc2hsaXN0U2VydmljZSwgJGh0dHAsIENvbnRyb2xNb2RhbFNlcnZpY2UsICRpb25pY1NsaWRlQm94RGVsZWdhdGUsIENhcnRTZXJ2aWNlLCAkbG9jYWxzdG9yYWdlKSB7XHJcbiAgICAgICAgICAgIHZhciBsaW5rX2FqYXggPSBcImh0dHA6Ly9zaG9wMTBrLnFybWFydGRlbW8uaW5mby9hcGkvcmVzdC9wcm9kdWN0c1wiO1xyXG4gICAgICAgICAgICB2YXIgbGlua19hamF4X25ldyA9IFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL3dlYl9hcGkucGhwXCI7XHJcbiAgICAgICAgICAgICRzY29wZS5wcm9kdWN0ID0ge307XHJcbiAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXhfbmV3ICsgXCI/cj1wcm9kdWN0JmlkPVwiICsgJHN0YXRlUGFyYW1zLmlkKS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGVtcC5wdXNoKHJlc3AuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnVwZGF0ZUFycmF5KHRlbXAsICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKSxcImFkZGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS51cGRhdGVBcnJheSh0ZW1wLCAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcIndpc2hsaXN0XCIpLCBcImxpa2VcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3QuZGV0YWlsID0gdGVtcDtcclxuICAgICAgICAgICAgICAgICRzY29wZS5wcm9kdWN0LmRldGFpbFtcInRodW1iXCJdID0gJHNjb3BlLnByb2R1Y3QuZGV0YWlsLmltYWdlO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnByb2R1Y3QuZGV0YWlsKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkaHR0cC5nZXQobGlua19hamF4ICsgXCIvXCIgKyAkc3RhdGVQYXJhbXMuaWQgKyBcIi9pbWFnZXNcIikudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3QuaW1hZ2VzID0gcmVzcC5kYXRhO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZVNsaWRlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXggKyBcIi9cIiArICRzdGF0ZVBhcmFtcy5pZCArIFwiL2NhdGVnb3JpZXNcIikudGhlbihmdW5jdGlvbiAoY2F0KSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUucHJvZHVjdC5jYXRlZ29yeSA9IGNhdC5kYXRhO1xyXG4gICAgICAgICAgICAgICAgJGh0dHAuZ2V0KGxpbmtfYWpheCArIFwiP2NhdGVnb3J5X2lkPVwiICsgJHNjb3BlLnByb2R1Y3QuY2F0ZWdvcnlbMF0uY2F0ZWdvcnlfaWQpLnRoZW4oZnVuY3Rpb24gKHJlbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9kdWN0LnJlbGF0ZWQgPSByZWxhdGUuZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVTbGlkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNTbGlkZUJveERlbGVnYXRlLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkVG9XaXNobGlzdCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBXaXNobGlzdFNlcnZpY2UuYWRkV2lzaGxpc3QoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hZGRfdG9fY2FydCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBDYXJ0U2VydmljZS5hZGRDYXJ0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY2hvb3NlUHJvZHVjdE9wdGlvbiA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBDb250cm9sTW9kYWxTZXJ2aWNlLnNob3coJ2pzL21vZHVsZXMvY2FydC9jYXJ0Lmh0bWwnLCAnQ2FydENvbnRyb2xsZXInLCAxLCBpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1dKTtcclxuXHJcbiIsIlwidXNlIHN0cmljdFwiXHJcbnJlcXVpcmUoXCIuL3Byb2R1Y3RzX2ZhY3RvcnkuanNcIik7XHJcbnJlcXVpcmUoXCIuL3Byb2R1Y3RzX2NvbnRyb2xsZXIuanNcIik7XHJcbnJlcXVpcmUoXCIuL3Byb2R1Y3RfY29udHJvbGxlci5qc1wiKTtcclxucmVxdWlyZSgnLi4vLi93aXNobGlzdC93aXNobGlzdF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4vY2FydC9jYXJ0X3NlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcInByb2R1Y3RzXCIsIFsnYXBwLnNlcnZpY2UnLCAnd2lzaGxpc3Quc2VydmljZScsICdjYXJ0LnNlcnZpY2VzJywgXCJwcm9kdWN0cy5mYWN0b3J5XCIsIFwicHJvZHVjdHMuY29udHJvbGxlclwiLCBcInByb2R1Y3QuY29udHJvbGxlclwiXSlcclxuICAgIC5jb25maWcoZnVuY3Rpb24gKCRpb25pY0NvbmZpZ1Byb3ZpZGVyKSB7XHJcbiAgICAgICAgJGlvbmljQ29uZmlnUHJvdmlkZXIuYmFja0J1dHRvbi5wcmV2aW91c1RpdGxlVGV4dChmYWxzZSkudGV4dCgnJyk7XHJcbiAgICB9KTsiLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcInByb2R1Y3RzLmNvbnRyb2xsZXJcIiwgW10pXHJcbiAgICAuY29udHJvbGxlcihcIlByb2R1Y3RzQ29udHJvbGxlclwiLCBbJyRzY29wZScsICckaW9uaWNTaWRlTWVudURlbGVnYXRlJywgJ1Byb2R1Y3RTZXJ2aWNlJywgJ0NvbnRyb2xNb2RhbFNlcnZpY2UnLCAnV2lzaGxpc3RTZXJ2aWNlJywgJ0NhcnRTZXJ2aWNlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCBQcm9kdWN0U2VydmljZSwgQ29udHJvbE1vZGFsU2VydmljZSwgV2lzaGxpc3RTZXJ2aWNlLCBDYXJ0U2VydmljZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUucHJvZHVjdHMgPSBQcm9kdWN0U2VydmljZS5wcm9kdWN0Q3VycmVudDtcclxuICAgICAgICAgICAgQ2FydFNlcnZpY2Uuc2V0Q2FydE51bWJlcigpO1xyXG4gICAgICAgICAgICAkc2NvcGUuY2FydE51bWJlciA9IENhcnRTZXJ2aWNlLmdldENhcnROdW1iZXIoKTtcclxuICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gQ2FydFNlcnZpY2UuY29udmVydE1vbmV5KDAsIFwiLFwiLCBcIi5cIiwgQ2FydFNlcnZpY2Uuc3VtQ2FydCgpKTtcclxuICAgICAgICAgICAgJHNjb3BlLmxvYWRNb3JlID0gUHJvZHVjdFNlcnZpY2UubG9hZE1vcmU7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUub3Blbk1lbnUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLnRvZ2dsZUxlZnQoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5sb2FkTW9yZURhdGEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZigkc2NvcGUubG9hZE1vcmVbMF0pe1xyXG4vLyAgICAgICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuaW5pdCg5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBQcm9kdWN0U2VydmljZS5nZXRQYWdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcCA9PSAxKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2Uuc2V0UGFnZSgyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuZmlsdGVyUHJvZHVjdCgpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRicm9hZGNhc3QoJ3Njcm9sbC5pbmZpbml0ZVNjcm9sbENvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLnNldFBhZ2UoKytkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UudXBkYXRlTG9hZG1vcmUoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFkZF90b19jYXJ0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIENhcnRTZXJ2aWNlLmFkZENhcnQoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hZGRUb1dpc2hsaXN0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIFdpc2hsaXN0U2VydmljZS5hZGRXaXNobGlzdChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignQ2FydFVwZGF0ZScsIGZ1bmN0aW9uIChldmVudCwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gQ2FydFNlcnZpY2UuY29udmVydE1vbmV5KDAsIFwiLFwiLCBcIi5cIiwgQ2FydFNlcnZpY2Uuc3VtQ2FydCgpKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jYXJ0TnVtYmVyID0gQ2FydFNlcnZpY2UuZ2V0Q2FydE51bWJlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICBdKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwcm9kdWN0cy5mYWN0b3J5XCIsIFtdKVxyXG4gICAgLmZhY3RvcnkoJ1Byb2R1Y3RTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkaHR0cCwgJGxvY2Fsc3RvcmFnZSwgJGlvbmljTG9hZGluZywgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHZhciBwcm9kdWN0cyA9IFtdO1xyXG4gICAgICAgIHZhciBmaWx0ZXIgPSB7XHJcbiAgICAgICAgICAgIGxpbWl0OiAyMCxcclxuICAgICAgICAgICAgdHlwZTogJydcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBpc0xvYWRNb3JlID0gW107XHJcbiAgICAgICAgdmFyIGN1cnJlbnRfaW5kZXggPSAwO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRfcHJvZHVjdChkYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9ICQubWFwKGRhdGEsIGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbdmFsdWVdO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBhcnJheS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICAgICAgcHJvZHVjdHNbY3VycmVudF9pbmRleF0gPSBhcnJheVtpXTtcclxuLy8gICAgICAgICAgICAgICAgcHJvZHVjdHMucHVzaChhcnJheVtpXSk7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50X2luZGV4Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybntcclxuICAgICAgICAgICAgZmlsdGVyUHJvZHVjdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuLy8gICAgICAgICAgICAgICAgdmFyIGxpbmtfYWpheCA9IFwiaHR0cDovL2xpcXVvcmRlbGl2ZXJ5LmNvbS5zZy93cC1hZG1pbi9hZG1pbi1hamF4LnBocFwiO1xyXG4vLyAgICAgICAgICAgICAgICAkaHR0cC5nZXQobGlua19hamF4ICsgXCI/YWN0aW9uPWxhdGVzdF9wcm9kdWN0c19hcHAmZmlsdGVyPVwiICsgZmlsdGVyVHlwZSArIFwiJnBhZ2U9XCIgKyBwYWdlX25leHQpLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgIGZpbHRlci5saW1pdCA9IDIwO1xyXG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlci5wYWdlID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyUHJvZHVjdHMoKTtcclxuICAgICAgICAgICAgICAgICAgICAkaW9uaWNMb2FkaW5nLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ0xvYWRpbmcuLi4nXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyLmxpbWl0ID0gMjA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgICAgIHZhciBsaW5rX2FqYXggPSBcImh0dHA6Ly9zaG9wMTBrLnFybWFydGRlbW8uaW5mby9hcGkvcmVzdC9wcm9kdWN0c1wiO1xyXG4vLyAgICAgICAgICAgICAgICAkaHR0cC5nZXQobGlua19hamF4ICsgXCI/cGFnZT1cIiArIGZpbHRlci5wYWdlICsgXCImbGltaXQ9XCIrIGZpbHRlci5saW1pdCArXCImb3JkZXI9ZW50aXR5X2lkJmRpcj1kc2NcIikudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBsaW5rX2FqYXggPSBcImh0dHA6Ly9zaG9wMTBrLnFybWFydGRlbW8uaW5mby9hcGkvcmVzdC9wcm9kdWN0c1wiO1xyXG4gICAgICAgICAgICAgICAgJGh0dHAuZ2V0KFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL3dlYl9hcGkucGhwP3I9XCIgKyBmaWx0ZXIudHlwZSArIFwiJmxpbWl0PVwiICsgZmlsdGVyLmxpbWl0ICsgXCImcGFnZT1cIiArIGZpbHRlci5wYWdlKS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwLmRhdGEuRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkX3Byb2R1Y3QocmVzcC5kYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS51cGRhdGVBcnJheShwcm9kdWN0cywgJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpLCBcImFkZGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnVwZGF0ZUFycmF5KHByb2R1Y3RzLCAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcIndpc2hsaXN0XCIpLCBcImxpa2VcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGZpbHRlci5wYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGZpbHRlci5wYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZXJyLnN0YXR1cyB3aWxsIGNvbnRhaW4gdGhlIHN0YXR1cyBjb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRVJSJywgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0VSUiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldFBhZ2U6IGZ1bmN0aW9uIChudW1iZXIpIHtcclxuICAgICAgICAgICAgICAgIGZpbHRlci5wYWdlID0gbnVtYmVyO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0VHlwZTogZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGZpbHRlci50eXBlID0gdHlwZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldFBhZ2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIucGFnZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGdldEluZGV4OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudF9pbmRleDtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZEF0dHJpYnV0ZTogZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHByb2R1Y3RzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2R1Y3RzW2ldLmVudGl0eV9pZCA9PSBpdGVtLmVudGl0eV9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0c1tpXVtpbmRleF0gPSBpdGVtW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICB1cGRhdGVMb2FkbW9yZSA6IGZ1bmN0aW9uKGxvYWQpe1xyXG4gICAgICAgICAgICAgICAgaXNMb2FkTW9yZVswXSA9IGxvYWQ7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBjbGVhclByb2R1Y3RzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0cy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudF9pbmRleCA9IDA7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAobnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bWJlcjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibG9hZGluZ1wiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBmaWx0ZXIgOiBmaWx0ZXIsXHJcblxyXG4gICAgICAgICAgICBsb2FkTW9yZSA6IGlzTG9hZE1vcmUsXHJcblxyXG4gICAgICAgICAgICBwcm9kdWN0Q3VycmVudDogcHJvZHVjdHNcclxuICAgICAgICB9XHJcbiAgICB9XHJcbilcclxuOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vdXNlcl9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4vdXNlcl9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoXCIuLi8uL3Byb2R1Y3RzL3Byb2R1Y3RzXCIpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwidXNlclwiLCBbJ2FwcC5zZXJ2aWNlJywgIFwicHJvZHVjdHNcIiwgJ3VzZXIuc2VydmljZScsICd1c2VyLmNvbnRyb2xsZXInXSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgndXNlci5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIlVzZXJDb250cm9sbGVyXCIsIFsnJHNjb3BlJywnVXNlclNlcnZpY2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIFVzZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gVXNlclNlcnZpY2UuY3VycmVudFVzZXI7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlVXNlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBVc2VyU2VydmljZS51cGRhdGVVc2VyKCRzY29wZS51c2VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIF0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ3VzZXIuc2VydmljZScsIFtdKVxyXG4gICAgLnNlcnZpY2UoJ1VzZXJTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkbG9jYWxzdG9yYWdlLCBQcm9kdWN0U2VydmljZSwgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHZhciBjdXJyZW50X3VzZXIgPSB7XHJcbiAgICAgICAgICAgIHBvcnRyYWl0OiBcImltZy9wb3J0cmFpdC5qcGdcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRVc2VyIDogY3VycmVudF91c2VyLFxyXG5cclxuICAgICAgICAgICAgaXNMb2dpbiA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXNlciA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwidXNlclwiKTtcclxuICAgICAgICAgICAgICAgIGlmKHVzZXIubG9naW4pe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVXNlcih1c2VyKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgdXBkYXRlVXNlciA6IGZ1bmN0aW9uKGluZm8pe1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpIGluIGluZm8pe1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRfdXNlcltpXSA9IGluZm9baV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzaWduT3V0IDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRfdXNlci5sb2dpbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsKFwidXNlclwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE51bGwoXCJjYXJ0XCIpO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsKFwid2lzaGxpc3RcIik7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5zZXRQYWdlKDEpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuZmlsdGVyUHJvZHVjdCgpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiQ2FydFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIldpc2hsaXN0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgbG9naW4gOiBmdW5jdGlvbih1c2VyKXtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgaW4gdXNlcil7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudF91c2VyW2ldID0gdXNlcltpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1cnJlbnRfdXNlci5sb2dpbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE9iamVjdChcInVzZXJcIiwgY3VycmVudF91c2VyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE51bGwoXCJjYXJ0XCIpO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsKFwid2lzaGxpc3RcIik7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5zZXRQYWdlKDEpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuZmlsdGVyUHJvZHVjdCgpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiQ2FydFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIldpc2hsaXN0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi93aXNobGlzdF9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4vd2lzaGxpc3Rfc2VydmljZS5qcycpO1xyXG5yZXF1aXJlKCcuLi8uL3Byb2R1Y3RzL3Byb2R1Y3RzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJ3aXNobGlzdFwiLCBbJ2FwcC5zZXJ2aWNlJywgJ3Byb2R1Y3RzJywgJ3dpc2hsaXN0LnNlcnZpY2UnLCAnd2lzaGxpc3QuY29udHJvbGxlciddKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCd3aXNobGlzdC5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIldpc2hsaXN0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckbG9jYWxzdG9yYWdlJywnV2lzaGxpc3RTZXJ2aWNlJywnJHN0YXRlJywnQ2FydFNlcnZpY2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhbHN0b3JhZ2UsIFdpc2hsaXN0U2VydmljZSwgJHN0YXRlLCBDYXJ0U2VydmljZSkge1xyXG4vLyAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbEFsbCgpO1xyXG4gICAgICAgICAgICAkc2NvcGUud2lzaGxpc3ROdW1iZXIgPSBXaXNobGlzdFNlcnZpY2Uud2lzaGxpc3ROdW1iZXI7XHJcbiAgICAgICAgICAgICRzY29wZS53aXNobGlzdCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIik7XHJcbiAgICAgICAgICAgICRzY29wZS5sZW5ndGhXaXNobGlzdCA9ICRzY29wZS53aXNobGlzdC5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUucmVtb3ZlRnJvbVdpc2hsaXN0ID0gZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgICBXaXNobGlzdFNlcnZpY2UucmVtb3ZlV2lzaGxpc3QoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUud2lzaGxpc3QgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcIndpc2hsaXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxlbmd0aFdpc2hsaXN0ID0gJHNjb3BlLndpc2hsaXN0Lmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFkZF90b19jYXJ0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIENhcnRTZXJ2aWNlLmFkZENhcnQoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnd2lzaGxpc3Quc2VydmljZScsIFtdKVxyXG4gICAgLnNlcnZpY2UoJ1dpc2hsaXN0U2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGxvY2Fsc3RvcmFnZSwgJHJvb3RTY29wZSwgUHJvZHVjdFNlcnZpY2UpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhZGRXaXNobGlzdCA6IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgaWYoIWl0ZW0ubGlrZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5saWtlID0gIWl0ZW0ubGlrZTtcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZE9iamVjdChcIndpc2hsaXN0XCIsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuYWRkQXR0cmlidXRlKFwiY2FydFwiLCBpdGVtLCBcImxpa2VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuYWRkQXR0cmlidXRlKGl0ZW0sIFwibGlrZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiV2lzaGxpc3RVcGRhdGVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlV2lzaGxpc3QoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICByZW1vdmVXaXNobGlzdCA6IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgaXRlbS5saWtlID0gIWl0ZW0ubGlrZTtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UucmVtb3ZlT2JqZWN0KFwid2lzaGxpc3RcIiwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZEF0dHJpYnV0ZShcImNhcnRcIiwgaXRlbSwgXCJsaWtlXCIpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuYWRkQXR0cmlidXRlKGl0ZW0sIFwibGlrZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJXaXNobGlzdFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9jb250YWN0X3NlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi9jb250YWN0X2NvbnRyb2xsZXIuanMnKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcImNvbnRhY3RcIiwgWydhcHAuc2VydmljZScsICdjb250YWN0LnNlcnZpY2VzJywgJ2NvbnRhY3QuY29udHJvbGxlciddKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjb250YWN0LmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiQ29udGFjdENvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAncGFyYW1ldGVycycsICckbG9jYWxzdG9yYWdlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBwYXJhbWV0ZXJzLCAkbG9jYWxzdG9yYWdlKSB7XHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3Quc2VydmljZXMnLCBbXSlcclxuICAgIC5zZXJ2aWNlKCdDb250YWN0U2VydmljZScsIGZ1bmN0aW9uICgkcSkge1xyXG5cclxuXHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdyZWdpc3RlckxvZ2luLnNlcnZpY2VzJywgW10pXHJcbiAgICAuc2VydmljZSgnTG9naW5TZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkaHR0cCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxvZ2luVXNlcjogbG9naW5Vc2VyLFxyXG4gICAgICAgICAgICByZWdpc3RlclVzZXI6IHJlZ2lzdGVyVXNlcixcclxuICAgICAgICAgICAgZ2V0SW5mbzogZ2V0SW5mb1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBnZXRJbmZvKG9iail7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuXHJcbiAgICAgICAgICAgICRodHRwLmdldChcImh0dHA6Ly9zaG9wMTBrLnFybWFydGRlbW8uaW5mby93ZWJfYXBpLnBocD9yPXVzZXImY2hlY2s9XCIgKyBvYmouZW1haWwgKyBcIiZwYXNzd29yZD1cIiArIG9iai5wYXNzd29yZCArIFwiJmRldGFpbD10cnVlXCIpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVzcC5kYXRhLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcC5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyZXNwLmRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBlcnIuc3RhdHVzIHdpbGwgY29udGFpbiB0aGUgc3RhdHVzIGNvZGVcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFUlInLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgnRVJSICcgKyBlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHByb21pc2Uuc3VjY2VzcyA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb21pc2UuZXJyb3IgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihudWxsLCBmbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiByZWdpc3RlclVzZXIob2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuXHJcbiAgICAgICAgICAgICRodHRwLmdldChcImh0dHA6Ly9zaG9wMTBrLnFybWFydGRlbW8uaW5mby93ZWJfYXBpLnBocD9yPXVzZXImcmVnaXN0ZXI9dHJ1ZSZmaXJzdG5hbWU9XCIgKyBvYmoubmFtZSArIFwiJmxhc3RuYW1lPVwiICsgb2JqLm5hbWUgKyBcIiZwYXNzd29yZD1cIiArIG9iai5wYXNzd29yZCArIFwiJmVtYWlsPVwiICsgb2JqLmVtYWlsKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwLmRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVzcC5kYXRhLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3AuZGF0YS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyZXNwLmRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBlcnIuc3RhdHVzIHdpbGwgY29udGFpbiB0aGUgc3RhdHVzIGNvZGVcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFUlInLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgnRVJSICcgKyBlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHByb21pc2Uuc3VjY2VzcyA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb21pc2UuZXJyb3IgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihudWxsLCBmbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dpblVzZXIob2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuXHJcbiAgICAgICAgICAgICRodHRwLmdldChcImh0dHA6Ly9zaG9wMTBrLnFybWFydGRlbW8uaW5mby93ZWJfYXBpLnBocD9yPXVzZXImbG9naW49XCIgKyBvYmouZW1haWwgKyBcIiZwYXNzd29yZD1cIiArIG9iai5wYXNzd29yZClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwLmRhdGEuRVhDRVBUSU9OX0lOVkFMSURfRU1BSUxfT1JfUEFTU1dPUkQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgnV2VsY29tZSAnICsgbmFtZSArICchJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QocmVzcC5kYXRhLmVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdFUlIgJyArIGVycik7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBwcm9taXNlLnN1Y2Nlc3MgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihmbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcm9taXNlLmVycm9yID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4obnVsbCwgZm4pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9sb2dpbl9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4vcmVnaXN0ZXJfbG9naW5fY29udHJvbGxlci5qcycpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2xheW91dC91c2VyL3VzZXInKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcInJlZ2lzdGVyTG9naW5cIiwgWydhcHAuc2VydmljZScsICd1c2VyJywgJ3JlZ2lzdGVyTG9naW4uc2VydmljZXMnLCAncmVnaXN0ZXJMb2dpbi5jb250cm9sbGVyJ10pO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ3JlZ2lzdGVyTG9naW4uY29udHJvbGxlcicsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJSZWdpc3RlckxvZ2luQ29udHJvbGxlclwiLCBbJyRzY29wZScsICdMb2dpblNlcnZpY2UnLCAnJHN0YXRlJywgJyRpb25pY1BvcHVwJywgJyRsb2NhbHN0b3JhZ2UnLCAnVXNlclNlcnZpY2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIExvZ2luU2VydmljZSwgJHN0YXRlLCAkaW9uaWNQb3B1cCwgJGxvY2Fsc3RvcmFnZSwgVXNlclNlcnZpY2UpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBVc2VyU2VydmljZS5jdXJyZW50X3VzZXI7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdtb2RhbC5oaWRkZW4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUucHJvZHVjdHMnKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUubG9naW5EYXRhID0ge307XHJcbiAgICAgICAgICAgICRzY29wZS5yZWdpc3RlckRhdGEgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5vcGVuTG9naW5Nb2RhbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5vcGVuTW9kYWwoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNsb3NlTG9naW5Nb2RhbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUucHJvZHVjdHMnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9sb2dpbiBzZWN0aW9uXHJcbiAgICAgICAgICAgICRzY29wZS5kb1JlZ2lzdGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgTG9naW5TZXJ2aWNlLnJlZ2lzdGVyVXNlcigkc2NvcGUucmVnaXN0ZXJEYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5yZWdpc3RlckRhdGEgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ8SQxINuZyBrw70gdGjDoG5oIGPDtG5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnVnVpIGzDsm5nIMSRxINuZyBuaOG6rXAgxJHhu4MgdGnhur9wIHThu6VjJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnxJDEg25nIGvDvSBraMO0bmcgdGjDoG5oIGPDtG5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBkYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vcmVnaXN0ZXIgc2VjdGlvblxyXG4gICAgICAgICAgICAkc2NvcGUuZG9Mb2dpbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIExvZ2luU2VydmljZS5sb2dpblVzZXIoJHNjb3BlLmxvZ2luRGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBMb2dpblNlcnZpY2UuZ2V0SW5mbygkc2NvcGUubG9naW5EYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLm5hbWUgPSBkYXRhLnVzZXIuZnVsbG5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5lbWFpbCA9IGRhdGEudXNlci5lbWFpbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnBob25lID0gZGF0YS5zaGlwcGluZ19hZGRyZXNzLnRlbGVwaG9uZV9zaGlwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuYWRkcmVzcyA9IGRhdGEuc2hpcHBpbmdfYWRkcmVzcy5zdHJlZXRfc2hpcFswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmRpc3RyaWN0ID0gZGF0YS5zaGlwcGluZ19hZGRyZXNzLmRpc19zaGlwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuY2l0eSA9IGRhdGEuc2hpcHBpbmdfYWRkcmVzcy5jaXR5X3NoaXA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5wYXNzd29yZCA9ICRzY29wZS5sb2dpbkRhdGEucGFzc3dvcmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVXNlclNlcnZpY2UubG9naW4oZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUucHJvZHVjdHMnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VNb2RhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS51c2VyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0xvZ2luIGZhaWxlZCEnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdQbGVhc2UgY2hlY2sgeW91ciBjcmVkZW50aWFscyEnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxyXG4gICAgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcclxuICAgICAgICAvLyBpZiBub25lIG9mIHRoZSBhYm92ZSBzdGF0ZXMgYXJlIG1hdGNoZWQsIHVzZSB0aGlzIGFzIHRoZSBmYWxsYmFja1xyXG4gICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL1wiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L2hvbWUvaG9tZS5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSG9tZUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG5cclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ2xvZ2luJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9sb2dpblwiLFxyXG4gICAgICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJMb2dpbi5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVnaXN0ZXJMb2dpbkNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG5cclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL21lbnVcIixcclxuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L21lbnUvbWVudS5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWVudUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG5cclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUucHJvZHVjdHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3Byb2R1Y3RzXCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHMuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2R1Y3RzQ29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LnByb2R1Y3QnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3Byb2R1Y3QvOmlkXCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudS5jYXJ0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jYXJ0XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvY2FydC9jYXJ0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDYXJ0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51Lndpc2hsaXN0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi93aXNobGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L3dpc2hsaXN0L3dpc2hsaXN0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdXaXNobGlzdENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudS5jaGVja291dCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvY2hlY2tvdXRcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9jaGVja291dC9jaGVja291dC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ2hlY2tvdXRDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUuY2hlY2tvdXRfZWRpdCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvY2hlY2tvdXRfZWRpdFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0X2VkaXQuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NoZWNrb3V0RWRpdENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudS51c2VyJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi91c2VyXCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvdXNlci91c2VyLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdVc2VyQ29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICB9XHJcbl1cclxuOyJdfQ==
