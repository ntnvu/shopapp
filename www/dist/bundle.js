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
            cordova.plugins.Keyboard.disableScroll(true);

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
                            console.log(arr1[i]);
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
    .controller("CartController", ['$scope', '$localstorage', 'WishlistService', 'CartService','CheckoutService',
        function ($scope, $localstorage, WishlistService, CartService, CheckoutService) {
            $scope.cartlist = $localstorage.getObject("cart");
            $scope.lengthCart = $scope.cartlist.length;

            $scope.addToWishlist = function(item){
                WishlistService.addWishlist(item);
            }

            $scope.removeFromCart = function(item){
                CartService.removeCart(item);
                $scope.cartlist = $localstorage.getObject("cart");
                $scope.lengthCart = $scope.cartlist.length;
            }

            $scope.cart_checkout = function(){
                CheckoutService.sumTotal();
                $state.go('menu.checkout');
            }
        }]);
},{}],6:[function(require,module,exports){
'use strict';

module.exports = angular.module('cart.services', [])
    .service('CartService', function ($q, $localstorage, $rootScope, ProductService) {
        return {
            addCart: function (item) {
                if (!item.added) {
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
                item.added = !item.added;
                $localstorage.removeObject("cart", item);
                $localstorage.addAttribute("wishlist", item, "added", false);
                ProductService.addAttribute(item, "added", false);

                $rootScope.$broadcast("CartUpdate");
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

            $scope.checkoutInfo["methodShip"] = CheckoutService.shippingInfo.A;
            $scope.checkoutInfo["methodPayment"] = CheckoutService.paymentInfo.A;

            if(UserService.isLogin()){
                CheckoutService.updateCheckoutInfo($scope.user);
            }

            $scope.checkout = function(){
                $localstorage.setNull("cart");
                $rootScope.$broadcast("CartUpdate");
                $state.go("menu.products");
            }
        }]);
},{}],9:[function(require,module,exports){
'use strict';

module.exports = angular.module('checkoutEdit.controller', [])
    .controller("CheckoutEditController", ['$scope', '$localstorage', 'UserService','CheckoutService','$state',
        function ($scope,  $localstorage, UserService, CheckoutService, $state) {
            $scope.user = UserService.currentUser;
            $scope.checkoutInfo = CheckoutService.checkoutInfo;
            $scope.shippingInfo = CheckoutService.shippingInfo;
            $scope.paymentInfo = CheckoutService.paymentInfo;

            $scope.updateCheckout = function(){
                CheckoutService.addShipping($scope.checkoutInfo.methodShip);
                $state.go('menu.checkout');
            }
        }]);
},{}],10:[function(require,module,exports){
'use strict';

module.exports = angular.module('checkout.service', [])
    .factory('CheckoutService', function ($q, $localstorage) {
        var checkout_info = {
            total: 0,
            grandTotal: 0
        };

        var shipping_method = {
            "A": {
                text: "Tự lấy hàng tại cửa hàng 164 Trần Bình Trọng Q5 - HCM 0₫",
                value: 0
            },
            "B": {
                text: "Quận 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, Tân Bình, Tân Phú, Phú Nhuận, Bình Thạnh, Gò Vấp 10.000 ₫",
                value: 10000
            },
            "C": {
                text: "Quận Bình Tân, 9, 12, Thủ Đức 20.000 ₫",
                value: 20000
            },
            "D": {
                text: "Hóc Môn, Bình Chánh, Nhà Bè, Củ Chi 30.000 ₫",
                value: 30000
            },
            "E": {
                text: "Ship hàng đi các tỉnh trong nước 35.000 ₫",
                value: 35000
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
                checkout_info.total = 0;
                var cart = $localstorage.getObject("cart");
                for (var i in cart) {
                    checkout_info.total += cart[i].regular_price_with_tax;
                }
                checkout_info.grandTotal = checkout_info.total;
            },

            addShipping: function(methodShip){
                checkout_info.methodShip = methodShip;
                checkout_info.grandTotal = checkout_info.total + checkout_info.methodShip.value;
            },

            checkoutInfo: checkout_info,

            shippingInfo: shipping_method,

            paymentInfo: payment_method
        }
    });
},{}],11:[function(require,module,exports){
'use strict';
require('./home_controller');
require('../.././app_service');

module.exports = angular.module('home', ['app.service', "home.controller"]);


},{"../.././app_service":3,"./home_controller":12}],12:[function(require,module,exports){
'use strict';

module.exports = angular.module("home.controller", [])
    .controller("HomeController", ['$scope', 'LoginService','$localstorage','$state','ControlModalService','$timeout',
        function ($scope, LoginService, $localstorage, $state, ControlModalService, $timeout) {
            var currentUser = $localstorage.getObject("current_user");
            $timeout(function(){
                if(!currentUser.username){
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
    .controller("MenuController", ['$scope', '$ionicSideMenuDelegate', 'ProductService', '$state', 'ControlModalService', '$localstorage', 'UserService',
        function ($scope, $ionicSideMenuDelegate, ProductService, $state, ControlModalService, $localstorage, UserService) {
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
                ProductService.setType(type);
                ProductService.setPage(1);
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
    .controller("ProductController", ['$scope', 'ProductService', '$stateParams', 'WishlistService', '$http', 'ControlModalService', '$ionicSlideBoxDelegate', 'CartService','$localstorage',
        function ($scope, ProductService, $stateParams, WishlistService, $http, ControlModalService, $ionicSlideBoxDelegate, CartService, $localstorage) {
            var link_ajax = "http://shop10k.qrmartdemo.info/api/rest/products";
            $scope.product = {};
            $http.get(link_ajax + "/" + $stateParams.id).then(function (resp) {
                var temp = [];
                temp.push(resp.data);
                $localstorage.updateArray(temp, $localstorage.getObject("cart"),"added");
                $localstorage.updateArray(temp, $localstorage.getObject("wishlist"), "like");

                $scope.product.detail = temp;
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
    .controller("ProductsController", ['$scope', '$ionicSideMenuDelegate', 'ProductService', 'ControlModalService', 'WishlistService', 'CartService',
        function ($scope, $ionicSideMenuDelegate, ProductService, ControlModalService, WishlistService, CartService) {
            $scope.products = ProductService.productCurrent;

            $scope.openMenu = function () {
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.loadMoreData = function () {
                console.log(ProductService.getIndex());
                var temp = ProductService.getPage();
                if(temp == 1){
                    ProductService.setPage(2);
                }
                ProductService.filterProduct().then(function (data) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            $scope.add_to_cart = function (item) {
                CartService.addCart(item);
            }

            $scope.addToWishlist = function (item) {
                WishlistService.addWishlist(item);
            }
        }
    ]);

},{}],18:[function(require,module,exports){
"use strict"

module.exports = angular.module("products.factory", [])
    .factory('ProductService', function ($q, $http, $localstorage, $ionicLoading) {
        var products = [];
        var filter = {
            limit: 20,
            type: ''
        };
        var current_index = 0;

        function init(){
            products.length = 0;
            current_index = 0;
            for (var i = 0; i <= 200; i++) {
                products.push({
                    "entity_id" : i
                });
            }
        }

        function add_product(data) {
            var array = $.map(data, function (value, index) {
                return [value];
            });

            for (var i = array.length - 1; i >= 0; i--) {
                current_index++;
                products.push(array[i]);
            }
        }

        return{
            filterProduct: function () {
                var deferred = $q.defer();
                var promise = deferred.promise;
//                var link_ajax = "http://liquordelivery.com.sg/wp-admin/admin-ajax.php";
//                $http.get(link_ajax + "?action=latest_products_app&filter=" + filterType + "&page=" + page_next).then(function (resp) {
                filter.limit = 10;
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
                $http.get("http://shop10k.qrmartdemo.info/web_api.php?r="+ filter.type + "&limit="+ filter.limit + "&page=" + filter.page).then(function (resp) {
                    add_product(resp.data);

                    $ionicLoading.hide();

                    $localstorage.updateArray(products, $localstorage.getObject("cart"), "added");
                    $localstorage.updateArray(products, $localstorage.getObject("wishlist"), "like");

                    deferred.resolve(++filter.page);
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

            getPage: function(){
                return filter.page;
            },

            getIndex: function(){
                return current_index;
            },

            addAttribute: function (item, index) {
                for (var i in products) {
                    if (products[i].entity_id == item.entity_id) {
                        products[i][index] = item[index];
                    }
                }
            },

            clearProducts: function () {
                products.length = 0;
            },

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
            name : "Linh Đỗ",
            username: "test@advn.vn",
            email : "vilma.kilback@larkin.name",
            pass : "123456",
            phone : "335-104-2542",
            address : "800, Lạc Long Quân",
            district : "Quận Tân Bình",
            ward : "Phường 10",
            city : "Hồ Chí Minh",
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
    .service('LoginService', function ($q) {
        return {
            loginUser: loginUser
        }
        function loginUser(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            if (name == 'test@advn.vn' && pw == '123456') {
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
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
            $scope.result = function () {
                console.log(LoginService.rec);
            }

            $scope.$on('modal.hidden', function() {
                $state.go('menu.products');
            });

            $scope.loginData = {};

            $scope.openLoginModal = function () {
                $scope.openModal();
            }

            $scope.closeLoginModal = function () {
                $scope.closeModal();
                $state.go('menu.products');
            }

            //login section
            $scope.doRegister = function () {
                console.log('Doing register', $scope.loginData);

                // Simulate a login delay. Remove this and replace with your login
                // code if using a login system
                $timeout(function () {
                    $scope.closeLoginRegister();
                }, 1000);
            };


            //register section
            $scope.doLogin = function () {
                LoginService.loginUser($scope.loginData.email, $scope.loginData.pass)
                    .success(function (data) {
                        UserService.login($scope.user);
                        $scope.closeModal();
                        $state.go('menu.products');
                    })
                    .error(function (data) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Login failed!',
                            template: 'Please check your credentials!'
                        });
                    });

                // Simulate a login delay. Remove this and replace with your login
                // code if using a login system
//        $timeout(function () {
//            $scope.closeLoginRegister();
//        }, 1000);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIi4vd3d3L2pzL2FwcC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvYXBwLW1haW4uanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2FwcF9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2FydC9jYXJ0LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2FydC9jYXJ0X2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9jYXJ0L2NhcnRfc2VydmljZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXRfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0X2VkaXRfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0X3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9ob21lL2hvbWUuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9ob21lL2hvbWVfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L21lbnUvbWVudS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L21lbnUvbWVudV9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdF9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHMuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0c19jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHNfZmFjdG9yeS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3VzZXIvdXNlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3VzZXIvdXNlcl9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvdXNlci91c2VyX3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC93aXNobGlzdC93aXNobGlzdC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3dpc2hsaXN0L3dpc2hsaXN0X2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC93aXNobGlzdC93aXNobGlzdF9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL2NvbnRhY3QvY29udGFjdC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9jb250YWN0L2NvbnRhY3RfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9jb250YWN0L2NvbnRhY3Rfc2VydmljZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9yZWdpc3RlckxvZ2luL2xvZ2luX3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJfbG9naW5fY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvcm91dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vbW9kdWxlIG5vZGVcclxuLy9yZXF1aXJlKFwiYW5ndWxhclwiKTtcclxuXHJcbi8vbW9kdWxlIGZ1bmN0aW9uc1xyXG5yZXF1aXJlKFwiLi9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJMb2dpblwiKTtcclxucmVxdWlyZShcIi4vbW9kdWxlcy9jb250YWN0L2NvbnRhY3RcIik7XHJcbi8vbW9kdWxlIGxheW91dFxyXG5yZXF1aXJlKFwiLi9sYXlvdXQvaG9tZS9ob21lXCIpO1xyXG5yZXF1aXJlKFwiLi9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHNcIik7XHJcbnJlcXVpcmUoXCIuL2xheW91dC9tZW51L21lbnVcIik7XHJcbnJlcXVpcmUoXCIuL2xheW91dC9jYXJ0L2NhcnRcIik7XHJcbnJlcXVpcmUoXCIuL2xheW91dC9jaGVja291dC9jaGVja291dFwiKTtcclxucmVxdWlyZShcIi4vbGF5b3V0L3dpc2hsaXN0L3dpc2hsaXN0XCIpO1xyXG5yZXF1aXJlKFwiLi9sYXlvdXQvdXNlci91c2VyXCIpO1xyXG5yZXF1aXJlKFwiLi9hcHBfc2VydmljZVwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnQgPSBhbmd1bGFyLm1vZHVsZSgnc3RhcnRlcicsIFsnaW9uaWMnLCAnc2xpY2snLCAnYWtvZW5pZy5kZWNrZ3JpZCcsICduZy1tZmInLFxyXG4gICAgICAgIC8vZnVuY3Rpb25zXHJcbiAgICAgICAgJ3JlZ2lzdGVyTG9naW4nLFxyXG4gICAgICAgICdjb250YWN0JyxcclxuXHJcbiAgICAgICAgLy9sYXlvdXRcclxuICAgICAgICAnaG9tZScsXHJcbiAgICAgICAgJ21lbnUnLFxyXG4gICAgICAgICdwcm9kdWN0cycsXHJcbiAgICAgICAgJ2NhcnQnLFxyXG4gICAgICAgICdjaGVja291dCcsXHJcbiAgICAgICAgJ3dpc2hsaXN0JyxcclxuICAgICAgICAndXNlcicsXHJcblxyXG4gICAgICAgICdhcHAuc2VydmljZScsXHJcblxyXG4gICAgXSlcclxuICAgIC5jb25maWcocmVxdWlyZSgnLi9yb3V0ZXInKSlcclxuICAgIC5ydW4ocmVxdWlyZSgnLi9hcHAtbWFpbicpKTtcclxuXHJcblxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5mdW5jdGlvbiBBcHBNYWluKCRpb25pY1BsYXRmb3JtLCAkc3RhdGUpe1xyXG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxyXG4gICAgICAgIC8vIGZvciBmb3JtIGlucHV0cylcclxuICAgICAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZCkge1xyXG4gICAgICAgICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xyXG4gICAgICAgICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuZGlzYWJsZVNjcm9sbCh0cnVlKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XHJcbiAgICAgICAgICAgIC8vIG9yZy5hcGFjaGUuY29yZG92YS5zdGF0dXNiYXIgcmVxdWlyZWRcclxuICAgICAgICAgICAgU3RhdHVzQmFyLnN0eWxlRGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICRpb25pY1BsYXRmb3JtLm9uKCdyZXN1bWUnLCBmdW5jdGlvbigpe1xyXG4vLyAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XHJcbiAgICB9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbJyRpb25pY1BsYXRmb3JtJywgJyRzdGF0ZScsIEFwcE1haW5dOyIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VcIiwgW10pXHJcbiAgICAuZmFjdG9yeSgnJGxvY2Fsc3RvcmFnZScsIGZ1bmN0aW9uICgkd2luZG93LCAkaW9uaWNIaXN0b3J5KSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoa2V5LCBkZWZhdWx0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8IGRlZmF1bHRWYWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldE9iamVjdDogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldE9iamVjdDogZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSB8fCAne30nKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldE51bGw6IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0T2JqZWN0KGtleSwge30pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXROdWxsQWxsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5jbGVhckNhY2hlKCk7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFySGlzdG9yeSgpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkT2JqZWN0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gbmV3IEFycmF5KHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHZhciBhcnIgPSB0aGlzLmdldE9iamVjdChrZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNoYXJlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnJbaV0uZW50aXR5X2lkID09IHZhbHVlWzBdLmVudGl0eV9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2hhcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuY29uY2F0KGFycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGFycjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldE9iamVjdChrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIG9iakFyck5lZWRVcGRhdGUgOiBpcyBhbiBhcnJheSBuZWVkIHVwZGF0ZSBhZnRlciBtYWluIGFycmF5IGlzXHJcbiAgICAgICAgICAgICAqICovXHJcbiAgICAgICAgICAgIHJlbW92ZU9iamVjdDogZnVuY3Rpb24gKGtleSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IHRoaXMuZ2V0T2JqZWN0KGtleSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGFycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcnJbaV0uZW50aXR5X2lkID09IGl0ZW0uZW50aXR5X2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0T2JqZWN0KGtleSwgYXJyKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIG1lcmdlQXJyYXk6IGZ1bmN0aW9uIChhcnIxLCBhcnIyKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyMyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhcnIxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNoYXJlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gYXJyMilcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycjJbal0uZW50aXR5X2lkID09IGFycjFbaV0uZW50aXR5X2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNoYXJlZCkgYXJyMy5wdXNoKGFycjFbaV0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhcnIzID0gYXJyMy5jb25jYXQoYXJyMik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyMztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy9pbnB1dCAyIGFycmF5XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIGFycmF5IGNvbnRhaW4gYWxsIGVsZW1lbnRzIHdoaWNoIGFyZSBpbiBib3RoIGFycmF5IGFuZCB1cGRhdGUgZm9sbG93IGFycjJcclxuICAgICAgICAgICAgdXBkYXRlQXJyYXk6IGZ1bmN0aW9uIChhcnIxLCBhcnIyLCBrZXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYXJyMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gYXJyMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyMltqXS5lbnRpdHlfaWQgPT0gYXJyMVtpXS5lbnRpdHlfaWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnIxW2ldW2tleV0gPSBhcnIyW2pdW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhcnIxW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZEF0dHJpYnV0ZTogZnVuY3Rpb24gKGtleSwgaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhcnIgPSB0aGlzLmdldE9iamVjdChrZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycltpXS5lbnRpdHlfaWQgPT0gaXRlbS5lbnRpdHlfaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycltpXVtpbmRleF0gPSBpdGVtW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE9iamVjdChrZXksIGFycik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnNlcnZpY2UoJ0NvbnRyb2xNb2RhbFNlcnZpY2UnLCBmdW5jdGlvbiAoJHEsICRpb25pY01vZGFsLCAkcm9vdFNjb3BlLCAkdGltZW91dCwgJGNvbnRyb2xsZXIpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzaG93OiBzaG93XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNob3codGVtcGxldGVVcmwsIGNvbnRyb2xsZXIsIGF1dG9zaG93LCBwYXJhbWV0ZXJzLCBvcHRpb25zLCB3cmFwQ2Fsc3MpIHtcclxuICAgICAgICAgICAgLy8gR3JhYiB0aGUgaW5qZWN0b3IgYW5kIGNyZWF0ZSBhIG5ldyBzY29wZVxyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpLFxyXG4gICAgICAgICAgICAgICAgY3RybEluc3RhbmNlLFxyXG4gICAgICAgICAgICAgICAgbW9kYWxTY29wZSA9ICRyb290U2NvcGUuJG5ldygpLFxyXG4gICAgICAgICAgICAgICAgdGhpc1Njb3BlSWQgPSBtb2RhbFNjb3BlLiRpZCxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogJ3NsaWRlLWluLXVwJyxcclxuICAgICAgICAgICAgICAgICAgICBmb2N1c0ZpcnN0SW5wdXQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tkcm9wQ2xpY2tUb0Nsb3NlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGhhcmR3YXJlQmFja0J1dHRvbkNsb3NlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsQ2FsbGJhY2s6IG51bGxcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCh0ZW1wbGV0ZVVybCwge1xyXG4gICAgICAgICAgICAgICAgc2NvcGU6IG1vZGFsU2NvcGUsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IG9wdGlvbnMuYW5pbWF0aW9uLFxyXG4gICAgICAgICAgICAgICAgZm9jdXNGaXJzdElucHV0OiBvcHRpb25zLmZvY3VzRmlyc3RJbnB1dCxcclxuICAgICAgICAgICAgICAgIGJhY2tkcm9wQ2xpY2tUb0Nsb3NlOiBvcHRpb25zLmJhY2tkcm9wQ2xpY2tUb0Nsb3NlLFxyXG4gICAgICAgICAgICAgICAgaGFyZHdhcmVCYWNrQnV0dG9uQ2xvc2U6IG9wdGlvbnMuaGFyZHdhcmVCYWNrQnV0dG9uQ2xvc2VcclxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLm1vZGFsID0gbW9kYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUub3Blbk1vZGFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLm1vZGFsLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS5tb2RhbC5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS4kb24oJ21vZGFsLmhpZGRlbicsIGZ1bmN0aW9uICh0aGlzTW9kYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNNb2RhbC5jdXJyZW50U2NvcGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtb2RhbFNjb3BlSWQgPSB0aGlzTW9kYWwuY3VycmVudFNjb3BlLiRpZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzU2NvcGVJZCA9PT0gbW9kYWxTY29wZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfY2xlYW51cCh0aGlzTW9kYWwuY3VycmVudFNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJbnZva2UgdGhlIGNvbnRyb2xsZXJcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYWxzID0geyAnJHNjb3BlJzogbW9kYWxTY29wZSwgJ3BhcmFtZXRlcnMnOiBwYXJhbWV0ZXJzIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN0cmxFdmFsID0gX2V2YWxDb250cm9sbGVyKGNvbnRyb2xsZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0cmxJbnN0YW5jZSA9ICRjb250cm9sbGVyKGNvbnRyb2xsZXIsIGxvY2Fscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN0cmxFdmFsLmlzQ29udHJvbGxlckFzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0cmxJbnN0YW5jZS5vcGVuTW9kYWwgPSBtb2RhbFNjb3BlLm9wZW5Nb2RhbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RybEluc3RhbmNlLmNsb3NlTW9kYWwgPSBtb2RhbFNjb3BlLmNsb3NlTW9kYWw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXV0b3Nob3cpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS5tb2RhbC5zaG93KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLiRicm9hZGNhc3QoJ21vZGFsLmFmdGVyU2hvdycsIG1vZGFsU2NvcGUubW9kYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKG9wdGlvbnMubW9kYWxDYWxsYmFjaykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5tb2RhbENhbGxiYWNrKG1vZGFsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIF9jbGVhbnVwKHNjb3BlKSB7XHJcbiAgICAgICAgICAgIHNjb3BlLiRkZXN0cm95KCk7XHJcbiAgICAgICAgICAgIGlmIChzY29wZS5tb2RhbCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUubW9kYWwucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIF9ldmFsQ29udHJvbGxlcihjdHJsTmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgICAgICAgICAgICAgaXNDb250cm9sbGVyQXM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck5hbWU6ICcnLFxyXG4gICAgICAgICAgICAgICAgcHJvcE5hbWU6ICcnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHZhciBmcmFnbWVudHMgPSAoY3RybE5hbWUgfHwgJycpLnRyaW0oKS5zcGxpdCgvXFxzKy8pO1xyXG4gICAgICAgICAgICByZXN1bHQuaXNDb250cm9sbGVyQXMgPSBmcmFnbWVudHMubGVuZ3RoID09PSAzICYmIChmcmFnbWVudHNbMV0gfHwgJycpLnRvTG93ZXJDYXNlKCkgPT09ICdhcyc7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuaXNDb250cm9sbGVyQXMpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5jb250cm9sbGVyTmFtZSA9IGZyYWdtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wcm9wTmFtZSA9IGZyYWdtZW50c1syXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5jb250cm9sbGVyTmFtZSA9IGN0cmxOYW1lO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vY2FydF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4vY2FydF9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4vcHJvZHVjdHMvcHJvZHVjdHMnKTtcclxucmVxdWlyZSgnLi4vLi9jaGVja291dC9jaGVja291dCcpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiY2FydFwiLCBbJ2FwcC5zZXJ2aWNlJywgJ2NoZWNrb3V0JywgJ3Byb2R1Y3RzJywgJ2NhcnQuc2VydmljZXMnLCAnY2FydC5jb250cm9sbGVyJ10pO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NhcnQuY29udHJvbGxlcicsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJDYXJ0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckbG9jYWxzdG9yYWdlJywgJ1dpc2hsaXN0U2VydmljZScsICdDYXJ0U2VydmljZScsJ0NoZWNrb3V0U2VydmljZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2Fsc3RvcmFnZSwgV2lzaGxpc3RTZXJ2aWNlLCBDYXJ0U2VydmljZSwgQ2hlY2tvdXRTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5jYXJ0bGlzdCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKTtcclxuICAgICAgICAgICAgJHNjb3BlLmxlbmd0aENhcnQgPSAkc2NvcGUuY2FydGxpc3QubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFkZFRvV2lzaGxpc3QgPSBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgIFdpc2hsaXN0U2VydmljZS5hZGRXaXNobGlzdChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnJlbW92ZUZyb21DYXJ0ID0gZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgICBDYXJ0U2VydmljZS5yZW1vdmVDYXJ0KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNhcnRsaXN0ID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxlbmd0aENhcnQgPSAkc2NvcGUuY2FydGxpc3QubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY2FydF9jaGVja291dCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBDaGVja291dFNlcnZpY2Uuc3VtVG90YWwoKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5jaGVja291dCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NhcnQuc2VydmljZXMnLCBbXSlcclxuICAgIC5zZXJ2aWNlKCdDYXJ0U2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGxvY2Fsc3RvcmFnZSwgJHJvb3RTY29wZSwgUHJvZHVjdFNlcnZpY2UpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhZGRDYXJ0OiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpdGVtLmFkZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5hZGRlZCA9ICFpdGVtLmFkZGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ucXVhbnRpdHkgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuYWRkT2JqZWN0KFwiY2FydFwiLCBpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZEF0dHJpYnV0ZShcIndpc2hsaXN0XCIsIGl0ZW0sIFwiYWRkZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuYWRkQXR0cmlidXRlKGl0ZW0sIFwiYWRkZWRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIkNhcnRVcGRhdGVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUNhcnQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICByZW1vdmVDYXJ0OiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5hZGRlZCA9ICFpdGVtLmFkZGVkO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5yZW1vdmVPYmplY3QoXCJjYXJ0XCIsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5hZGRBdHRyaWJ1dGUoXCJ3aXNobGlzdFwiLCBpdGVtLCBcImFkZGVkXCIsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmFkZEF0dHJpYnV0ZShpdGVtLCBcImFkZGVkXCIsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJDYXJ0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9jaGVja291dF9jb250cm9sbGVyJyk7XHJcbnJlcXVpcmUoJy4vY2hlY2tvdXRfZWRpdF9jb250cm9sbGVyJyk7XHJcbnJlcXVpcmUoJy4vY2hlY2tvdXRfc2VydmljZScpO1xyXG5yZXF1aXJlKCcuLi8uL3VzZXIvdXNlcicpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiY2hlY2tvdXRcIiwgWydhcHAuc2VydmljZScsICd1c2VyJywgJ2NoZWNrb3V0LnNlcnZpY2UnLCAnY2hlY2tvdXQuY29udHJvbGxlcicsICdjaGVja291dEVkaXQuY29udHJvbGxlciddKSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NoZWNrb3V0LmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiQ2hlY2tvdXRDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRsb2NhbHN0b3JhZ2UnLCAnQ29udHJvbE1vZGFsU2VydmljZScsICckc3RhdGUnLCckcm9vdFNjb3BlJywgJ0NoZWNrb3V0U2VydmljZScsJ1VzZXJTZXJ2aWNlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYWxzdG9yYWdlLCBDb250cm9sTW9kYWxTZXJ2aWNlLCAkc3RhdGUsICRyb290U2NvcGUsIENoZWNrb3V0U2VydmljZSwgVXNlclNlcnZpY2UpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBVc2VyU2VydmljZS5jdXJyZW50VXNlcjtcclxuICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0SW5mbyA9IENoZWNrb3V0U2VydmljZS5jaGVja291dEluZm87XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY2hlY2tvdXRJbmZvW1wibWV0aG9kU2hpcFwiXSA9IENoZWNrb3V0U2VydmljZS5zaGlwcGluZ0luZm8uQTtcclxuICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0SW5mb1tcIm1ldGhvZFBheW1lbnRcIl0gPSBDaGVja291dFNlcnZpY2UucGF5bWVudEluZm8uQTtcclxuXHJcbiAgICAgICAgICAgIGlmKFVzZXJTZXJ2aWNlLmlzTG9naW4oKSl7XHJcbiAgICAgICAgICAgICAgICBDaGVja291dFNlcnZpY2UudXBkYXRlQ2hlY2tvdXRJbmZvKCRzY29wZS51c2VyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbChcImNhcnRcIik7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJDYXJ0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwibWVudS5wcm9kdWN0c1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjaGVja291dEVkaXQuY29udHJvbGxlcicsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJDaGVja291dEVkaXRDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRsb2NhbHN0b3JhZ2UnLCAnVXNlclNlcnZpY2UnLCdDaGVja291dFNlcnZpY2UnLCckc3RhdGUnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICAkbG9jYWxzdG9yYWdlLCBVc2VyU2VydmljZSwgQ2hlY2tvdXRTZXJ2aWNlLCAkc3RhdGUpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBVc2VyU2VydmljZS5jdXJyZW50VXNlcjtcclxuICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0SW5mbyA9IENoZWNrb3V0U2VydmljZS5jaGVja291dEluZm87XHJcbiAgICAgICAgICAgICRzY29wZS5zaGlwcGluZ0luZm8gPSBDaGVja291dFNlcnZpY2Uuc2hpcHBpbmdJbmZvO1xyXG4gICAgICAgICAgICAkc2NvcGUucGF5bWVudEluZm8gPSBDaGVja291dFNlcnZpY2UucGF5bWVudEluZm87XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlQ2hlY2tvdXQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgQ2hlY2tvdXRTZXJ2aWNlLmFkZFNoaXBwaW5nKCRzY29wZS5jaGVja291dEluZm8ubWV0aG9kU2hpcCk7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUuY2hlY2tvdXQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjaGVja291dC5zZXJ2aWNlJywgW10pXHJcbiAgICAuZmFjdG9yeSgnQ2hlY2tvdXRTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkbG9jYWxzdG9yYWdlKSB7XHJcbiAgICAgICAgdmFyIGNoZWNrb3V0X2luZm8gPSB7XHJcbiAgICAgICAgICAgIHRvdGFsOiAwLFxyXG4gICAgICAgICAgICBncmFuZFRvdGFsOiAwXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIHNoaXBwaW5nX21ldGhvZCA9IHtcclxuICAgICAgICAgICAgXCJBXCI6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFwiVOG7sSBs4bqleSBow6BuZyB04bqhaSBj4butYSBow6BuZyAxNjQgVHLhuqduIELDrG5oIFRy4buNbmcgUTUgLSBIQ00gMOKCq1wiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJCXCI6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFwiUXXhuq1uIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDEwLCAxMSwgVMOibiBCw6xuaCwgVMOibiBQaMO6LCBQaMO6IE5odeG6rW4sIELDrG5oIFRo4bqhbmgsIEfDsiBW4bqlcCAxMC4wMDAg4oKrXCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogMTAwMDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJDXCI6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFwiUXXhuq1uIELDrG5oIFTDom4sIDksIDEyLCBUaOG7pyDEkOG7qWMgMjAuMDAwIOKCq1wiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IDIwMDAwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiRFwiOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIkjDs2MgTcO0biwgQsOsbmggQ2jDoW5oLCBOaMOgIELDqCwgQ+G7pyBDaGkgMzAuMDAwIOKCq1wiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IDMwMDAwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiRVwiOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIlNoaXAgaMOgbmcgxJFpIGPDoWMgdOG7iW5oIHRyb25nIG7GsOG7m2MgMzUuMDAwIOKCq1wiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IDM1MDAwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgcGF5bWVudF9tZXRob2QgPSB7XHJcbiAgICAgICAgICAgIFwiQVwiOiBcIkNhc2ggT24gRGVsaXZlcnkgKHRoYW5oIHRvw6FuIGtoaSBuaOG6rW4gaMOgbmcpXCIsXHJcbiAgICAgICAgICAgIFwiQlwiOiBcIkJhbmsgVHJhbnNmZXIgUGF5bWVudCAoY2h1eeG7g24gcXVhIG5nw6JuIGjDoG5nKVwiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdXBkYXRlQ2hlY2tvdXRJbmZvOiBmdW5jdGlvbiAoaW5mbykge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBpbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tvdXRfaW5mb1tpXSA9IGluZm9baV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzdW1Ub3RhbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY2hlY2tvdXRfaW5mby50b3RhbCA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FydCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gY2FydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrb3V0X2luZm8udG90YWwgKz0gY2FydFtpXS5yZWd1bGFyX3ByaWNlX3dpdGhfdGF4O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2hlY2tvdXRfaW5mby5ncmFuZFRvdGFsID0gY2hlY2tvdXRfaW5mby50b3RhbDtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZFNoaXBwaW5nOiBmdW5jdGlvbihtZXRob2RTaGlwKXtcclxuICAgICAgICAgICAgICAgIGNoZWNrb3V0X2luZm8ubWV0aG9kU2hpcCA9IG1ldGhvZFNoaXA7XHJcbiAgICAgICAgICAgICAgICBjaGVja291dF9pbmZvLmdyYW5kVG90YWwgPSBjaGVja291dF9pbmZvLnRvdGFsICsgY2hlY2tvdXRfaW5mby5tZXRob2RTaGlwLnZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgY2hlY2tvdXRJbmZvOiBjaGVja291dF9pbmZvLFxyXG5cclxuICAgICAgICAgICAgc2hpcHBpbmdJbmZvOiBzaGlwcGluZ19tZXRob2QsXHJcblxyXG4gICAgICAgICAgICBwYXltZW50SW5mbzogcGF5bWVudF9tZXRob2RcclxuICAgICAgICB9XHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcbnJlcXVpcmUoJy4vaG9tZV9jb250cm9sbGVyJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2hvbWUnLCBbJ2FwcC5zZXJ2aWNlJywgXCJob21lLmNvbnRyb2xsZXJcIl0pO1xyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcImhvbWUuY29udHJvbGxlclwiLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiSG9tZUNvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnTG9naW5TZXJ2aWNlJywnJGxvY2Fsc3RvcmFnZScsJyRzdGF0ZScsJ0NvbnRyb2xNb2RhbFNlcnZpY2UnLCckdGltZW91dCcsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgTG9naW5TZXJ2aWNlLCAkbG9jYWxzdG9yYWdlLCAkc3RhdGUsIENvbnRyb2xNb2RhbFNlcnZpY2UsICR0aW1lb3V0KSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50VXNlciA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY3VycmVudF91c2VyXCIpO1xyXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgaWYoIWN1cnJlbnRVc2VyLnVzZXJuYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICBDb250cm9sTW9kYWxTZXJ2aWNlLnNob3coJ2pzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luLmh0bWwnLCAnUmVnaXN0ZXJMb2dpbkNvbnRyb2xsZXInLCAxKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5wcm9kdWN0cycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCAyMDAwKTtcclxuXHJcblxyXG4gICAgICAgICAgICAkc2NvcGUubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gZG8geW91ciAkKCkgc3R1ZmYgaGVyZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1dKTsiLCJcInVzZSBzdHJpY3RcIlxyXG5yZXF1aXJlKFwiLi9tZW51X2NvbnRyb2xsZXJcIik7XHJcbnJlcXVpcmUoJy4uLy4vdXNlci91c2VyJyk7XHJcbnJlcXVpcmUoXCIuLi8uL3Byb2R1Y3RzL3Byb2R1Y3RzXCIpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwibWVudVwiLCBbJ2FwcC5zZXJ2aWNlJywgJ3VzZXInLCBcInByb2R1Y3RzXCIsIFwibWVudS5jb250cm9sbGVyXCJdKVxyXG4gICAgLmNvbmZpZyhmdW5jdGlvbiAoJGlvbmljQ29uZmlnUHJvdmlkZXIpIHtcclxuICAgICAgICAkaW9uaWNDb25maWdQcm92aWRlci5iYWNrQnV0dG9uLnByZXZpb3VzVGl0bGVUZXh0KGZhbHNlKS50ZXh0KCcnKTtcclxuICAgIH0pOyIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwibWVudS5jb250cm9sbGVyXCIsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJNZW51Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckaW9uaWNTaWRlTWVudURlbGVnYXRlJywgJ1Byb2R1Y3RTZXJ2aWNlJywgJyRzdGF0ZScsICdDb250cm9sTW9kYWxTZXJ2aWNlJywgJyRsb2NhbHN0b3JhZ2UnLCAnVXNlclNlcnZpY2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsIFByb2R1Y3RTZXJ2aWNlLCAkc3RhdGUsIENvbnRyb2xNb2RhbFNlcnZpY2UsICRsb2NhbHN0b3JhZ2UsIFVzZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS53aXNobGlzdE51bWJlciA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIikubGVuZ3RoO1xyXG4gICAgICAgICAgICAkc2NvcGUuY2FydE51bWJlciA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKS5sZW5ndGg7XHJcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gVXNlclNlcnZpY2UuY3VycmVudFVzZXI7XHJcbiAgICAgICAgICAgIFVzZXJTZXJ2aWNlLmlzTG9naW4oKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0b1N0YXRlLm5hbWUgPT0gXCJtZW51LnByb2R1Y3RzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2hvd1Byb2R1Y3RCYWNrQnRuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2hvd1Byb2R1Y3RCYWNrQnRuID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdXaXNobGlzdFVwZGF0ZScsIGZ1bmN0aW9uIChldmVudCwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLndpc2hsaXN0TnVtYmVyID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJ3aXNobGlzdFwiKS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignQ2FydFVwZGF0ZScsIGZ1bmN0aW9uIChldmVudCwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNhcnROdW1iZXIgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIikubGVuZ3RoO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5maWx0ZXJUeXBlID0gW1xyXG4gICAgICAgICAgICAgICAge3R5cGU6IFwibmV3XCIsIG5hbWU6ICdT4bqjbiBwaOG6qW0gbeG7m2knfSxcclxuICAgICAgICAgICAgICAgIHt0eXBlOiBcInByb21vXCIsIG5hbWU6ICdT4bqjbiBwaOG6qW0ga2h1eeG6v24gbcOjaSd9LFxyXG4gICAgICAgICAgICAgICAge3R5cGU6IFwicHJpY2U1MGtcIiAsIG5hbWU6ICdEdW9pIDUwLjAwMCd9LFxyXG4gICAgICAgICAgICAgICAge3R5cGU6IFwicHJpY2UxMDBrXCIgLCBuYW1lOiAnNTAuMDAwIGRlbiAxMDAuMDAwJ30sXHJcbiAgICAgICAgICAgICAgICB7dHlwZTogXCJwcmljZTIwMGtcIiAsIG5hbWU6ICcxMDAuMDAwIGRlbiAyMDAuMDAwJ30sXHJcbiAgICAgICAgICAgICAgICB7dHlwZTogXCJwcmljZTIwMHVwXCIgLCBuYW1lOiAnVHJlbiAyMDAuMDAwJ31cclxuICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5vcGVuTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUudG9nZ2xlTGVmdCgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmdldFByb2R1Y3RzID0gZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLnNldFR5cGUodHlwZSk7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5zZXRQYWdlKDEpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuZmlsdGVyUHJvZHVjdCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY29udGFjdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIENvbnRyb2xNb2RhbFNlcnZpY2Uuc2hvdygnanMvbW9kdWxlcy9jb250YWN0L2NvbnRhY3QuaHRtbCcsICdDb250YWN0Q29udHJvbGxlcicsIDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2hvd19jYXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwibWVudS5jYXJ0XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXNlcl9pbmZvID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwibWVudS51c2VyXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudG9fbG9naW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBDb250cm9sTW9kYWxTZXJ2aWNlLnNob3coJ2pzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luLmh0bWwnLCAnUmVnaXN0ZXJMb2dpbkNvbnRyb2xsZXInLCAxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNpZ25vdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBVc2VyU2VydmljZS5zaWduT3V0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5nZXRQcm9kdWN0cyhcImFsbFwiKTtcclxuICAgICAgICB9XHJcbiAgICBdKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwcm9kdWN0LmNvbnRyb2xsZXJcIiwgW10pXHJcbiAgICAuY29udHJvbGxlcihcIlByb2R1Y3RDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJ1Byb2R1Y3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsICdXaXNobGlzdFNlcnZpY2UnLCAnJGh0dHAnLCAnQ29udHJvbE1vZGFsU2VydmljZScsICckaW9uaWNTbGlkZUJveERlbGVnYXRlJywgJ0NhcnRTZXJ2aWNlJywnJGxvY2Fsc3RvcmFnZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgUHJvZHVjdFNlcnZpY2UsICRzdGF0ZVBhcmFtcywgV2lzaGxpc3RTZXJ2aWNlLCAkaHR0cCwgQ29udHJvbE1vZGFsU2VydmljZSwgJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZSwgQ2FydFNlcnZpY2UsICRsb2NhbHN0b3JhZ2UpIHtcclxuICAgICAgICAgICAgdmFyIGxpbmtfYWpheCA9IFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL2FwaS9yZXN0L3Byb2R1Y3RzXCI7XHJcbiAgICAgICAgICAgICRzY29wZS5wcm9kdWN0ID0ge307XHJcbiAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXggKyBcIi9cIiArICRzdGF0ZVBhcmFtcy5pZCkudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRlbXAucHVzaChyZXNwLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS51cGRhdGVBcnJheSh0ZW1wLCAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIiksXCJhZGRlZFwiKTtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UudXBkYXRlQXJyYXkodGVtcCwgJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJ3aXNobGlzdFwiKSwgXCJsaWtlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICRzY29wZS5wcm9kdWN0LmRldGFpbCA9IHRlbXA7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJGh0dHAuZ2V0KGxpbmtfYWpheCArIFwiL1wiICsgJHN0YXRlUGFyYW1zLmlkICsgXCIvaW1hZ2VzXCIpLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5wcm9kdWN0LmltYWdlcyA9IHJlc3AuZGF0YTtcclxuICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVTbGlkZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkaHR0cC5nZXQobGlua19hamF4ICsgXCIvXCIgKyAkc3RhdGVQYXJhbXMuaWQgKyBcIi9jYXRlZ29yaWVzXCIpLnRoZW4oZnVuY3Rpb24gKGNhdCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3QuY2F0ZWdvcnkgPSBjYXQuZGF0YTtcclxuICAgICAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXggKyBcIj9jYXRlZ29yeV9pZD1cIiArICRzY29wZS5wcm9kdWN0LmNhdGVnb3J5WzBdLmNhdGVnb3J5X2lkKS50aGVuKGZ1bmN0aW9uIChyZWxhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJvZHVjdC5yZWxhdGVkID0gcmVsYXRlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlU2xpZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZS51cGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFkZFRvV2lzaGxpc3QgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgV2lzaGxpc3RTZXJ2aWNlLmFkZFdpc2hsaXN0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkX3RvX2NhcnQgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgQ2FydFNlcnZpY2UuYWRkQ2FydChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNob29zZVByb2R1Y3RPcHRpb24gPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgQ29udHJvbE1vZGFsU2VydmljZS5zaG93KCdqcy9tb2R1bGVzL2NhcnQvY2FydC5odG1sJywgJ0NhcnRDb250cm9sbGVyJywgMSwgaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XSk7XHJcblxyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5yZXF1aXJlKFwiLi9wcm9kdWN0c19mYWN0b3J5LmpzXCIpO1xyXG5yZXF1aXJlKFwiLi9wcm9kdWN0c19jb250cm9sbGVyLmpzXCIpO1xyXG5yZXF1aXJlKFwiLi9wcm9kdWN0X2NvbnRyb2xsZXIuanNcIik7XHJcbnJlcXVpcmUoJy4uLy4vd2lzaGxpc3Qvd2lzaGxpc3Rfc2VydmljZS5qcycpO1xyXG5yZXF1aXJlKCcuLi8uL2NhcnQvY2FydF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwcm9kdWN0c1wiLCBbJ2FwcC5zZXJ2aWNlJywgJ3dpc2hsaXN0LnNlcnZpY2UnLCAnY2FydC5zZXJ2aWNlcycsIFwicHJvZHVjdHMuZmFjdG9yeVwiLCBcInByb2R1Y3RzLmNvbnRyb2xsZXJcIiwgXCJwcm9kdWN0LmNvbnRyb2xsZXJcIl0pXHJcbiAgICAuY29uZmlnKGZ1bmN0aW9uICgkaW9uaWNDb25maWdQcm92aWRlcikge1xyXG4gICAgICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLmJhY2tCdXR0b24ucHJldmlvdXNUaXRsZVRleHQoZmFsc2UpLnRleHQoJycpO1xyXG4gICAgfSk7IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwcm9kdWN0cy5jb250cm9sbGVyXCIsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgnc3Bpbm5lck9uTG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5sb2FkZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYmluZCgnbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSlcclxuICAgIC5jb250cm9sbGVyKFwiUHJvZHVjdHNDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRpb25pY1NpZGVNZW51RGVsZWdhdGUnLCAnUHJvZHVjdFNlcnZpY2UnLCAnQ29udHJvbE1vZGFsU2VydmljZScsICdXaXNobGlzdFNlcnZpY2UnLCAnQ2FydFNlcnZpY2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsIFByb2R1Y3RTZXJ2aWNlLCBDb250cm9sTW9kYWxTZXJ2aWNlLCBXaXNobGlzdFNlcnZpY2UsIENhcnRTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5wcm9kdWN0cyA9IFByb2R1Y3RTZXJ2aWNlLnByb2R1Y3RDdXJyZW50O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wZW5NZW51ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS50b2dnbGVMZWZ0KCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUubG9hZE1vcmVEYXRhID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coUHJvZHVjdFNlcnZpY2UuZ2V0SW5kZXgoKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IFByb2R1Y3RTZXJ2aWNlLmdldFBhZ2UoKTtcclxuICAgICAgICAgICAgICAgIGlmKHRlbXAgPT0gMSl7XHJcbiAgICAgICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2Uuc2V0UGFnZSgyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmZpbHRlclByb2R1Y3QoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRicm9hZGNhc3QoJ3Njcm9sbC5pbmZpbml0ZVNjcm9sbENvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hZGRfdG9fY2FydCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBDYXJ0U2VydmljZS5hZGRDYXJ0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkVG9XaXNobGlzdCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBXaXNobGlzdFNlcnZpY2UuYWRkV2lzaGxpc3QoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICBdKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwcm9kdWN0cy5mYWN0b3J5XCIsIFtdKVxyXG4gICAgLmZhY3RvcnkoJ1Byb2R1Y3RTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkaHR0cCwgJGxvY2Fsc3RvcmFnZSwgJGlvbmljTG9hZGluZykge1xyXG4gICAgICAgIHZhciBwcm9kdWN0cyA9IFtdO1xyXG4gICAgICAgIHZhciBmaWx0ZXIgPSB7XHJcbiAgICAgICAgICAgIGxpbWl0OiAyMCxcclxuICAgICAgICAgICAgdHlwZTogJydcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBjdXJyZW50X2luZGV4ID0gMDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpe1xyXG4gICAgICAgICAgICBwcm9kdWN0cy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICBjdXJyZW50X2luZGV4ID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gMjAwOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIFwiZW50aXR5X2lkXCIgOiBpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkX3Byb2R1Y3QoZGF0YSkge1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSAkLm1hcChkYXRhLCBmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW3ZhbHVlXTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gYXJyYXkubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRfaW5kZXgrKztcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RzLnB1c2goYXJyYXlbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm57XHJcbiAgICAgICAgICAgIGZpbHRlclByb2R1Y3Q6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2U7XHJcbi8vICAgICAgICAgICAgICAgIHZhciBsaW5rX2FqYXggPSBcImh0dHA6Ly9saXF1b3JkZWxpdmVyeS5jb20uc2cvd3AtYWRtaW4vYWRtaW4tYWpheC5waHBcIjtcclxuLy8gICAgICAgICAgICAgICAgJGh0dHAuZ2V0KGxpbmtfYWpheCArIFwiP2FjdGlvbj1sYXRlc3RfcHJvZHVjdHNfYXBwJmZpbHRlcj1cIiArIGZpbHRlclR5cGUgKyBcIiZwYWdlPVwiICsgcGFnZV9uZXh0KS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXIubGltaXQgPSAxMDtcclxuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXIucGFnZSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhclByb2R1Y3RzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5zaG93KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdMb2FkaW5nLi4uJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlci5saW1pdCA9IDIwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICAgICAgICAgdmFyIGxpbmtfYWpheCA9IFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL2FwaS9yZXN0L3Byb2R1Y3RzXCI7XHJcbi8vICAgICAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXggKyBcIj9wYWdlPVwiICsgZmlsdGVyLnBhZ2UgKyBcIiZsaW1pdD1cIisgZmlsdGVyLmxpbWl0ICtcIiZvcmRlcj1lbnRpdHlfaWQmZGlyPWRzY1wiKS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGxpbmtfYWpheCA9IFwiaHR0cDovL3Nob3AxMGsucXJtYXJ0ZGVtby5pbmZvL2FwaS9yZXN0L3Byb2R1Y3RzXCI7XHJcbiAgICAgICAgICAgICAgICAkaHR0cC5nZXQoXCJodHRwOi8vc2hvcDEway5xcm1hcnRkZW1vLmluZm8vd2ViX2FwaS5waHA/cj1cIisgZmlsdGVyLnR5cGUgKyBcIiZsaW1pdD1cIisgZmlsdGVyLmxpbWl0ICsgXCImcGFnZT1cIiArIGZpbHRlci5wYWdlKS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkX3Byb2R1Y3QocmVzcC5kYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UudXBkYXRlQXJyYXkocHJvZHVjdHMsICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKSwgXCJhZGRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnVwZGF0ZUFycmF5KHByb2R1Y3RzLCAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcIndpc2hsaXN0XCIpLCBcImxpa2VcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKytmaWx0ZXIucGFnZSk7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZXJyLnN0YXR1cyB3aWxsIGNvbnRhaW4gdGhlIHN0YXR1cyBjb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRVJSJywgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0VSUiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXRQYWdlOiBmdW5jdGlvbiAobnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXIucGFnZSA9IG51bWJlcjtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldFR5cGU6IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXIudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXRQYWdlOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci5wYWdlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZ2V0SW5kZXg6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudF9pbmRleDtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGFkZEF0dHJpYnV0ZTogZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHByb2R1Y3RzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2R1Y3RzW2ldLmVudGl0eV9pZCA9PSBpdGVtLmVudGl0eV9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0c1tpXVtpbmRleF0gPSBpdGVtW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBjbGVhclByb2R1Y3RzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0cy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcHJvZHVjdEN1cnJlbnQ6IHByb2R1Y3RzXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4pXHJcbjsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCcuL3VzZXJfc2VydmljZS5qcycpO1xyXG5yZXF1aXJlKCcuL3VzZXJfY29udHJvbGxlci5qcycpO1xyXG5yZXF1aXJlKFwiLi4vLi9wcm9kdWN0cy9wcm9kdWN0c1wiKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcInVzZXJcIiwgWydhcHAuc2VydmljZScsICBcInByb2R1Y3RzXCIsICd1c2VyLnNlcnZpY2UnLCAndXNlci5jb250cm9sbGVyJ10pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ3VzZXIuY29udHJvbGxlcicsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJVc2VyQ29udHJvbGxlclwiLCBbJyRzY29wZScsJ1VzZXJTZXJ2aWNlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBVc2VyU2VydmljZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlciA9IFVzZXJTZXJ2aWNlLmN1cnJlbnRVc2VyO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZVVzZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgVXNlclNlcnZpY2UudXBkYXRlVXNlcigkc2NvcGUudXNlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICBdKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCd1c2VyLnNlcnZpY2UnLCBbXSlcclxuICAgIC5zZXJ2aWNlKCdVc2VyU2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGxvY2Fsc3RvcmFnZSwgUHJvZHVjdFNlcnZpY2UsICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgY3VycmVudF91c2VyID0ge1xyXG4gICAgICAgICAgICBuYW1lIDogXCJMaW5oIMSQ4buXXCIsXHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiBcInRlc3RAYWR2bi52blwiLFxyXG4gICAgICAgICAgICBlbWFpbCA6IFwidmlsbWEua2lsYmFja0BsYXJraW4ubmFtZVwiLFxyXG4gICAgICAgICAgICBwYXNzIDogXCIxMjM0NTZcIixcclxuICAgICAgICAgICAgcGhvbmUgOiBcIjMzNS0xMDQtMjU0MlwiLFxyXG4gICAgICAgICAgICBhZGRyZXNzIDogXCI4MDAsIEzhuqFjIExvbmcgUXXDom5cIixcclxuICAgICAgICAgICAgZGlzdHJpY3QgOiBcIlF14bqtbiBUw6JuIELDrG5oXCIsXHJcbiAgICAgICAgICAgIHdhcmQgOiBcIlBoxrDhu51uZyAxMFwiLFxyXG4gICAgICAgICAgICBjaXR5IDogXCJI4buTIENow60gTWluaFwiLFxyXG4gICAgICAgICAgICBwb3J0cmFpdDogXCJpbWcvcG9ydHJhaXQuanBnXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjdXJyZW50VXNlciA6IGN1cnJlbnRfdXNlcixcclxuXHJcbiAgICAgICAgICAgIGlzTG9naW4gOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgdmFyIHVzZXIgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcInVzZXJcIik7XHJcbiAgICAgICAgICAgICAgICBpZih1c2VyLmxvZ2luKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVVzZXIodXNlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHVwZGF0ZVVzZXIgOiBmdW5jdGlvbihpbmZvKXtcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaSBpbiBpbmZvKXtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50X3VzZXJbaV0gPSBpbmZvW2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2lnbk91dCA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50X3VzZXIubG9naW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbChcInVzZXJcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsKFwiY2FydFwiKTtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbChcIndpc2hsaXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2Uuc2V0UGFnZSgxKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmZpbHRlclByb2R1Y3QoKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIkNhcnRVcGRhdGVcIik7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJXaXNobGlzdFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGxvZ2luIDogZnVuY3Rpb24odXNlcil7XHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgaW4gdXNlcil7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudF91c2VyW2ldID0gdXNlcltpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1cnJlbnRfdXNlci5sb2dpbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE9iamVjdChcInVzZXJcIiwgY3VycmVudF91c2VyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE51bGwoXCJjYXJ0XCIpO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsKFwid2lzaGxpc3RcIik7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5zZXRQYWdlKDEpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuZmlsdGVyUHJvZHVjdCgpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiQ2FydFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIldpc2hsaXN0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi93aXNobGlzdF9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4vd2lzaGxpc3Rfc2VydmljZS5qcycpO1xyXG5yZXF1aXJlKCcuLi8uL3Byb2R1Y3RzL3Byb2R1Y3RzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJ3aXNobGlzdFwiLCBbJ2FwcC5zZXJ2aWNlJywgJ3Byb2R1Y3RzJywgJ3dpc2hsaXN0LnNlcnZpY2UnLCAnd2lzaGxpc3QuY29udHJvbGxlciddKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCd3aXNobGlzdC5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIldpc2hsaXN0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckbG9jYWxzdG9yYWdlJywnV2lzaGxpc3RTZXJ2aWNlJywnJHN0YXRlJywnQ2FydFNlcnZpY2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhbHN0b3JhZ2UsIFdpc2hsaXN0U2VydmljZSwgJHN0YXRlLCBDYXJ0U2VydmljZSkge1xyXG4vLyAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbEFsbCgpO1xyXG4gICAgICAgICAgICAkc2NvcGUud2lzaGxpc3ROdW1iZXIgPSBXaXNobGlzdFNlcnZpY2Uud2lzaGxpc3ROdW1iZXI7XHJcbiAgICAgICAgICAgICRzY29wZS53aXNobGlzdCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIik7XHJcbiAgICAgICAgICAgICRzY29wZS5sZW5ndGhXaXNobGlzdCA9ICRzY29wZS53aXNobGlzdC5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUucmVtb3ZlRnJvbVdpc2hsaXN0ID0gZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgICBXaXNobGlzdFNlcnZpY2UucmVtb3ZlV2lzaGxpc3QoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUud2lzaGxpc3QgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcIndpc2hsaXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxlbmd0aFdpc2hsaXN0ID0gJHNjb3BlLndpc2hsaXN0Lmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFkZF90b19jYXJ0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIENhcnRTZXJ2aWNlLmFkZENhcnQoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnd2lzaGxpc3Quc2VydmljZScsIFtdKVxyXG4gICAgLnNlcnZpY2UoJ1dpc2hsaXN0U2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGxvY2Fsc3RvcmFnZSwgJHJvb3RTY29wZSwgUHJvZHVjdFNlcnZpY2UpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhZGRXaXNobGlzdCA6IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgaWYoIWl0ZW0ubGlrZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5saWtlID0gIWl0ZW0ubGlrZTtcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZE9iamVjdChcIndpc2hsaXN0XCIsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuYWRkQXR0cmlidXRlKFwiY2FydFwiLCBpdGVtLCBcImxpa2VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuYWRkQXR0cmlidXRlKGl0ZW0sIFwibGlrZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiV2lzaGxpc3RVcGRhdGVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlV2lzaGxpc3QoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICByZW1vdmVXaXNobGlzdCA6IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgaXRlbS5saWtlID0gIWl0ZW0ubGlrZTtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UucmVtb3ZlT2JqZWN0KFwid2lzaGxpc3RcIiwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZEF0dHJpYnV0ZShcImNhcnRcIiwgaXRlbSwgXCJsaWtlXCIpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuYWRkQXR0cmlidXRlKGl0ZW0sIFwibGlrZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJXaXNobGlzdFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9jb250YWN0X3NlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi9jb250YWN0X2NvbnRyb2xsZXIuanMnKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcImNvbnRhY3RcIiwgWydhcHAuc2VydmljZScsICdjb250YWN0LnNlcnZpY2VzJywgJ2NvbnRhY3QuY29udHJvbGxlciddKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjb250YWN0LmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiQ29udGFjdENvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAncGFyYW1ldGVycycsICckbG9jYWxzdG9yYWdlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBwYXJhbWV0ZXJzLCAkbG9jYWxzdG9yYWdlKSB7XHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3Quc2VydmljZXMnLCBbXSlcclxuICAgIC5zZXJ2aWNlKCdDb250YWN0U2VydmljZScsIGZ1bmN0aW9uICgkcSkge1xyXG5cclxuXHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdyZWdpc3RlckxvZ2luLnNlcnZpY2VzJywgW10pXHJcbiAgICAuc2VydmljZSgnTG9naW5TZXJ2aWNlJywgZnVuY3Rpb24gKCRxKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbG9naW5Vc2VyOiBsb2dpblVzZXJcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gbG9naW5Vc2VyKG5hbWUsIHB3KSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChuYW1lID09ICd0ZXN0QGFkdm4udm4nICYmIHB3ID09ICcxMjM0NTYnKSB7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCdXZWxjb21lICcgKyBuYW1lICsgJyEnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgnV3JvbmcgY3JlZGVudGlhbHMuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvbWlzZS5zdWNjZXNzID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oZm4pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvbWlzZS5lcnJvciA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKG51bGwsIGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH1cclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vbG9naW5fc2VydmljZS5qcycpO1xyXG5yZXF1aXJlKCcuL3JlZ2lzdGVyX2xvZ2luX2NvbnRyb2xsZXIuanMnKTtcclxucmVxdWlyZSgnLi4vLi4vLi9sYXlvdXQvdXNlci91c2VyJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJyZWdpc3RlckxvZ2luXCIsIFsnYXBwLnNlcnZpY2UnLCAndXNlcicsICdyZWdpc3RlckxvZ2luLnNlcnZpY2VzJywgJ3JlZ2lzdGVyTG9naW4uY29udHJvbGxlciddKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdyZWdpc3RlckxvZ2luLmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiUmVnaXN0ZXJMb2dpbkNvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnTG9naW5TZXJ2aWNlJywgJyRzdGF0ZScsICckaW9uaWNQb3B1cCcsICckbG9jYWxzdG9yYWdlJywgJ1VzZXJTZXJ2aWNlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBMb2dpblNlcnZpY2UsICRzdGF0ZSwgJGlvbmljUG9wdXAsICRsb2NhbHN0b3JhZ2UsIFVzZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gVXNlclNlcnZpY2UuY3VycmVudF91c2VyO1xyXG4gICAgICAgICAgICAkc2NvcGUucmVzdWx0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coTG9naW5TZXJ2aWNlLnJlYyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kb24oJ21vZGFsLmhpZGRlbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdtZW51LnByb2R1Y3RzJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmxvZ2luRGF0YSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wZW5Mb2dpbk1vZGFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm9wZW5Nb2RhbCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY2xvc2VMb2dpbk1vZGFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5wcm9kdWN0cycpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2xvZ2luIHNlY3Rpb25cclxuICAgICAgICAgICAgJHNjb3BlLmRvUmVnaXN0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRG9pbmcgcmVnaXN0ZXInLCAkc2NvcGUubG9naW5EYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTaW11bGF0ZSBhIGxvZ2luIGRlbGF5LiBSZW1vdmUgdGhpcyBhbmQgcmVwbGFjZSB3aXRoIHlvdXIgbG9naW5cclxuICAgICAgICAgICAgICAgIC8vIGNvZGUgaWYgdXNpbmcgYSBsb2dpbiBzeXN0ZW1cclxuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VMb2dpblJlZ2lzdGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgICAgICAvL3JlZ2lzdGVyIHNlY3Rpb25cclxuICAgICAgICAgICAgJHNjb3BlLmRvTG9naW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBMb2dpblNlcnZpY2UubG9naW5Vc2VyKCRzY29wZS5sb2dpbkRhdGEuZW1haWwsICRzY29wZS5sb2dpbkRhdGEucGFzcylcclxuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBVc2VyU2VydmljZS5sb2dpbigkc2NvcGUudXNlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5wcm9kdWN0cycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdMb2dpbiBmYWlsZWQhJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnUGxlYXNlIGNoZWNrIHlvdXIgY3JlZGVudGlhbHMhJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTaW11bGF0ZSBhIGxvZ2luIGRlbGF5LiBSZW1vdmUgdGhpcyBhbmQgcmVwbGFjZSB3aXRoIHlvdXIgbG9naW5cclxuICAgICAgICAgICAgICAgIC8vIGNvZGUgaWYgdXNpbmcgYSBsb2dpbiBzeXN0ZW1cclxuLy8gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgICAgICAkc2NvcGUuY2xvc2VMb2dpblJlZ2lzdGVyKCk7XHJcbi8vICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcclxuICAgIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XHJcbiAgICAgICAgLy8gaWYgbm9uZSBvZiB0aGUgYWJvdmUgc3RhdGVzIGFyZSBtYXRjaGVkLCB1c2UgdGhpcyBhcyB0aGUgZmFsbGJhY2tcclxuICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdob21lJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9cIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9ob21lL2hvbWUuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdsb2dpbicsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvbG9naW5cIixcclxuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbW9kdWxlcy9yZWdpc3RlckxvZ2luL3JlZ2lzdGVyTG9naW4uaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlZ2lzdGVyTG9naW5Db250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9tZW51XCIsXHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9tZW51L21lbnUuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01lbnVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LnByb2R1Y3RzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9kdWN0c1wiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L3Byb2R1Y3RzL3Byb2R1Y3RzLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0c0NvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudS5wcm9kdWN0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9kdWN0LzppZFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L3Byb2R1Y3RzL3Byb2R1Y3QuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2R1Y3RDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUuY2FydCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvY2FydFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L2NhcnQvY2FydC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ2FydENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudS53aXNobGlzdCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvd2lzaGxpc3RcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC93aXNobGlzdC93aXNobGlzdC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnV2lzaGxpc3RDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUuY2hlY2tvdXQnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2NoZWNrb3V0XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXQuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NoZWNrb3V0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LmNoZWNrb3V0X2VkaXQnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2NoZWNrb3V0X2VkaXRcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9jaGVja291dC9jaGVja291dF9lZGl0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGVja291dEVkaXRDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUudXNlcicsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvdXNlclwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L3VzZXIvdXNlci5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVXNlckNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgfVxyXG5dXHJcbjsiXX0=
