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
require('../.././app_service');

module.exports = angular.module("checkout", ['app.service', 'user', 'checkout.service', 'checkout.controller', 'checkoutEdit.controller'])
},{"../.././app_service":3,".././user/user":19,"./checkout_controller":8,"./checkout_edit_controller":9,"./checkout_service":10}],8:[function(require,module,exports){
'use strict';

module.exports = angular.module('checkout.controller', [])
    .controller("CheckoutController", ['$scope', '$localstorage', 'ControlModalService', '$state','$rootScope', 'CheckoutService','UserService',
        function ($scope, $localstorage, ControlModalService, $state, $rootScope, CheckoutService, UserService) {
            $scope.user = UserService.currentUser;
            $scope.checkoutInfo = CheckoutService.checkoutInfo;

            var shippingInfo = CheckoutService.shippingInfo();

            $scope.checkoutInfo["methodShip"] = shippingInfo.A;
            $scope.checkoutInfo["methodPayment"] = CheckoutService.paymentInfo.A;

            if(UserService.isLogin()){
                CheckoutService.updateCheckoutInfo($scope.user);
            }

            $scope.checkout = function(){
                CheckoutService.setOrder();
                $localstorage.setNull("cart");
                $rootScope.$broadcast("CartUpdate");
                $state.go("menu.products");
            }
        }]);
},{}],9:[function(require,module,exports){
'use strict';

module.exports = angular.module('checkoutEdit.controller', [])
    .controller("CheckoutEditController", ['$scope', '$localstorage', 'UserService','CheckoutService','$state','CartService',
        function ($scope,  $localstorage, UserService, CheckoutService, $state, CartService) {
            $scope.user = UserService.currentUser;
            $scope.checkoutInfo = CheckoutService.checkoutInfo;

            $scope.paymentInfo = CheckoutService.paymentInfo;
            $scope.below50 = false;
            $scope.below100 = false;

            CheckoutService.shippingInfo().success(
                function(data){
                    $scope.shippingInfo = data;
                }
            )

            var total = CartService.sumCart();

            if(total < 50000){
                $scope.below50 = true;
            }
            else if(total < 100000){
                $scope.below100 = true;
            }

            $scope.updateCheckout = function(){
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
    .controller("ProductsController", ['$scope', '$ionicSideMenuDelegate', 'ProductService', 'ControlModalService', 'WishlistService', 'CartService','$localstorage',
        function ($scope, $ionicSideMenuDelegate, ProductService, ControlModalService, WishlistService, CartService, $localstorage) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIi4vd3d3L2pzL2FwcC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvYXBwLW1haW4uanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2FwcF9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2FydC9jYXJ0LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2FydC9jYXJ0X2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9jYXJ0L2NhcnRfc2VydmljZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXRfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0X2VkaXRfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0X3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9ob21lL2hvbWUuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9ob21lL2hvbWVfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L21lbnUvbWVudS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L21lbnUvbWVudV9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdF9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHMuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0c19jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHNfZmFjdG9yeS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3VzZXIvdXNlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3VzZXIvdXNlcl9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvdXNlci91c2VyX3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC93aXNobGlzdC93aXNobGlzdC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3dpc2hsaXN0L3dpc2hsaXN0X2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC93aXNobGlzdC93aXNobGlzdF9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL2NvbnRhY3QvY29udGFjdC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9jb250YWN0L2NvbnRhY3RfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9jb250YWN0L2NvbnRhY3Rfc2VydmljZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9yZWdpc3RlckxvZ2luL2xvZ2luX3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJfbG9naW5fY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvcm91dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy9tb2R1bGUgbm9kZVxyXG4vL3JlcXVpcmUoXCJhbmd1bGFyXCIpO1xyXG5cclxuLy9tb2R1bGUgZnVuY3Rpb25zXHJcbnJlcXVpcmUoXCIuL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luXCIpO1xyXG5yZXF1aXJlKFwiLi9tb2R1bGVzL2NvbnRhY3QvY29udGFjdFwiKTtcclxuLy9tb2R1bGUgbGF5b3V0XHJcbnJlcXVpcmUoXCIuL2xheW91dC9ob21lL2hvbWVcIik7XHJcbnJlcXVpcmUoXCIuL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0c1wiKTtcclxucmVxdWlyZShcIi4vbGF5b3V0L21lbnUvbWVudVwiKTtcclxucmVxdWlyZShcIi4vbGF5b3V0L2NhcnQvY2FydFwiKTtcclxucmVxdWlyZShcIi4vbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0XCIpO1xyXG5yZXF1aXJlKFwiLi9sYXlvdXQvd2lzaGxpc3Qvd2lzaGxpc3RcIik7XHJcbnJlcXVpcmUoXCIuL2xheW91dC91c2VyL3VzZXJcIik7XHJcbnJlcXVpcmUoXCIuL2FwcF9zZXJ2aWNlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydCA9IGFuZ3VsYXIubW9kdWxlKCdzdGFydGVyJywgWydpb25pYycsICdzbGljaycsICdha29lbmlnLmRlY2tncmlkJywgJ25nLW1mYicsXHJcbiAgICAgICAgLy9mdW5jdGlvbnNcclxuICAgICAgICAncmVnaXN0ZXJMb2dpbicsXHJcbiAgICAgICAgJ2NvbnRhY3QnLFxyXG5cclxuICAgICAgICAvL2xheW91dFxyXG4gICAgICAgICdob21lJyxcclxuICAgICAgICAnbWVudScsXHJcbiAgICAgICAgJ3Byb2R1Y3RzJyxcclxuICAgICAgICAnY2FydCcsXHJcbiAgICAgICAgJ2NoZWNrb3V0JyxcclxuICAgICAgICAnd2lzaGxpc3QnLFxyXG4gICAgICAgICd1c2VyJyxcclxuXHJcbiAgICAgICAgJ2FwcC5zZXJ2aWNlJyxcclxuXHJcbiAgICBdKVxyXG4gICAgLmNvbmZpZyhyZXF1aXJlKCcuL3JvdXRlcicpKVxyXG4gICAgLnJ1bihyZXF1aXJlKCcuL2FwcC1tYWluJykpO1xyXG5cclxuXHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcbmZ1bmN0aW9uIEFwcE1haW4oJGlvbmljUGxhdGZvcm0sICRzdGF0ZSl7XHJcbiAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXHJcbiAgICAgICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxyXG4gICAgICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XHJcbiAgICAgICAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XHJcbiAgICAgICAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5kaXNhYmxlU2Nyb2xsKGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcclxuICAgICAgICAgICAgLy8gb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxyXG4gICAgICAgICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGlvbmljUGxhdGZvcm0ub24oJ3Jlc3VtZScsIGZ1bmN0aW9uKCl7XHJcbi8vICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFsnJGlvbmljUGxhdGZvcm0nLCAnJHN0YXRlJywgQXBwTWFpbl07IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZVwiLCBbXSlcclxuICAgIC5mYWN0b3J5KCckbG9jYWxzdG9yYWdlJywgZnVuY3Rpb24gKCR3aW5kb3csICRpb25pY0hpc3RvcnkpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChrZXksIGRlZmF1bHRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gfHwgZGVmYXVsdFZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0T2JqZWN0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0T2JqZWN0OiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8ICd7fScpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0TnVsbDogZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRPYmplY3Qoa2V5LCB7fSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldE51bGxBbGw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFyQ2FjaGUoKTtcclxuICAgICAgICAgICAgICAgICRpb25pY0hpc3RvcnkuY2xlYXJIaXN0b3J5KCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRPYmplY3Q6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBuZXcgQXJyYXkodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IHRoaXMuZ2V0T2JqZWN0KGtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2hhcmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycltpXS5lbnRpdHlfaWQgPT0gdmFsdWVbMF0uZW50aXR5X2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzaGFyZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5jb25jYXQoYXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gYXJyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0T2JqZWN0KGtleSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogb2JqQXJyTmVlZFVwZGF0ZSA6IGlzIGFuIGFycmF5IG5lZWQgdXBkYXRlIGFmdGVyIG1haW4gYXJyYXkgaXNcclxuICAgICAgICAgICAgICogKi9cclxuICAgICAgICAgICAgcmVtb3ZlT2JqZWN0OiBmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gdGhpcy5nZXRPYmplY3Qoa2V5KTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFycltpXS5lbnRpdHlfaWQgPT0gaXRlbS5lbnRpdHlfaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRPYmplY3Qoa2V5LCBhcnIpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgbWVyZ2VBcnJheTogZnVuY3Rpb24gKGFycjEsIGFycjIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhcnIzID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGFycjEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2hhcmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBhcnIyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyMltqXS5lbnRpdHlfaWQgPT0gYXJyMVtpXS5lbnRpdHlfaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2hhcmVkKSBhcnIzLnB1c2goYXJyMVtpXSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGFycjMgPSBhcnIzLmNvbmNhdChhcnIyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhcnIzO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvL2lucHV0IDIgYXJyYXlcclxuICAgICAgICAgICAgLy9yZXR1cm4gYXJyYXkgY29udGFpbiBhbGwgZWxlbWVudHMgd2hpY2ggYXJlIGluIGJvdGggYXJyYXkgYW5kIHVwZGF0ZSBmb2xsb3cgYXJyMlxyXG4gICAgICAgICAgICB1cGRhdGVBcnJheTogZnVuY3Rpb24gKGFycjEsIGFycjIsIGtleSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhcnIxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBhcnIyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnIyW2pdLmVudGl0eV9pZCA9PSBhcnIxW2ldLmVudGl0eV9pZCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycjFbaV1ba2V5XSA9IGFycjJbal1ba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZEF0dHJpYnV0ZTogZnVuY3Rpb24gKGtleSwgaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhcnIgPSB0aGlzLmdldE9iamVjdChrZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycltpXS5lbnRpdHlfaWQgPT0gaXRlbS5lbnRpdHlfaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycltpXVtpbmRleF0gPSBpdGVtW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE9iamVjdChrZXksIGFycik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnNlcnZpY2UoJ0NvbnRyb2xNb2RhbFNlcnZpY2UnLCBmdW5jdGlvbiAoJHEsICRpb25pY01vZGFsLCAkcm9vdFNjb3BlLCAkdGltZW91dCwgJGNvbnRyb2xsZXIpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzaG93OiBzaG93XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNob3codGVtcGxldGVVcmwsIGNvbnRyb2xsZXIsIGF1dG9zaG93LCBwYXJhbWV0ZXJzLCBvcHRpb25zLCB3cmFwQ2Fsc3MpIHtcclxuICAgICAgICAgICAgLy8gR3JhYiB0aGUgaW5qZWN0b3IgYW5kIGNyZWF0ZSBhIG5ldyBzY29wZVxyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpLFxyXG4gICAgICAgICAgICAgICAgY3RybEluc3RhbmNlLFxyXG4gICAgICAgICAgICAgICAgbW9kYWxTY29wZSA9ICRyb290U2NvcGUuJG5ldygpLFxyXG4gICAgICAgICAgICAgICAgdGhpc1Njb3BlSWQgPSBtb2RhbFNjb3BlLiRpZCxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogJ3NsaWRlLWluLXVwJyxcclxuICAgICAgICAgICAgICAgICAgICBmb2N1c0ZpcnN0SW5wdXQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tkcm9wQ2xpY2tUb0Nsb3NlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGhhcmR3YXJlQmFja0J1dHRvbkNsb3NlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsQ2FsbGJhY2s6IG51bGxcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCh0ZW1wbGV0ZVVybCwge1xyXG4gICAgICAgICAgICAgICAgc2NvcGU6IG1vZGFsU2NvcGUsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IG9wdGlvbnMuYW5pbWF0aW9uLFxyXG4gICAgICAgICAgICAgICAgZm9jdXNGaXJzdElucHV0OiBvcHRpb25zLmZvY3VzRmlyc3RJbnB1dCxcclxuICAgICAgICAgICAgICAgIGJhY2tkcm9wQ2xpY2tUb0Nsb3NlOiBvcHRpb25zLmJhY2tkcm9wQ2xpY2tUb0Nsb3NlLFxyXG4gICAgICAgICAgICAgICAgaGFyZHdhcmVCYWNrQnV0dG9uQ2xvc2U6IG9wdGlvbnMuaGFyZHdhcmVCYWNrQnV0dG9uQ2xvc2VcclxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLm1vZGFsID0gbW9kYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUub3Blbk1vZGFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLm1vZGFsLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS5tb2RhbC5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS4kb24oJ21vZGFsLmhpZGRlbicsIGZ1bmN0aW9uICh0aGlzTW9kYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNNb2RhbC5jdXJyZW50U2NvcGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtb2RhbFNjb3BlSWQgPSB0aGlzTW9kYWwuY3VycmVudFNjb3BlLiRpZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzU2NvcGVJZCA9PT0gbW9kYWxTY29wZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfY2xlYW51cCh0aGlzTW9kYWwuY3VycmVudFNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJbnZva2UgdGhlIGNvbnRyb2xsZXJcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYWxzID0geyAnJHNjb3BlJzogbW9kYWxTY29wZSwgJ3BhcmFtZXRlcnMnOiBwYXJhbWV0ZXJzIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN0cmxFdmFsID0gX2V2YWxDb250cm9sbGVyKGNvbnRyb2xsZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0cmxJbnN0YW5jZSA9ICRjb250cm9sbGVyKGNvbnRyb2xsZXIsIGxvY2Fscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN0cmxFdmFsLmlzQ29udHJvbGxlckFzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0cmxJbnN0YW5jZS5vcGVuTW9kYWwgPSBtb2RhbFNjb3BlLm9wZW5Nb2RhbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RybEluc3RhbmNlLmNsb3NlTW9kYWwgPSBtb2RhbFNjb3BlLmNsb3NlTW9kYWw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXV0b3Nob3cpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS5tb2RhbC5zaG93KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLiRicm9hZGNhc3QoJ21vZGFsLmFmdGVyU2hvdycsIG1vZGFsU2NvcGUubW9kYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKG9wdGlvbnMubW9kYWxDYWxsYmFjaykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5tb2RhbENhbGxiYWNrKG1vZGFsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIF9jbGVhbnVwKHNjb3BlKSB7XHJcbiAgICAgICAgICAgIHNjb3BlLiRkZXN0cm95KCk7XHJcbiAgICAgICAgICAgIGlmIChzY29wZS5tb2RhbCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUubW9kYWwucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIF9ldmFsQ29udHJvbGxlcihjdHJsTmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgICAgICAgICAgICAgaXNDb250cm9sbGVyQXM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck5hbWU6ICcnLFxyXG4gICAgICAgICAgICAgICAgcHJvcE5hbWU6ICcnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHZhciBmcmFnbWVudHMgPSAoY3RybE5hbWUgfHwgJycpLnRyaW0oKS5zcGxpdCgvXFxzKy8pO1xyXG4gICAgICAgICAgICByZXN1bHQuaXNDb250cm9sbGVyQXMgPSBmcmFnbWVudHMubGVuZ3RoID09PSAzICYmIChmcmFnbWVudHNbMV0gfHwgJycpLnRvTG93ZXJDYXNlKCkgPT09ICdhcyc7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuaXNDb250cm9sbGVyQXMpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5jb250cm9sbGVyTmFtZSA9IGZyYWdtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wcm9wTmFtZSA9IGZyYWdtZW50c1syXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5jb250cm9sbGVyTmFtZSA9IGN0cmxOYW1lO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vY2FydF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4vY2FydF9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4vcHJvZHVjdHMvcHJvZHVjdHMnKTtcclxucmVxdWlyZSgnLi4vLi9jaGVja291dC9jaGVja291dCcpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiY2FydFwiLCBbJ2FwcC5zZXJ2aWNlJywgJ2NoZWNrb3V0JywgJ3Byb2R1Y3RzJywgJ2NhcnQuc2VydmljZXMnLCAnY2FydC5jb250cm9sbGVyJ10pO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NhcnQuY29udHJvbGxlcicsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJDYXJ0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckbG9jYWxzdG9yYWdlJywgJ1dpc2hsaXN0U2VydmljZScsICdDYXJ0U2VydmljZScsJ0NoZWNrb3V0U2VydmljZScsJyRzdGF0ZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2Fsc3RvcmFnZSwgV2lzaGxpc3RTZXJ2aWNlLCBDYXJ0U2VydmljZSwgQ2hlY2tvdXRTZXJ2aWNlLCAkc3RhdGUpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmNhcnRsaXN0ID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpO1xyXG4gICAgICAgICAgICAkc2NvcGUubGVuZ3RoQ2FydCA9ICRzY29wZS5jYXJ0bGlzdC5sZW5ndGg7XHJcbiAgICAgICAgICAgIENhcnRTZXJ2aWNlLnNldENhcnROdW1iZXIoKTtcclxuICAgICAgICAgICAgJHNjb3BlLmNhcnROdW1iZXIgPSBDYXJ0U2VydmljZS5nZXRDYXJ0TnVtYmVyKCk7XHJcbiAgICAgICAgICAgICRzY29wZS50b3RhbCA9IENhcnRTZXJ2aWNlLmNvbnZlcnRNb25leSgwLCBcIixcIiwgXCIuXCIsIENhcnRTZXJ2aWNlLnN1bUNhcnQoKSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkVG9XaXNobGlzdCA9IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgV2lzaGxpc3RTZXJ2aWNlLmFkZFdpc2hsaXN0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUucmVtb3ZlRnJvbUNhcnQgPSBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgIENhcnRTZXJ2aWNlLnJlbW92ZUNhcnQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2FydGxpc3QgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIik7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUubGVuZ3RoQ2FydCA9ICRzY29wZS5jYXJ0bGlzdC5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2FydE51bWJlciA9IENhcnRTZXJ2aWNlLmdldENhcnROdW1iZXIoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNhcnRfY2hlY2tvdXQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgQ2hlY2tvdXRTZXJ2aWNlLnN1bVRvdGFsKCk7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUuY2hlY2tvdXQnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignQ2FydFVwZGF0ZScsIGZ1bmN0aW9uIChldmVudCwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gQ2FydFNlcnZpY2Uuc3VtQ2FydCgpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNhcnROdW1iZXIgPSBDYXJ0U2VydmljZS5nZXRDYXJ0TnVtYmVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZVF0eSA9IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5hZGRBdHRyaWJ1dGUoXCJjYXJ0XCIsIGl0ZW0sIFwicXVhbnRpdHlcIik7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudG90YWwgPSBDYXJ0U2VydmljZS5jb252ZXJ0TW9uZXkoMCwgXCIsXCIsIFwiLlwiLCBDYXJ0U2VydmljZS5zdW1DYXJ0KCkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjYXJ0LnNlcnZpY2VzJywgW10pXHJcbiAgICAuc2VydmljZSgnQ2FydFNlcnZpY2UnLCBmdW5jdGlvbiAoJHEsICRsb2NhbHN0b3JhZ2UsICRyb290U2NvcGUsIFByb2R1Y3RTZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIGNhcnROdW1iZXIgPSAwO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGFkZENhcnQ6IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWl0ZW0uYWRkZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXJ0TnVtYmVyKys7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5hZGRlZCA9ICFpdGVtLmFkZGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ucXVhbnRpdHkgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuYWRkT2JqZWN0KFwiY2FydFwiLCBpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZEF0dHJpYnV0ZShcIndpc2hsaXN0XCIsIGl0ZW0sIFwiYWRkZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuYWRkQXR0cmlidXRlKGl0ZW0sIFwiYWRkZWRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIkNhcnRVcGRhdGVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUNhcnQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICByZW1vdmVDYXJ0OiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY2FydE51bWJlci0tO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5hZGRlZCA9ICFpdGVtLmFkZGVkO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5yZW1vdmVPYmplY3QoXCJjYXJ0XCIsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5hZGRBdHRyaWJ1dGUoXCJ3aXNobGlzdFwiLCBpdGVtLCBcImFkZGVkXCIsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmFkZEF0dHJpYnV0ZShpdGVtLCBcImFkZGVkXCIsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJDYXJ0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc3VtQ2FydDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhcnQgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG90YWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBjYXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG90YWwgKz0gcGFyc2VJbnQoY2FydFtpXS5wcmljZV9udW1iZXIgKiBjYXJ0W2ldLnF1YW50aXR5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0b3RhbDtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGNvbnZlcnRNb25leSA6IGZ1bmN0aW9uKGMsIGQsIHQsIG51bWJlcil7XHJcbiAgICAgICAgICAgICAgICB2YXIgbiA9IG51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICBjID0gaXNOYU4oYyA9IE1hdGguYWJzKGMpKSA/IDIgOiBjLFxyXG4gICAgICAgICAgICAgICAgICAgIGQgPSBkID09IHVuZGVmaW5lZCA/IFwiLlwiIDogZCxcclxuICAgICAgICAgICAgICAgICAgICB0ID0gdCA9PSB1bmRlZmluZWQgPyBcIixcIiA6IHQsXHJcbiAgICAgICAgICAgICAgICAgICAgcyA9IG4gPCAwID8gXCItXCIgOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGkgPSBwYXJzZUludChuID0gTWF0aC5hYnMoK24gfHwgMCkudG9GaXhlZChjKSkgKyBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGogPSAoaiA9IGkubGVuZ3RoKSA+IDMgPyBqICUgMyA6IDA7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcyArIChqID8gaS5zdWJzdHIoMCwgaikgKyB0IDogXCJcIikgKyBpLnN1YnN0cihqKS5yZXBsYWNlKC8oXFxkezN9KSg/PVxcZCkvZywgXCIkMVwiICsgdCkgKyAoYyA/IGQgKyBNYXRoLmFicyhuIC0gaSkudG9GaXhlZChjKS5zbGljZSgyKSA6IFwiXCIpICsgXCIgxJEgXCI7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXRDYXJ0TnVtYmVyIDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGNhcnROdW1iZXIgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIikubGVuZ3RoO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0Q2FydE51bWJlciA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FydE51bWJlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vY2hlY2tvdXRfY29udHJvbGxlcicpO1xyXG5yZXF1aXJlKCcuL2NoZWNrb3V0X2VkaXRfY29udHJvbGxlcicpO1xyXG5yZXF1aXJlKCcuL2NoZWNrb3V0X3NlcnZpY2UnKTtcclxucmVxdWlyZSgnLi4vLi91c2VyL3VzZXInKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcImNoZWNrb3V0XCIsIFsnYXBwLnNlcnZpY2UnLCAndXNlcicsICdjaGVja291dC5zZXJ2aWNlJywgJ2NoZWNrb3V0LmNvbnRyb2xsZXInLCAnY2hlY2tvdXRFZGl0LmNvbnRyb2xsZXInXSkiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjaGVja291dC5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIkNoZWNrb3V0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckbG9jYWxzdG9yYWdlJywgJ0NvbnRyb2xNb2RhbFNlcnZpY2UnLCAnJHN0YXRlJywnJHJvb3RTY29wZScsICdDaGVja291dFNlcnZpY2UnLCdVc2VyU2VydmljZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2Fsc3RvcmFnZSwgQ29udHJvbE1vZGFsU2VydmljZSwgJHN0YXRlLCAkcm9vdFNjb3BlLCBDaGVja291dFNlcnZpY2UsIFVzZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gVXNlclNlcnZpY2UuY3VycmVudFVzZXI7XHJcbiAgICAgICAgICAgICRzY29wZS5jaGVja291dEluZm8gPSBDaGVja291dFNlcnZpY2UuY2hlY2tvdXRJbmZvO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNoaXBwaW5nSW5mbyA9IENoZWNrb3V0U2VydmljZS5zaGlwcGluZ0luZm8oKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jaGVja291dEluZm9bXCJtZXRob2RTaGlwXCJdID0gc2hpcHBpbmdJbmZvLkE7XHJcbiAgICAgICAgICAgICRzY29wZS5jaGVja291dEluZm9bXCJtZXRob2RQYXltZW50XCJdID0gQ2hlY2tvdXRTZXJ2aWNlLnBheW1lbnRJbmZvLkE7XHJcblxyXG4gICAgICAgICAgICBpZihVc2VyU2VydmljZS5pc0xvZ2luKCkpe1xyXG4gICAgICAgICAgICAgICAgQ2hlY2tvdXRTZXJ2aWNlLnVwZGF0ZUNoZWNrb3V0SW5mbygkc2NvcGUudXNlcik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jaGVja291dCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBDaGVja291dFNlcnZpY2Uuc2V0T3JkZXIoKTtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbChcImNhcnRcIik7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJDYXJ0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwibWVudS5wcm9kdWN0c1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjaGVja291dEVkaXQuY29udHJvbGxlcicsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJDaGVja291dEVkaXRDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRsb2NhbHN0b3JhZ2UnLCAnVXNlclNlcnZpY2UnLCdDaGVja291dFNlcnZpY2UnLCckc3RhdGUnLCdDYXJ0U2VydmljZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgICRsb2NhbHN0b3JhZ2UsIFVzZXJTZXJ2aWNlLCBDaGVja291dFNlcnZpY2UsICRzdGF0ZSwgQ2FydFNlcnZpY2UpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBVc2VyU2VydmljZS5jdXJyZW50VXNlcjtcclxuICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0SW5mbyA9IENoZWNrb3V0U2VydmljZS5jaGVja291dEluZm87XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUucGF5bWVudEluZm8gPSBDaGVja291dFNlcnZpY2UucGF5bWVudEluZm87XHJcbiAgICAgICAgICAgICRzY29wZS5iZWxvdzUwID0gZmFsc2U7XHJcbiAgICAgICAgICAgICRzY29wZS5iZWxvdzEwMCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgQ2hlY2tvdXRTZXJ2aWNlLnNoaXBwaW5nSW5mbygpLnN1Y2Nlc3MoXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2hpcHBpbmdJbmZvID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKVxyXG5cclxuICAgICAgICAgICAgdmFyIHRvdGFsID0gQ2FydFNlcnZpY2Uuc3VtQ2FydCgpO1xyXG5cclxuICAgICAgICAgICAgaWYodG90YWwgPCA1MDAwMCl7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYmVsb3c1MCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0b3RhbCA8IDEwMDAwMCl7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYmVsb3cxMDAgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlQ2hlY2tvdXQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgQ2hlY2tvdXRTZXJ2aWNlLmFkZFNoaXBwaW5nKCRzY29wZS5jaGVja291dEluZm8ubWV0aG9kU2hpcCk7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUuY2hlY2tvdXQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjaGVja291dC5zZXJ2aWNlJywgW10pXHJcbiAgICAuZmFjdG9yeSgnQ2hlY2tvdXRTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkbG9jYWxzdG9yYWdlLCBDYXJ0U2VydmljZSwgJGh0dHApIHtcclxuICAgICAgICB2YXIgY2hlY2tvdXRfaW5mbyA9IHtcclxuICAgICAgICAgICAgdG90YWw6IDAsXHJcbiAgICAgICAgICAgIGdyYW5kVG90YWw6IDAsXHJcbiAgICAgICAgICAgIG1ldGhvZFNoaXBUZXh0OiAwLFxyXG4gICAgICAgICAgICBtZXRob2RTaGlwOiB7fVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldF9zaGlwcGluZ19tZXRob2QoKXtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xyXG5cclxuICAgICAgICAgICAgJGh0dHAuZ2V0KFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL3dlYl9hcGkucGhwP3I9c2hpcHBpbmdcIilcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVyci5zdGF0dXMgd2lsbCBjb250YWluIHRoZSBzdGF0dXMgY29kZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0VSUicsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdFUlIgJyArIGVycik7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgcHJvbWlzZS5zdWNjZXNzID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oZm4pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvbWlzZS5lcnJvciA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKG51bGwsIGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzaGlwcGluZ19tZXRob2QgPSB7XHJcbiAgICAgICAgICAgIFwiQVwiOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIlQ/IGw/eSBow6BuZyB0P2kgYz9hIGjDoG5nIDE2NCBUcj9uIELDrG5oIFRyP25nIFE1IC0gSENNIDA/XCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcIkJcIjoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogXCJRdT9uIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDEwLCAxMSwgVMOibiBCw6xuaCwgVMOibiBQaMO6LCBQaMO6IE5odT9uLCBCw6xuaCBUaD9uaCwgR8OyIFY/cFwiLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogXCJCXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiMSBuZ8OgeSAoMTUuMDAwID8pXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAxNTAwMFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogXCJCXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiMi0zIG5nw6B5ICgxMi4wMDAgPylcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDEyMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcIkNcIjoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogXCJRdT9uIDksIDEyLCBCw6xuaCBUw6JuLCBUaD8gPz9jXCIsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBcIkNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCIxIG5nw6B5ICgyNS4wMDAgPylcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDI1MDAwXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBcIkNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCIyLTMgbmfDoHkgKDIwLjAwMCA/KVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogMjAwMDBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiRFwiOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIkM/IENoaSwgTmjDoCBCw6gsIELDrG5oIENow6FuaCwgSMOzYyBNw7RuLCBDP24gR2k/ICgzMC4wMDAgPylcIixcclxuICAgICAgICAgICAgICAgIHZhbHVlOiAzMDAwMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcIkVcIjoge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogXCJUP25oLCBUaMOgbmggcGg/IG5nb8OgaSBUcC5IPyBDaMOtIE1pbmggKFQ/IHY/biB2acOqbiBzPyBsacOqbiBoPyB2P2kgS0ggcXVhID9UIHRow7RuZyBiw6FvIHBow60gJiB0aD9pIGdpYW4gZ2lhbyBow6BuZylcIixcclxuICAgICAgICAgICAgICAgIHZhbHVlOiAwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgcGF5bWVudF9tZXRob2QgPSB7XHJcbiAgICAgICAgICAgIFwiQVwiOiBcIkNhc2ggT24gRGVsaXZlcnkgKHRoYW5oIHRvw6FuIGtoaSBuaOG6rW4gaMOgbmcpXCIsXHJcbiAgICAgICAgICAgIFwiQlwiOiBcIkJhbmsgVHJhbnNmZXIgUGF5bWVudCAoY2h1eeG7g24gcXVhIG5nw6JuIGjDoG5nKVwiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdXBkYXRlQ2hlY2tvdXRJbmZvOiBmdW5jdGlvbiAoaW5mbykge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBpbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tvdXRfaW5mb1tpXSA9IGluZm9baV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzdW1Ub3RhbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY2hlY2tvdXRfaW5mby50b3RhbCA9IENhcnRTZXJ2aWNlLnN1bUNhcnQoKTtcclxuICAgICAgICAgICAgICAgIGNoZWNrb3V0X2luZm8udG90YWxUZXh0ID0gQ2FydFNlcnZpY2UuY29udmVydE1vbmV5KDAsIFwiLFwiLCBcIi5cIiwgY2hlY2tvdXRfaW5mby50b3RhbCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tvdXRfaW5mby5tZXRob2RTaGlwLnZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrb3V0X2luZm8uZ3JhbmRUb3RhbCA9IENhcnRTZXJ2aWNlLmNvbnZlcnRNb25leSgwLCBcIixcIiwgXCIuXCIsIChjaGVja291dF9pbmZvLnRvdGFsICsgY2hlY2tvdXRfaW5mby5tZXRob2RTaGlwLnZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tvdXRfaW5mby5ncmFuZFRvdGFsID0gQ2FydFNlcnZpY2UuY29udmVydE1vbmV5KDAsIFwiLFwiLCBcIi5cIiwgY2hlY2tvdXRfaW5mby50b3RhbCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRTaGlwcGluZzogZnVuY3Rpb24gKG1ldGhvZFNoaXApIHtcclxuICAgICAgICAgICAgICAgIGlmIChtZXRob2RTaGlwLmluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kU2hpcC50ZXh0ID0gc2hpcHBpbmdfbWV0aG9kW21ldGhvZFNoaXAuaW5kZXhdLnRleHQgKyBcIiAtIFwiICsgbWV0aG9kU2hpcC50ZXh0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2hlY2tvdXRfaW5mby5tZXRob2RTaGlwID0gbWV0aG9kU2hpcDtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoZWNrb3V0X2luZm8ubWV0aG9kU2hpcCk7XHJcbiAgICAgICAgICAgICAgICBjaGVja291dF9pbmZvLm1ldGhvZFNoaXBUZXh0ID0gQ2FydFNlcnZpY2UuY29udmVydE1vbmV5KDAsIFwiLFwiLCBcIi5cIiwgY2hlY2tvdXRfaW5mby5tZXRob2RTaGlwLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGNoZWNrb3V0X2luZm8uZ3JhbmRUb3RhbCA9IENhcnRTZXJ2aWNlLmNvbnZlcnRNb25leSgwLCBcIixcIiwgXCIuXCIsIChjaGVja291dF9pbmZvLnRvdGFsICsgY2hlY2tvdXRfaW5mby5tZXRob2RTaGlwLnZhbHVlKSk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXRPcmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICAgICAgICAgIHZhciBjYXJ0ID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoXCJodHRwOi8vc2hvcDEway5xcm1hcnRkZW1vLmluZm8vd2ViX2FwaS5waHBcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByOiBcInVzZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2s6IFwibG9uZ2FuaHZuQGdtYWlsLmNvbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogXCJsb25nYW5oQDEyM1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdGlkOiAxNzE3LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdHk6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBheW1lbnQ6IFwiYmFua3RyYW5zZmVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBwaW5nOiBcImZsYXRyYXRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0bmFtZTogXCJsb25nYW5oXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RuYW1lOiBcImRhbmdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zdGNvZGU6IFwiNzAwMDBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2l0eTogXCJxdWFuNVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWdpb246IFwiaGNtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmVldDogXCIxNjQgVHJhbiBCaW5oIFRyb25nXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbGVwaG9uZTogXCIwOTgxMTEyNDUxXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApXHJcbi8vICAgICAgICAgICAgICAgICRodHRwLmdldChcImh0dHA6Ly9zaG9wMTBrLnFybWFydGRlbW8uaW5mby93ZWJfYXBpLnBocD9yPXVzZXImY2hlY2s9bG9uZ2FuaHZuQGdtYWlsLmNvbSZwYXNzd29yZD1sb25nYW5oQDEyMyZvcmRlcj10cnVlJnByb2R1Y3RpZD0xNzE3JnF0eT0xJnBheW1lbnQ9YmFua3RyYW5zZmVyJnNoaXBwaW5nPWZsYXRyYXRlJmZpcnN0bmFtZT1sb25nYW5oJmxhc3RuYW1lPWRhbmcmcG9zdGNvZGU9NzAwMDAmY2l0eT1xdWFuNSZyZWdpb249aGNtJnN0cmVldD10cmFuJTIwYmluaCUyMHRyb25nJnRlbGVwaG9uZT0wOTg0NDQ0NDRcIilcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3AuZGF0YS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHJlc3AuZGF0YS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVyci5zdGF0dXMgd2lsbCBjb250YWluIHRoZSBzdGF0dXMgY29kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFUlInLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0VSUiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIHByb21pc2Uuc3VjY2VzcyA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihmbik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLmVycm9yID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKG51bGwsIGZuKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGNoZWNrb3V0SW5mbzogY2hlY2tvdXRfaW5mbyxcclxuXHJcbiAgICAgICAgICAgIHNoaXBwaW5nSW5mbzogZ2V0X3NoaXBwaW5nX21ldGhvZCxcclxuXHJcbiAgICAgICAgICAgIHBheW1lbnRJbmZvOiBwYXltZW50X21ldGhvZFxyXG4gICAgICAgIH1cclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxucmVxdWlyZSgnLi9ob21lX2NvbnRyb2xsZXInKTtcclxucmVxdWlyZSgnLi4vLi91c2VyL3VzZXInKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnaG9tZScsIFsnYXBwLnNlcnZpY2UnLCAndXNlcicsIFwiaG9tZS5jb250cm9sbGVyXCJdKTtcclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJob21lLmNvbnRyb2xsZXJcIiwgW10pXHJcbiAgICAuY29udHJvbGxlcihcIkhvbWVDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJ0xvZ2luU2VydmljZScsJyRsb2NhbHN0b3JhZ2UnLCckc3RhdGUnLCdDb250cm9sTW9kYWxTZXJ2aWNlJywnJHRpbWVvdXQnLCdVc2VyU2VydmljZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgTG9naW5TZXJ2aWNlLCAkbG9jYWxzdG9yYWdlLCAkc3RhdGUsIENvbnRyb2xNb2RhbFNlcnZpY2UsICR0aW1lb3V0LCBVc2VyU2VydmljZSkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudFVzZXIgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImN1cnJlbnRfdXNlclwiKTtcclxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGlmKCFVc2VyU2VydmljZS5pc0xvZ2luKCkpe1xyXG4gICAgICAgICAgICAgICAgICAgIENvbnRyb2xNb2RhbFNlcnZpY2Uuc2hvdygnanMvbW9kdWxlcy9yZWdpc3RlckxvZ2luL3JlZ2lzdGVyTG9naW4uaHRtbCcsICdSZWdpc3RlckxvZ2luQ29udHJvbGxlcicsIDEpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdtZW51LnByb2R1Y3RzJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDIwMDApO1xyXG5cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBkbyB5b3VyICQoKSBzdHVmZiBoZXJlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfV0pOyIsIlwidXNlIHN0cmljdFwiXHJcbnJlcXVpcmUoXCIuL21lbnVfY29udHJvbGxlclwiKTtcclxucmVxdWlyZSgnLi4vLi91c2VyL3VzZXInKTtcclxucmVxdWlyZShcIi4uLy4vcHJvZHVjdHMvcHJvZHVjdHNcIik7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJtZW51XCIsIFsnYXBwLnNlcnZpY2UnLCAndXNlcicsIFwicHJvZHVjdHNcIiwgXCJtZW51LmNvbnRyb2xsZXJcIl0pXHJcbiAgICAuY29uZmlnKGZ1bmN0aW9uICgkaW9uaWNDb25maWdQcm92aWRlcikge1xyXG4gICAgICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLmJhY2tCdXR0b24ucHJldmlvdXNUaXRsZVRleHQoZmFsc2UpLnRleHQoJycpO1xyXG4gICAgfSk7IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJtZW51LmNvbnRyb2xsZXJcIiwgW10pXHJcbiAgICAuY29udHJvbGxlcihcIk1lbnVDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRpb25pY1NpZGVNZW51RGVsZWdhdGUnLCAnUHJvZHVjdFNlcnZpY2UnLCAnJHN0YXRlJywgJ0NvbnRyb2xNb2RhbFNlcnZpY2UnLCAnJGxvY2Fsc3RvcmFnZScsICdVc2VyU2VydmljZScsJyRpb25pY1Njcm9sbERlbGVnYXRlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCBQcm9kdWN0U2VydmljZSwgJHN0YXRlLCBDb250cm9sTW9kYWxTZXJ2aWNlLCAkbG9jYWxzdG9yYWdlLCBVc2VyU2VydmljZSwgJGlvbmljU2Nyb2xsRGVsZWdhdGUpIHtcclxuICAgICAgICAgICAgJHNjb3BlLndpc2hsaXN0TnVtYmVyID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJ3aXNobGlzdFwiKS5sZW5ndGg7XHJcbiAgICAgICAgICAgICRzY29wZS5jYXJ0TnVtYmVyID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpLmxlbmd0aDtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBVc2VyU2VydmljZS5jdXJyZW50VXNlcjtcclxuICAgICAgICAgICAgVXNlclNlcnZpY2UuaXNMb2dpbigpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRvU3RhdGUubmFtZSA9PSBcIm1lbnUucHJvZHVjdHNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zaG93UHJvZHVjdEJhY2tCdG4gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zaG93UHJvZHVjdEJhY2tCdG4gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kb24oJ1dpc2hsaXN0VXBkYXRlJywgZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUud2lzaGxpc3ROdW1iZXIgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcIndpc2hsaXN0XCIpLmxlbmd0aDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdDYXJ0VXBkYXRlJywgZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2FydE51bWJlciA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmZpbHRlclR5cGUgPSBbXHJcbiAgICAgICAgICAgICAgICB7dHlwZTogXCJuZXdcIiwgbmFtZTogJ1PhuqNuIHBo4bqpbSBt4bubaSd9LFxyXG4gICAgICAgICAgICAgICAge3R5cGU6IFwicHJvbW9cIiwgbmFtZTogJ1PhuqNuIHBo4bqpbSBraHV54bq/biBtw6NpJ30sXHJcbiAgICAgICAgICAgICAgICB7dHlwZTogXCJwcmljZTUwa1wiICwgbmFtZTogJ0R1b2kgNTAuMDAwJ30sXHJcbiAgICAgICAgICAgICAgICB7dHlwZTogXCJwcmljZTEwMGtcIiAsIG5hbWU6ICc1MC4wMDAgZGVuIDEwMC4wMDAnfSxcclxuICAgICAgICAgICAgICAgIHt0eXBlOiBcInByaWNlMjAwa1wiICwgbmFtZTogJzEwMC4wMDAgZGVuIDIwMC4wMDAnfSxcclxuICAgICAgICAgICAgICAgIHt0eXBlOiBcInByaWNlMjAwdXBcIiAsIG5hbWU6ICdUcmVuIDIwMC4wMDAnfVxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wZW5NZW51ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS50b2dnbGVMZWZ0KCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZ2V0UHJvZHVjdHMgPSBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwibWVudS5wcm9kdWN0c1wiKTtcclxuICAgICAgICAgICAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2Uuc2V0VHlwZSh0eXBlKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLnNldFBhZ2UoMSk7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS51cGRhdGVMb2FkbW9yZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmZpbHRlclByb2R1Y3QoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNvbnRhY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBDb250cm9sTW9kYWxTZXJ2aWNlLnNob3coJ2pzL21vZHVsZXMvY29udGFjdC9jb250YWN0Lmh0bWwnLCAnQ29udGFjdENvbnRyb2xsZXInLCAxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNob3dfY2FydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcIm1lbnUuY2FydFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVzZXJfaW5mbyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcIm1lbnUudXNlclwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnRvX2xvZ2luID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgQ29udHJvbE1vZGFsU2VydmljZS5zaG93KCdqcy9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJMb2dpbi5odG1sJywgJ1JlZ2lzdGVyTG9naW5Db250cm9sbGVyJywgMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5zaWdub3V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgVXNlclNlcnZpY2Uuc2lnbk91dCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZ2V0UHJvZHVjdHMoXCJhbGxcIik7XHJcbiAgICAgICAgfVxyXG4gICAgXSk7XHJcbiIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwicHJvZHVjdC5jb250cm9sbGVyXCIsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnc3Bpbm5lck9uTG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5sb2FkZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYmluZCgnbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxuICAgIC5jb250cm9sbGVyKFwiUHJvZHVjdENvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnUHJvZHVjdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgJ1dpc2hsaXN0U2VydmljZScsICckaHR0cCcsICdDb250cm9sTW9kYWxTZXJ2aWNlJywgJyRpb25pY1NsaWRlQm94RGVsZWdhdGUnLCAnQ2FydFNlcnZpY2UnLCckbG9jYWxzdG9yYWdlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBQcm9kdWN0U2VydmljZSwgJHN0YXRlUGFyYW1zLCBXaXNobGlzdFNlcnZpY2UsICRodHRwLCBDb250cm9sTW9kYWxTZXJ2aWNlLCAkaW9uaWNTbGlkZUJveERlbGVnYXRlLCBDYXJ0U2VydmljZSwgJGxvY2Fsc3RvcmFnZSkge1xyXG4gICAgICAgICAgICB2YXIgbGlua19hamF4ID0gXCJodHRwOi8vc2hvcDEway5xcm1hcnRkZW1vLmluZm8vYXBpL3Jlc3QvcHJvZHVjdHNcIjtcclxuICAgICAgICAgICAgdmFyIGxpbmtfYWpheF9uZXcgPSBcImh0dHA6Ly9zaG9wMTBrLnFybWFydGRlbW8uaW5mby93ZWJfYXBpLnBocFwiO1xyXG4gICAgICAgICAgICAkc2NvcGUucHJvZHVjdCA9IHt9O1xyXG4gICAgICAgICAgICAkaHR0cC5nZXQobGlua19hamF4X25ldyArIFwiP3I9cHJvZHVjdCZpZD1cIiArICRzdGF0ZVBhcmFtcy5pZCkudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRlbXAucHVzaChyZXNwLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS51cGRhdGVBcnJheSh0ZW1wLCAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIiksXCJhZGRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UudXBkYXRlQXJyYXkodGVtcCwgJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJ3aXNobGlzdFwiKSwgXCJsaWtlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICRzY29wZS5wcm9kdWN0LmRldGFpbCA9IHRlbXA7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUucHJvZHVjdC5kZXRhaWxbXCJ0aHVtYlwiXSA9ICRzY29wZS5wcm9kdWN0LmRldGFpbC5pbWFnZTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5wcm9kdWN0LmRldGFpbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJGh0dHAuZ2V0KGxpbmtfYWpheCArIFwiL1wiICsgJHN0YXRlUGFyYW1zLmlkICsgXCIvaW1hZ2VzXCIpLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5wcm9kdWN0LmltYWdlcyA9IHJlc3AuZGF0YTtcclxuICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVTbGlkZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkaHR0cC5nZXQobGlua19hamF4ICsgXCIvXCIgKyAkc3RhdGVQYXJhbXMuaWQgKyBcIi9jYXRlZ29yaWVzXCIpLnRoZW4oZnVuY3Rpb24gKGNhdCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3QuY2F0ZWdvcnkgPSBjYXQuZGF0YTtcclxuICAgICAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXggKyBcIj9jYXRlZ29yeV9pZD1cIiArICRzY29wZS5wcm9kdWN0LmNhdGVnb3J5WzBdLmNhdGVnb3J5X2lkKS50aGVuKGZ1bmN0aW9uIChyZWxhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJvZHVjdC5yZWxhdGVkID0gcmVsYXRlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlU2xpZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZS51cGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFkZFRvV2lzaGxpc3QgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgV2lzaGxpc3RTZXJ2aWNlLmFkZFdpc2hsaXN0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkX3RvX2NhcnQgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgQ2FydFNlcnZpY2UuYWRkQ2FydChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNob29zZVByb2R1Y3RPcHRpb24gPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgQ29udHJvbE1vZGFsU2VydmljZS5zaG93KCdqcy9tb2R1bGVzL2NhcnQvY2FydC5odG1sJywgJ0NhcnRDb250cm9sbGVyJywgMSwgaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XSk7XHJcblxyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5yZXF1aXJlKFwiLi9wcm9kdWN0c19mYWN0b3J5LmpzXCIpO1xyXG5yZXF1aXJlKFwiLi9wcm9kdWN0c19jb250cm9sbGVyLmpzXCIpO1xyXG5yZXF1aXJlKFwiLi9wcm9kdWN0X2NvbnRyb2xsZXIuanNcIik7XHJcbnJlcXVpcmUoJy4uLy4vd2lzaGxpc3Qvd2lzaGxpc3Rfc2VydmljZS5qcycpO1xyXG5yZXF1aXJlKCcuLi8uL2NhcnQvY2FydF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwcm9kdWN0c1wiLCBbJ2FwcC5zZXJ2aWNlJywgJ3dpc2hsaXN0LnNlcnZpY2UnLCAnY2FydC5zZXJ2aWNlcycsIFwicHJvZHVjdHMuZmFjdG9yeVwiLCBcInByb2R1Y3RzLmNvbnRyb2xsZXJcIiwgXCJwcm9kdWN0LmNvbnRyb2xsZXJcIl0pXHJcbiAgICAuY29uZmlnKGZ1bmN0aW9uICgkaW9uaWNDb25maWdQcm92aWRlcikge1xyXG4gICAgICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLmJhY2tCdXR0b24ucHJldmlvdXNUaXRsZVRleHQoZmFsc2UpLnRleHQoJycpO1xyXG4gICAgfSk7IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwcm9kdWN0cy5jb250cm9sbGVyXCIsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJQcm9kdWN0c0NvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZScsICdQcm9kdWN0U2VydmljZScsICdDb250cm9sTW9kYWxTZXJ2aWNlJywgJ1dpc2hsaXN0U2VydmljZScsICdDYXJ0U2VydmljZScsJyRsb2NhbHN0b3JhZ2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsIFByb2R1Y3RTZXJ2aWNlLCBDb250cm9sTW9kYWxTZXJ2aWNlLCBXaXNobGlzdFNlcnZpY2UsIENhcnRTZXJ2aWNlLCAkbG9jYWxzdG9yYWdlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5wcm9kdWN0cyA9IFByb2R1Y3RTZXJ2aWNlLnByb2R1Y3RDdXJyZW50O1xyXG4gICAgICAgICAgICBDYXJ0U2VydmljZS5zZXRDYXJ0TnVtYmVyKCk7XHJcbiAgICAgICAgICAgICRzY29wZS5jYXJ0TnVtYmVyID0gQ2FydFNlcnZpY2UuZ2V0Q2FydE51bWJlcigpO1xyXG4gICAgICAgICAgICAkc2NvcGUudG90YWwgPSBDYXJ0U2VydmljZS5jb252ZXJ0TW9uZXkoMCwgXCIsXCIsIFwiLlwiLCBDYXJ0U2VydmljZS5zdW1DYXJ0KCkpO1xyXG4gICAgICAgICAgICAkc2NvcGUubG9hZE1vcmUgPSBQcm9kdWN0U2VydmljZS5sb2FkTW9yZTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5vcGVuTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUudG9nZ2xlTGVmdCgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmxvYWRNb3JlRGF0YSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmKCRzY29wZS5sb2FkTW9yZVswXSl7XHJcbi8vICAgICAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5pbml0KDkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IFByb2R1Y3RTZXJ2aWNlLmdldFBhZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wID09IDEpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5zZXRQYWdlKDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5maWx0ZXJQcm9kdWN0KCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdCgnc2Nyb2xsLmluZmluaXRlU2Nyb2xsQ29tcGxldGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2Uuc2V0UGFnZSgrK2RhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS51cGRhdGVMb2FkbW9yZShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkX3RvX2NhcnQgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgQ2FydFNlcnZpY2UuYWRkQ2FydChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFkZFRvV2lzaGxpc3QgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgV2lzaGxpc3RTZXJ2aWNlLmFkZFdpc2hsaXN0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdDYXJ0VXBkYXRlJywgZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudG90YWwgPSBDYXJ0U2VydmljZS5jb252ZXJ0TW9uZXkoMCwgXCIsXCIsIFwiLlwiLCBDYXJ0U2VydmljZS5zdW1DYXJ0KCkpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNhcnROdW1iZXIgPSBDYXJ0U2VydmljZS5nZXRDYXJ0TnVtYmVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIF0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcInByb2R1Y3RzLmZhY3RvcnlcIiwgW10pXHJcbiAgICAuZmFjdG9yeSgnUHJvZHVjdFNlcnZpY2UnLCBmdW5jdGlvbiAoJHEsICRodHRwLCAkbG9jYWxzdG9yYWdlLCAkaW9uaWNMb2FkaW5nLCAkcm9vdFNjb3BlKSB7XHJcbiAgICAgICAgdmFyIHByb2R1Y3RzID0gW107XHJcbiAgICAgICAgdmFyIGZpbHRlciA9IHtcclxuICAgICAgICAgICAgbGltaXQ6IDIwLFxyXG4gICAgICAgICAgICB0eXBlOiAnJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIGlzTG9hZE1vcmUgPSBbXTtcclxuICAgICAgICB2YXIgY3VycmVudF9pbmRleCA9IDA7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZF9wcm9kdWN0KGRhdGEpIHtcclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gJC5tYXAoZGF0YSwgZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFt2YWx1ZV07XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGFycmF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0c1tjdXJyZW50X2luZGV4XSA9IGFycmF5W2ldO1xyXG4vLyAgICAgICAgICAgICAgICBwcm9kdWN0cy5wdXNoKGFycmF5W2ldKTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRfaW5kZXgrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJue1xyXG4gICAgICAgICAgICBmaWx0ZXJQcm9kdWN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xyXG4vLyAgICAgICAgICAgICAgICB2YXIgbGlua19hamF4ID0gXCJodHRwOi8vbGlxdW9yZGVsaXZlcnkuY29tLnNnL3dwLWFkbWluL2FkbWluLWFqYXgucGhwXCI7XHJcbi8vICAgICAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXggKyBcIj9hY3Rpb249bGF0ZXN0X3Byb2R1Y3RzX2FwcCZmaWx0ZXI9XCIgKyBmaWx0ZXJUeXBlICsgXCImcGFnZT1cIiArIHBhZ2VfbmV4dCkudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyLmxpbWl0ID0gMjA7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyLnBhZ2UgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJQcm9kdWN0cygpO1xyXG4gICAgICAgICAgICAgICAgICAgICRpb25pY0xvYWRpbmcuc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnTG9hZGluZy4uLidcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXIubGltaXQgPSAyMDtcclxuICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICAgICAgdmFyIGxpbmtfYWpheCA9IFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL2FwaS9yZXN0L3Byb2R1Y3RzXCI7XHJcbi8vICAgICAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXggKyBcIj9wYWdlPVwiICsgZmlsdGVyLnBhZ2UgKyBcIiZsaW1pdD1cIisgZmlsdGVyLmxpbWl0ICtcIiZvcmRlcj1lbnRpdHlfaWQmZGlyPWRzY1wiKS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGxpbmtfYWpheCA9IFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL2FwaS9yZXN0L3Byb2R1Y3RzXCI7XHJcbiAgICAgICAgICAgICAgICAkaHR0cC5nZXQoXCJodHRwOi8vc2hvcDEway5xcm1hcnRkZW1vLmluZm8vd2ViX2FwaS5waHA/cj1cIiArIGZpbHRlci50eXBlICsgXCImbGltaXQ9XCIgKyBmaWx0ZXIubGltaXQgKyBcIiZwYWdlPVwiICsgZmlsdGVyLnBhZ2UpLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3AuZGF0YS5FcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRfcHJvZHVjdChyZXNwLmRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnVwZGF0ZUFycmF5KHByb2R1Y3RzLCAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIiksIFwiYWRkZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UudXBkYXRlQXJyYXkocHJvZHVjdHMsICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIiksIFwibGlrZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZmlsdGVyLnBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZmlsdGVyLnBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBlcnIuc3RhdHVzIHdpbGwgY29udGFpbiB0aGUgc3RhdHVzIGNvZGVcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFUlInLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgnRVJSICcgKyBlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0UGFnZTogZnVuY3Rpb24gKG51bWJlcikge1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyLnBhZ2UgPSBudW1iZXI7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXRUeXBlOiBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0UGFnZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci5wYWdlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0SW5kZXg6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50X2luZGV4O1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkQXR0cmlidXRlOiBmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gcHJvZHVjdHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvZHVjdHNbaV0uZW50aXR5X2lkID09IGl0ZW0uZW50aXR5X2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3RzW2ldW2luZGV4XSA9IGl0ZW1baW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHVwZGF0ZUxvYWRtb3JlIDogZnVuY3Rpb24obG9hZCl7XHJcbiAgICAgICAgICAgICAgICBpc0xvYWRNb3JlWzBdID0gbG9hZDtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGNsZWFyUHJvZHVjdHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50X2luZGV4ID0gMDtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uIChudW1iZXIpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtYmVyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsb2FkaW5nXCI6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGZpbHRlciA6IGZpbHRlcixcclxuXHJcbiAgICAgICAgICAgIGxvYWRNb3JlIDogaXNMb2FkTW9yZSxcclxuXHJcbiAgICAgICAgICAgIHByb2R1Y3RDdXJyZW50OiBwcm9kdWN0c1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuKVxyXG47IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi91c2VyX3NlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi91c2VyX2NvbnRyb2xsZXIuanMnKTtcclxucmVxdWlyZShcIi4uLy4vcHJvZHVjdHMvcHJvZHVjdHNcIik7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJ1c2VyXCIsIFsnYXBwLnNlcnZpY2UnLCAgXCJwcm9kdWN0c1wiLCAndXNlci5zZXJ2aWNlJywgJ3VzZXIuY29udHJvbGxlciddKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCd1c2VyLmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiVXNlckNvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCdVc2VyU2VydmljZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgVXNlclNlcnZpY2UpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBVc2VyU2VydmljZS5jdXJyZW50VXNlcjtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVVc2VyID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIFVzZXJTZXJ2aWNlLnVwZGF0ZVVzZXIoJHNjb3BlLnVzZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgndXNlci5zZXJ2aWNlJywgW10pXHJcbiAgICAuc2VydmljZSgnVXNlclNlcnZpY2UnLCBmdW5jdGlvbiAoJHEsICRsb2NhbHN0b3JhZ2UsIFByb2R1Y3RTZXJ2aWNlLCAkcm9vdFNjb3BlKSB7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRfdXNlciA9IHtcclxuICAgICAgICAgICAgcG9ydHJhaXQ6IFwiaW1nL3BvcnRyYWl0LmpwZ1wiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY3VycmVudFVzZXIgOiBjdXJyZW50X3VzZXIsXHJcblxyXG4gICAgICAgICAgICBpc0xvZ2luIDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHZhciB1c2VyID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJ1c2VyXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYodXNlci5sb2dpbil7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVVc2VyKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICB1cGRhdGVVc2VyIDogZnVuY3Rpb24oaW5mbyl7XHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgaW4gaW5mbyl7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudF91c2VyW2ldID0gaW5mb1tpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNpZ25PdXQgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudF91c2VyLmxvZ2luID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE51bGwoXCJ1c2VyXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbChcImNhcnRcIik7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE51bGwoXCJ3aXNobGlzdFwiKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLnNldFBhZ2UoMSk7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5maWx0ZXJQcm9kdWN0KCk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJDYXJ0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiV2lzaGxpc3RVcGRhdGVcIik7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBsb2dpbiA6IGZ1bmN0aW9uKHVzZXIpe1xyXG5cclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaSBpbiB1c2VyKXtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50X3VzZXJbaV0gPSB1c2VyW2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY3VycmVudF91c2VyLmxvZ2luID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0T2JqZWN0KFwidXNlclwiLCBjdXJyZW50X3VzZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbChcImNhcnRcIik7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE51bGwoXCJ3aXNobGlzdFwiKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLnNldFBhZ2UoMSk7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5maWx0ZXJQcm9kdWN0KCk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJDYXJ0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiV2lzaGxpc3RVcGRhdGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCcuL3dpc2hsaXN0X2NvbnRyb2xsZXIuanMnKTtcclxucmVxdWlyZSgnLi93aXNobGlzdF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4vcHJvZHVjdHMvcHJvZHVjdHMnKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcIndpc2hsaXN0XCIsIFsnYXBwLnNlcnZpY2UnLCAncHJvZHVjdHMnLCAnd2lzaGxpc3Quc2VydmljZScsICd3aXNobGlzdC5jb250cm9sbGVyJ10pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ3dpc2hsaXN0LmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiV2lzaGxpc3RDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRsb2NhbHN0b3JhZ2UnLCdXaXNobGlzdFNlcnZpY2UnLCckc3RhdGUnLCdDYXJ0U2VydmljZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2Fsc3RvcmFnZSwgV2lzaGxpc3RTZXJ2aWNlLCAkc3RhdGUsIENhcnRTZXJ2aWNlKSB7XHJcbi8vICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsQWxsKCk7XHJcbiAgICAgICAgICAgICRzY29wZS53aXNobGlzdE51bWJlciA9IFdpc2hsaXN0U2VydmljZS53aXNobGlzdE51bWJlcjtcclxuICAgICAgICAgICAgJHNjb3BlLndpc2hsaXN0ID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJ3aXNobGlzdFwiKTtcclxuICAgICAgICAgICAgJHNjb3BlLmxlbmd0aFdpc2hsaXN0ID0gJHNjb3BlLndpc2hsaXN0Lmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5yZW1vdmVGcm9tV2lzaGxpc3QgPSBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgIFdpc2hsaXN0U2VydmljZS5yZW1vdmVXaXNobGlzdChpdGVtKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS53aXNobGlzdCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIik7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUubGVuZ3RoV2lzaGxpc3QgPSAkc2NvcGUud2lzaGxpc3QubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkX3RvX2NhcnQgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgQ2FydFNlcnZpY2UuYWRkQ2FydChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCd3aXNobGlzdC5zZXJ2aWNlJywgW10pXHJcbiAgICAuc2VydmljZSgnV2lzaGxpc3RTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkbG9jYWxzdG9yYWdlLCAkcm9vdFNjb3BlLCBQcm9kdWN0U2VydmljZSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGFkZFdpc2hsaXN0IDogZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgICBpZighaXRlbS5saWtlKXtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmxpa2UgPSAhaXRlbS5saWtlO1xyXG4gICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuYWRkT2JqZWN0KFwid2lzaGxpc3RcIiwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5hZGRBdHRyaWJ1dGUoXCJjYXJ0XCIsIGl0ZW0sIFwibGlrZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5hZGRBdHRyaWJ1dGUoaXRlbSwgXCJsaWtlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJXaXNobGlzdFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVXaXNobGlzdChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHJlbW92ZVdpc2hsaXN0IDogZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmxpa2UgPSAhaXRlbS5saWtlO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5yZW1vdmVPYmplY3QoXCJ3aXNobGlzdFwiLCBpdGVtKTtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuYWRkQXR0cmlidXRlKFwiY2FydFwiLCBpdGVtLCBcImxpa2VcIik7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5hZGRBdHRyaWJ1dGUoaXRlbSwgXCJsaWtlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIldpc2hsaXN0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9XHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCcuL2NvbnRhY3Rfc2VydmljZS5qcycpO1xyXG5yZXF1aXJlKCcuL2NvbnRhY3RfY29udHJvbGxlci5qcycpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiY29udGFjdFwiLCBbJ2FwcC5zZXJ2aWNlJywgJ2NvbnRhY3Quc2VydmljZXMnLCAnY29udGFjdC5jb250cm9sbGVyJ10pO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3QuY29udHJvbGxlcicsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJDb250YWN0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICdwYXJhbWV0ZXJzJywgJyRsb2NhbHN0b3JhZ2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHBhcmFtZXRlcnMsICRsb2NhbHN0b3JhZ2UpIHtcclxuICAgICAgICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnY29udGFjdC5zZXJ2aWNlcycsIFtdKVxyXG4gICAgLnNlcnZpY2UoJ0NvbnRhY3RTZXJ2aWNlJywgZnVuY3Rpb24gKCRxKSB7XHJcblxyXG5cclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ3JlZ2lzdGVyTG9naW4uc2VydmljZXMnLCBbXSlcclxuICAgIC5zZXJ2aWNlKCdMb2dpblNlcnZpY2UnLCBmdW5jdGlvbiAoJHEsICRodHRwKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbG9naW5Vc2VyOiBsb2dpblVzZXIsXHJcbiAgICAgICAgICAgIHJlZ2lzdGVyVXNlcjogcmVnaXN0ZXJVc2VyLFxyXG4gICAgICAgICAgICBnZXRJbmZvOiBnZXRJbmZvXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGdldEluZm8ob2JqKXtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xyXG5cclxuICAgICAgICAgICAgJGh0dHAuZ2V0KFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL3dlYl9hcGkucGhwP3I9dXNlciZjaGVjaz1cIiArIG9iai5lbWFpbCArIFwiJnBhc3N3b3JkPVwiICsgb2JqLnBhc3N3b3JkICsgXCImZGV0YWlsPXRydWVcIilcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwLmRhdGEuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHJlc3AuZGF0YS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVyci5zdGF0dXMgd2lsbCBjb250YWluIHRoZSBzdGF0dXMgY29kZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0VSUicsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdFUlIgJyArIGVycik7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgcHJvbWlzZS5zdWNjZXNzID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oZm4pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvbWlzZS5lcnJvciA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKG51bGwsIGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlZ2lzdGVyVXNlcihvYmopIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xyXG5cclxuICAgICAgICAgICAgJGh0dHAuZ2V0KFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL3dlYl9hcGkucGhwP3I9dXNlciZyZWdpc3Rlcj10cnVlJmZpcnN0bmFtZT1cIiArIG9iai5uYW1lICsgXCImbGFzdG5hbWU9XCIgKyBvYmoubmFtZSArIFwiJnBhc3N3b3JkPVwiICsgb2JqLnBhc3N3b3JkICsgXCImZW1haWw9XCIgKyBvYmouZW1haWwpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3AuZGF0YS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwLmRhdGEuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcC5kYXRhLmVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHJlc3AuZGF0YS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVyci5zdGF0dXMgd2lsbCBjb250YWluIHRoZSBzdGF0dXMgY29kZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0VSUicsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdFUlIgJyArIGVycik7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgcHJvbWlzZS5zdWNjZXNzID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oZm4pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvbWlzZS5lcnJvciA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKG51bGwsIGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2luVXNlcihvYmopIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xyXG5cclxuICAgICAgICAgICAgJGh0dHAuZ2V0KFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL3dlYl9hcGkucGhwP3I9dXNlciZsb2dpbj1cIiArIG9iai5lbWFpbCArIFwiJnBhc3N3b3JkPVwiICsgb2JqLnBhc3N3b3JkKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3AuZGF0YS5FWENFUFRJT05fSU5WQUxJRF9FTUFJTF9PUl9QQVNTV09SRCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCdXZWxjb21lICcgKyBuYW1lICsgJyEnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyZXNwLmRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0VSUiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHByb21pc2Uuc3VjY2VzcyA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb21pc2UuZXJyb3IgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihudWxsLCBmbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9XHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCcuL2xvZ2luX3NlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi9yZWdpc3Rlcl9sb2dpbl9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vbGF5b3V0L3VzZXIvdXNlcicpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwicmVnaXN0ZXJMb2dpblwiLCBbJ2FwcC5zZXJ2aWNlJywgJ3VzZXInLCAncmVnaXN0ZXJMb2dpbi5zZXJ2aWNlcycsICdyZWdpc3RlckxvZ2luLmNvbnRyb2xsZXInXSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgncmVnaXN0ZXJMb2dpbi5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIlJlZ2lzdGVyTG9naW5Db250cm9sbGVyXCIsIFsnJHNjb3BlJywgJ0xvZ2luU2VydmljZScsICckc3RhdGUnLCAnJGlvbmljUG9wdXAnLCAnJGxvY2Fsc3RvcmFnZScsICdVc2VyU2VydmljZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgTG9naW5TZXJ2aWNlLCAkc3RhdGUsICRpb25pY1BvcHVwLCAkbG9jYWxzdG9yYWdlLCBVc2VyU2VydmljZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlciA9IFVzZXJTZXJ2aWNlLmN1cnJlbnRfdXNlcjtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kb24oJ21vZGFsLmhpZGRlbicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5wcm9kdWN0cycpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5sb2dpbkRhdGEgPSB7fTtcclxuICAgICAgICAgICAgJHNjb3BlLnJlZ2lzdGVyRGF0YSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wZW5Mb2dpbk1vZGFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm9wZW5Nb2RhbCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY2xvc2VMb2dpbk1vZGFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5wcm9kdWN0cycpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2xvZ2luIHNlY3Rpb25cclxuICAgICAgICAgICAgJHNjb3BlLmRvUmVnaXN0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBMb2dpblNlcnZpY2UucmVnaXN0ZXJVc2VyKCRzY29wZS5yZWdpc3RlckRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlZ2lzdGVyRGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnxJDEg25nIGvDvSB0aMOgbmggY8O0bmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdWdWkgbMOybmcgxJHEg25nIG5o4bqtcCDEkeG7gyB0aeG6v3AgdOG7pWMnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfEkMSDbmcga8O9IGtow7RuZyB0aMOgbmggY8O0bmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IGRhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy9yZWdpc3RlciBzZWN0aW9uXHJcbiAgICAgICAgICAgICRzY29wZS5kb0xvZ2luID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgTG9naW5TZXJ2aWNlLmxvZ2luVXNlcigkc2NvcGUubG9naW5EYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIExvZ2luU2VydmljZS5nZXRJbmZvKCRzY29wZS5sb2dpbkRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEubmFtZSA9IGRhdGEudXNlci5mdWxsbmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmVtYWlsID0gZGF0YS51c2VyLmVtYWlsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEucGhvbmUgPSBkYXRhLnNoaXBwaW5nX2FkZHJlc3MudGVsZXBob25lX3NoaXA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5hZGRyZXNzID0gZGF0YS5zaGlwcGluZ19hZGRyZXNzLnN0cmVldF9zaGlwWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZGlzdHJpY3QgPSBkYXRhLnNoaXBwaW5nX2FkZHJlc3MuZGlzX3NoaXA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jaXR5ID0gZGF0YS5zaGlwcGluZ19hZGRyZXNzLmNpdHlfc2hpcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnBhc3N3b3JkID0gJHNjb3BlLmxvZ2luRGF0YS5wYXNzd29yZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBVc2VyU2VydmljZS5sb2dpbihkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VNb2RhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5wcm9kdWN0cycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdtZW51LnVzZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTG9naW4gZmFpbGVkIScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ1BsZWFzZSBjaGVjayB5b3VyIGNyZWRlbnRpYWxzISdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXHJcbiAgICBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xyXG4gICAgICAgIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXHJcbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvXCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvaG9tZS9ob21lLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbG9naW4nLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2xvZ2luXCIsXHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZWdpc3RlckxvZ2luQ29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvbWVudVwiLFxyXG4gICAgICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvbWVudS9tZW51Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNZW51Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudS5wcm9kdWN0cycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvcHJvZHVjdHNcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0cy5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdHNDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUucHJvZHVjdCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvcHJvZHVjdC86aWRcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LmNhcnQnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2NhcnRcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9jYXJ0L2NhcnQuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NhcnRDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUud2lzaGxpc3QnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3dpc2hsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvd2lzaGxpc3Qvd2lzaGxpc3QuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1dpc2hsaXN0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LmNoZWNrb3V0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jaGVja291dFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGVja291dENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudS5jaGVja291dF9lZGl0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jaGVja291dF9lZGl0XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXRfZWRpdC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ2hlY2tvdXRFZGl0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LnVzZXInLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3VzZXJcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC91c2VyL3VzZXIuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VzZXJDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgIH1cclxuXVxyXG47Il19
