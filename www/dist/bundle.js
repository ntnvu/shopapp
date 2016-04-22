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
require('../.././app_service');

module.exports = angular.module("cart", ['app.service', 'products', 'cart.services', 'cart.controller']);






},{"../.././app_service":3,".././products/products":16,"./cart_controller.js":5,"./cart_service.js":6}],5:[function(require,module,exports){
'use strict';

module.exports = angular.module('cart.controller', [])
    .controller("CartController", ['$scope', '$localstorage', 'WishlistService', 'CartService',
        function ($scope, $localstorage, WishlistService, CartService) {
            $scope.cartlist = $localstorage.getObject("cart");

            $scope.addToWishlist = function(item){
                WishlistService.addWishlist(item);
            }

            $scope.removeFromCart = function(item){
                CartService.removeCart(item);
                $scope.cartlist = $localstorage.getObject("cart");
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

module.exports = angular.module("checkout", ['app.service', 'user', 'checkout.service', 'checkout.controller', 'checkoutEdit.controller']);
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
                CheckoutService.updateCheckoutInfo($scope.checkoutInfo);
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
                this.sumTotal();
            },

            sumTotal: function () {
                var cart = $localstorage.getObject("cart");
                for (var i in cart) {
                    checkout_info.total += cart[i].regular_price_with_tax;
                }
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
                {type: "hot", name: 'San pham hot'},
                {type: "bestseller", name: 'San pham ban chay'},
                {type: {
                    lt: 50
                }, name: 'Duoi 50.000'},
                {type: {
                    rand: [50, 100]
                }, name: '50.000 den 100.000'},
                {type: {
                    rand: [100, 200]
                }, name: '100.000 den 200.000'},
                {type: {
                    gt: 200
                }, name: 'Tren 200.000'}
            ];

            $scope.openMenu = function () {
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.getProducts = function (type) {
                type = JSON.stringify(type);
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

            $scope.getProducts("hot");
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

                $localstorage.updateArray(resp.data, $localstorage.getObject("cart"),"added");
                $localstorage.updateArray(resp.data, $localstorage.getObject("wishlist"), "like");

                $scope.product.detail = resp.data;
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
    .controller("ProductsController", ['$scope', '$ionicSideMenuDelegate', 'ProductService', 'ControlModalService', 'WishlistService','CartService',
        function ($scope, $ionicSideMenuDelegate, ProductService, ControlModalService, WishlistService, CartService) {
            $scope.products = ProductService.productCurrent;

            $scope.openMenu = function () {
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.loadMoreData = function () {
                ProductService.filterProduct().then(function(data){
                    ProductService.setPage(++data);
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
    .factory('ProductService', function ($q, $http, $localstorage) {
        var products = [];
        var filter = {
            page: 1,
            type: ''
        };

        function add_product(data) {
            var array = $.map(data, function (value, index) {
                return [value];
            });

            for (var i = array.length - 1; i >= 0; i--) {
                products.push(array[i]);
            }
        }

        return{
            filterProduct: function () {
                var deferred = $q.defer();
                var promise = deferred.promise;
//                var link_ajax = "http://liquordelivery.com.sg/wp-admin/admin-ajax.php";
//                $http.get(link_ajax + "?action=latest_products_app&filter=" + filterType + "&page=" + page_next).then(function (resp) {
                if(filter.page == 1){
                     this.clearProducts();
                }

                var link_ajax = "http://shop10k.qrmartdemo.info/api/rest/products";
                $http.get(link_ajax + "?page=" + filter.page + "&limit=20&order=entity_id&dir=dsc").then(function (resp) {
                    add_product(resp.data);
                    deferred.resolve(filter.page++);

                    $localstorage.updateArray(products, $localstorage.getObject("cart"),"added");
                    $localstorage.updateArray(products, $localstorage.getObject("wishlist"), "like");

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

            addAttribute : function(item, index){
                for(var i in products){
                    if(products[i].entity_id == item.entity_id){
                        products[i][index] = item[index];
                    }
                }
            },

            clearProducts : function(){
                products.length = 0;
            },

            productCurrent: products,

            page: filter.page
        }
    });
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

            $scope.removeFromWishlist = function(item){
                WishlistService.removeWishlist(item);
                $scope.wishlist = $localstorage.getObject("wishlist");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIi4vd3d3L2pzL2FwcC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvYXBwLW1haW4uanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2FwcF9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2FydC9jYXJ0LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2FydC9jYXJ0X2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9jYXJ0L2NhcnRfc2VydmljZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXRfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0X2VkaXRfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0X3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9ob21lL2hvbWUuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9ob21lL2hvbWVfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L21lbnUvbWVudS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L21lbnUvbWVudV9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdF9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHMuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0c19jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHNfZmFjdG9yeS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3VzZXIvdXNlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3VzZXIvdXNlcl9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvdXNlci91c2VyX3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC93aXNobGlzdC93aXNobGlzdC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3dpc2hsaXN0L3dpc2hsaXN0X2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC93aXNobGlzdC93aXNobGlzdF9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL2NvbnRhY3QvY29udGFjdC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9jb250YWN0L2NvbnRhY3RfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9jb250YWN0L2NvbnRhY3Rfc2VydmljZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9yZWdpc3RlckxvZ2luL2xvZ2luX3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJfbG9naW5fY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvcm91dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy9tb2R1bGUgbm9kZVxyXG4vL3JlcXVpcmUoXCJhbmd1bGFyXCIpO1xyXG5cclxuLy9tb2R1bGUgZnVuY3Rpb25zXHJcbnJlcXVpcmUoXCIuL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luXCIpO1xyXG5yZXF1aXJlKFwiLi9tb2R1bGVzL2NvbnRhY3QvY29udGFjdFwiKTtcclxuLy9tb2R1bGUgbGF5b3V0XHJcbnJlcXVpcmUoXCIuL2xheW91dC9ob21lL2hvbWVcIik7XHJcbnJlcXVpcmUoXCIuL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0c1wiKTtcclxucmVxdWlyZShcIi4vbGF5b3V0L21lbnUvbWVudVwiKTtcclxucmVxdWlyZShcIi4vbGF5b3V0L2NhcnQvY2FydFwiKTtcclxucmVxdWlyZShcIi4vbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0XCIpO1xyXG5yZXF1aXJlKFwiLi9sYXlvdXQvd2lzaGxpc3Qvd2lzaGxpc3RcIik7XHJcbnJlcXVpcmUoXCIuL2xheW91dC91c2VyL3VzZXJcIik7XHJcbnJlcXVpcmUoXCIuL2FwcF9zZXJ2aWNlXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydCA9IGFuZ3VsYXIubW9kdWxlKCdzdGFydGVyJywgWydpb25pYycsICdzbGljaycsICdha29lbmlnLmRlY2tncmlkJywgJ25nLW1mYicsXHJcbiAgICAgICAgLy9mdW5jdGlvbnNcclxuICAgICAgICAncmVnaXN0ZXJMb2dpbicsXHJcbiAgICAgICAgJ2NvbnRhY3QnLFxyXG5cclxuICAgICAgICAvL2xheW91dFxyXG4gICAgICAgICdob21lJyxcclxuICAgICAgICAnbWVudScsXHJcbiAgICAgICAgJ3Byb2R1Y3RzJyxcclxuICAgICAgICAnY2FydCcsXHJcbiAgICAgICAgJ2NoZWNrb3V0JyxcclxuICAgICAgICAnd2lzaGxpc3QnLFxyXG4gICAgICAgICd1c2VyJyxcclxuXHJcbiAgICAgICAgJ2FwcC5zZXJ2aWNlJyxcclxuXHJcbiAgICBdKVxyXG4gICAgLmNvbmZpZyhyZXF1aXJlKCcuL3JvdXRlcicpKVxyXG4gICAgLnJ1bihyZXF1aXJlKCcuL2FwcC1tYWluJykpO1xyXG5cclxuXHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcbmZ1bmN0aW9uIEFwcE1haW4oJGlvbmljUGxhdGZvcm0sICRzdGF0ZSl7XHJcbiAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXHJcbiAgICAgICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxyXG4gICAgICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XHJcbiAgICAgICAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XHJcbiAgICAgICAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5kaXNhYmxlU2Nyb2xsKHRydWUpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcclxuICAgICAgICAgICAgLy8gb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxyXG4gICAgICAgICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGlvbmljUGxhdGZvcm0ub24oJ3Jlc3VtZScsIGZ1bmN0aW9uKCl7XHJcbi8vICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFsnJGlvbmljUGxhdGZvcm0nLCAnJHN0YXRlJywgQXBwTWFpbl07IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJhcHAuc2VydmljZVwiLCBbXSlcclxuICAgIC5mYWN0b3J5KCckbG9jYWxzdG9yYWdlJywgZnVuY3Rpb24gKCR3aW5kb3csICRpb25pY0hpc3RvcnkpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChrZXksIGRlZmF1bHRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gfHwgZGVmYXVsdFZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0T2JqZWN0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0T2JqZWN0OiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8ICd7fScpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0TnVsbDogZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRPYmplY3Qoa2V5LCB7fSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldE51bGxBbGw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFyQ2FjaGUoKTtcclxuICAgICAgICAgICAgICAgICRpb25pY0hpc3RvcnkuY2xlYXJIaXN0b3J5KCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRPYmplY3Q6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBuZXcgQXJyYXkodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IHRoaXMuZ2V0T2JqZWN0KGtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2hhcmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycltpXS5lbnRpdHlfaWQgPT0gdmFsdWVbMF0uZW50aXR5X2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzaGFyZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5jb25jYXQoYXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gYXJyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0T2JqZWN0KGtleSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogb2JqQXJyTmVlZFVwZGF0ZSA6IGlzIGFuIGFycmF5IG5lZWQgdXBkYXRlIGFmdGVyIG1haW4gYXJyYXkgaXNcclxuICAgICAgICAgICAgICogKi9cclxuICAgICAgICAgICAgcmVtb3ZlT2JqZWN0OiBmdW5jdGlvbiAoa2V5LCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gdGhpcy5nZXRPYmplY3Qoa2V5KTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFycltpXS5lbnRpdHlfaWQgPT0gaXRlbS5lbnRpdHlfaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRPYmplY3Qoa2V5LCBhcnIpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgbWVyZ2VBcnJheTogZnVuY3Rpb24gKGFycjEsIGFycjIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhcnIzID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGFycjEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2hhcmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBhcnIyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyMltqXS5lbnRpdHlfaWQgPT0gYXJyMVtpXS5lbnRpdHlfaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2hhcmVkKSBhcnIzLnB1c2goYXJyMVtpXSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGFycjMgPSBhcnIzLmNvbmNhdChhcnIyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhcnIzO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvL2lucHV0IDIgYXJyYXlcclxuICAgICAgICAgICAgLy9yZXR1cm4gYXJyYXkgY29udGFpbiBhbGwgZWxlbWVudHMgd2hpY2ggYXJlIGluIGJvdGggYXJyYXkgYW5kIHVwZGF0ZSBmb2xsb3cgYXJyMlxyXG4gICAgICAgICAgICB1cGRhdGVBcnJheTogZnVuY3Rpb24gKGFycjEsIGFycjIsIGtleSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhcnIxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBhcnIyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnIyW2pdLmVudGl0eV9pZCA9PSBhcnIxW2ldLmVudGl0eV9pZCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycjFbaV1ba2V5XSA9IGFycjJbal1ba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFycjFbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkQXR0cmlidXRlOiBmdW5jdGlvbiAoa2V5LCBpdGVtLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IHRoaXMuZ2V0T2JqZWN0KGtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGFycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyW2ldLmVudGl0eV9pZCA9PSBpdGVtLmVudGl0eV9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyW2ldW2luZGV4XSA9IGl0ZW1baW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0T2JqZWN0KGtleSwgYXJyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICAuc2VydmljZSgnQ29udHJvbE1vZGFsU2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGlvbmljTW9kYWwsICRyb290U2NvcGUsICR0aW1lb3V0LCAkY29udHJvbGxlcikge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNob3c6IHNob3dcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gc2hvdyh0ZW1wbGV0ZVVybCwgY29udHJvbGxlciwgYXV0b3Nob3csIHBhcmFtZXRlcnMsIG9wdGlvbnMsIHdyYXBDYWxzcykge1xyXG4gICAgICAgICAgICAvLyBHcmFiIHRoZSBpbmplY3RvciBhbmQgY3JlYXRlIGEgbmV3IHNjb3BlXHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCksXHJcbiAgICAgICAgICAgICAgICBjdHJsSW5zdGFuY2UsXHJcbiAgICAgICAgICAgICAgICBtb2RhbFNjb3BlID0gJHJvb3RTY29wZS4kbmV3KCksXHJcbiAgICAgICAgICAgICAgICB0aGlzU2NvcGVJZCA9IG1vZGFsU2NvcGUuJGlkLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiAnc2xpZGUtaW4tdXAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvY3VzRmlyc3RJbnB1dDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2Ryb3BDbGlja1RvQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgaGFyZHdhcmVCYWNrQnV0dG9uQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxDYWxsYmFjazogbnVsbFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgJGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKHRlbXBsZXRlVXJsLCB7XHJcbiAgICAgICAgICAgICAgICBzY29wZTogbW9kYWxTY29wZSxcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogb3B0aW9ucy5hbmltYXRpb24sXHJcbiAgICAgICAgICAgICAgICBmb2N1c0ZpcnN0SW5wdXQ6IG9wdGlvbnMuZm9jdXNGaXJzdElucHV0LFxyXG4gICAgICAgICAgICAgICAgYmFja2Ryb3BDbGlja1RvQ2xvc2U6IG9wdGlvbnMuYmFja2Ryb3BDbGlja1RvQ2xvc2UsXHJcbiAgICAgICAgICAgICAgICBoYXJkd2FyZUJhY2tCdXR0b25DbG9zZTogb3B0aW9ucy5oYXJkd2FyZUJhY2tCdXR0b25DbG9zZVxyXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWwgPSBtb2RhbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWwuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLm1vZGFsLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLiRvbignbW9kYWwuaGlkZGVuJywgZnVuY3Rpb24gKHRoaXNNb2RhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc01vZGFsLmN1cnJlbnRTY29wZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1vZGFsU2NvcGVJZCA9IHRoaXNNb2RhbC5jdXJyZW50U2NvcGUuJGlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNTY29wZUlkID09PSBtb2RhbFNjb3BlSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jbGVhbnVwKHRoaXNNb2RhbC5jdXJyZW50U2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEludm9rZSB0aGUgY29udHJvbGxlclxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsb2NhbHMgPSB7ICckc2NvcGUnOiBtb2RhbFNjb3BlLCAncGFyYW1ldGVycyc6IHBhcmFtZXRlcnMgfTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY3RybEV2YWwgPSBfZXZhbENvbnRyb2xsZXIoY29udHJvbGxlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybEluc3RhbmNlID0gJGNvbnRyb2xsZXIoY29udHJvbGxlciwgbG9jYWxzKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3RybEV2YWwuaXNDb250cm9sbGVyQXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RybEluc3RhbmNlLm9wZW5Nb2RhbCA9IG1vZGFsU2NvcGUub3Blbk1vZGFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHJsSW5zdGFuY2UuY2xvc2VNb2RhbCA9IG1vZGFsU2NvcGUuY2xvc2VNb2RhbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdXRvc2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLm1vZGFsLnNob3coKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUuJGJyb2FkY2FzdCgnbW9kYWwuYWZ0ZXJTaG93JywgbW9kYWxTY29wZS5tb2RhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24ob3B0aW9ucy5tb2RhbENhbGxiYWNrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm1vZGFsQ2FsbGJhY2sobW9kYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX2NsZWFudXAoc2NvcGUpIHtcclxuICAgICAgICAgICAgc2NvcGUuJGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgaWYgKHNjb3BlLm1vZGFsKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5tb2RhbC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX2V2YWxDb250cm9sbGVyKGN0cmxOYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7XHJcbiAgICAgICAgICAgICAgICBpc0NvbnRyb2xsZXJBczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyTmFtZTogJycsXHJcbiAgICAgICAgICAgICAgICBwcm9wTmFtZTogJydcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdmFyIGZyYWdtZW50cyA9IChjdHJsTmFtZSB8fCAnJykudHJpbSgpLnNwbGl0KC9cXHMrLyk7XHJcbiAgICAgICAgICAgIHJlc3VsdC5pc0NvbnRyb2xsZXJBcyA9IGZyYWdtZW50cy5sZW5ndGggPT09IDMgJiYgKGZyYWdtZW50c1sxXSB8fCAnJykudG9Mb3dlckNhc2UoKSA9PT0gJ2FzJztcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5pc0NvbnRyb2xsZXJBcykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmNvbnRyb2xsZXJOYW1lID0gZnJhZ21lbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnByb3BOYW1lID0gZnJhZ21lbnRzWzJdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmNvbnRyb2xsZXJOYW1lID0gY3RybE5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9jYXJ0X3NlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi9jYXJ0X2NvbnRyb2xsZXIuanMnKTtcclxucmVxdWlyZSgnLi4vLi9wcm9kdWN0cy9wcm9kdWN0cycpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiY2FydFwiLCBbJ2FwcC5zZXJ2aWNlJywgJ3Byb2R1Y3RzJywgJ2NhcnQuc2VydmljZXMnLCAnY2FydC5jb250cm9sbGVyJ10pO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NhcnQuY29udHJvbGxlcicsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJDYXJ0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckbG9jYWxzdG9yYWdlJywgJ1dpc2hsaXN0U2VydmljZScsICdDYXJ0U2VydmljZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2Fsc3RvcmFnZSwgV2lzaGxpc3RTZXJ2aWNlLCBDYXJ0U2VydmljZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUuY2FydGxpc3QgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIik7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkVG9XaXNobGlzdCA9IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgV2lzaGxpc3RTZXJ2aWNlLmFkZFdpc2hsaXN0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUucmVtb3ZlRnJvbUNhcnQgPSBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgIENhcnRTZXJ2aWNlLnJlbW92ZUNhcnQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2FydGxpc3QgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NhcnQuc2VydmljZXMnLCBbXSlcclxuICAgIC5zZXJ2aWNlKCdDYXJ0U2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGxvY2Fsc3RvcmFnZSwgJHJvb3RTY29wZSwgUHJvZHVjdFNlcnZpY2UpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhZGRDYXJ0OiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpdGVtLmFkZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5hZGRlZCA9ICFpdGVtLmFkZGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ucXVhbnRpdHkgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuYWRkT2JqZWN0KFwiY2FydFwiLCBpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZEF0dHJpYnV0ZShcIndpc2hsaXN0XCIsIGl0ZW0sIFwiYWRkZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuYWRkQXR0cmlidXRlKGl0ZW0sIFwiYWRkZWRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIkNhcnRVcGRhdGVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUNhcnQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICByZW1vdmVDYXJ0OiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5hZGRlZCA9ICFpdGVtLmFkZGVkO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5yZW1vdmVPYmplY3QoXCJjYXJ0XCIsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5hZGRBdHRyaWJ1dGUoXCJ3aXNobGlzdFwiLCBpdGVtLCBcImFkZGVkXCIsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmFkZEF0dHJpYnV0ZShpdGVtLCBcImFkZGVkXCIsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJDYXJ0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9jaGVja291dF9jb250cm9sbGVyJyk7XHJcbnJlcXVpcmUoJy4vY2hlY2tvdXRfZWRpdF9jb250cm9sbGVyJyk7XHJcbnJlcXVpcmUoJy4vY2hlY2tvdXRfc2VydmljZScpO1xyXG5yZXF1aXJlKCcuLi8uL3VzZXIvdXNlcicpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiY2hlY2tvdXRcIiwgWydhcHAuc2VydmljZScsICd1c2VyJywgJ2NoZWNrb3V0LnNlcnZpY2UnLCAnY2hlY2tvdXQuY29udHJvbGxlcicsICdjaGVja291dEVkaXQuY29udHJvbGxlciddKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjaGVja291dC5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIkNoZWNrb3V0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckbG9jYWxzdG9yYWdlJywgJ0NvbnRyb2xNb2RhbFNlcnZpY2UnLCAnJHN0YXRlJywnJHJvb3RTY29wZScsICdDaGVja291dFNlcnZpY2UnLCdVc2VyU2VydmljZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2Fsc3RvcmFnZSwgQ29udHJvbE1vZGFsU2VydmljZSwgJHN0YXRlLCAkcm9vdFNjb3BlLCBDaGVja291dFNlcnZpY2UsIFVzZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gVXNlclNlcnZpY2UuY3VycmVudFVzZXI7XHJcbiAgICAgICAgICAgICRzY29wZS5jaGVja291dEluZm8gPSBDaGVja291dFNlcnZpY2UuY2hlY2tvdXRJbmZvO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0SW5mb1tcIm1ldGhvZFNoaXBcIl0gPSBDaGVja291dFNlcnZpY2Uuc2hpcHBpbmdJbmZvLkE7XHJcbiAgICAgICAgICAgICRzY29wZS5jaGVja291dEluZm9bXCJtZXRob2RQYXltZW50XCJdID0gQ2hlY2tvdXRTZXJ2aWNlLnBheW1lbnRJbmZvLkE7XHJcblxyXG4gICAgICAgICAgICBpZihVc2VyU2VydmljZS5pc0xvZ2luKCkpe1xyXG4gICAgICAgICAgICAgICAgQ2hlY2tvdXRTZXJ2aWNlLnVwZGF0ZUNoZWNrb3V0SW5mbygkc2NvcGUudXNlcik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jaGVja291dCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE51bGwoXCJjYXJ0XCIpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiQ2FydFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcIm1lbnUucHJvZHVjdHNcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnY2hlY2tvdXRFZGl0LmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiQ2hlY2tvdXRFZGl0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckbG9jYWxzdG9yYWdlJywgJ1VzZXJTZXJ2aWNlJywnQ2hlY2tvdXRTZXJ2aWNlJywnJHN0YXRlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAgJGxvY2Fsc3RvcmFnZSwgVXNlclNlcnZpY2UsIENoZWNrb3V0U2VydmljZSwgJHN0YXRlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gVXNlclNlcnZpY2UuY3VycmVudFVzZXI7XHJcbiAgICAgICAgICAgICRzY29wZS5jaGVja291dEluZm8gPSBDaGVja291dFNlcnZpY2UuY2hlY2tvdXRJbmZvO1xyXG4gICAgICAgICAgICAkc2NvcGUuc2hpcHBpbmdJbmZvID0gQ2hlY2tvdXRTZXJ2aWNlLnNoaXBwaW5nSW5mbztcclxuICAgICAgICAgICAgJHNjb3BlLnBheW1lbnRJbmZvID0gQ2hlY2tvdXRTZXJ2aWNlLnBheW1lbnRJbmZvO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUNoZWNrb3V0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIENoZWNrb3V0U2VydmljZS51cGRhdGVDaGVja291dEluZm8oJHNjb3BlLmNoZWNrb3V0SW5mbyk7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUuY2hlY2tvdXQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjaGVja291dC5zZXJ2aWNlJywgW10pXHJcbiAgICAuZmFjdG9yeSgnQ2hlY2tvdXRTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkbG9jYWxzdG9yYWdlKSB7XHJcbiAgICAgICAgdmFyIGNoZWNrb3V0X2luZm8gPSB7XHJcbiAgICAgICAgICAgIHRvdGFsOiAwLFxyXG4gICAgICAgICAgICBncmFuZFRvdGFsOiAwXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIHNoaXBwaW5nX21ldGhvZCA9IHtcclxuICAgICAgICAgICAgXCJBXCI6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFwiVOG7sSBs4bqleSBow6BuZyB04bqhaSBj4butYSBow6BuZyAxNjQgVHLhuqduIELDrG5oIFRy4buNbmcgUTUgLSBIQ00gMOKCq1wiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJCXCI6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFwiUXXhuq1uIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDEwLCAxMSwgVMOibiBCw6xuaCwgVMOibiBQaMO6LCBQaMO6IE5odeG6rW4sIELDrG5oIFRo4bqhbmgsIEfDsiBW4bqlcCAxMC4wMDAg4oKrXCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogMTAwMDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJDXCI6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFwiUXXhuq1uIELDrG5oIFTDom4sIDksIDEyLCBUaOG7pyDEkOG7qWMgMjAuMDAwIOKCq1wiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IDIwMDAwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiRFwiOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIkjDs2MgTcO0biwgQsOsbmggQ2jDoW5oLCBOaMOgIELDqCwgQ+G7pyBDaGkgMzAuMDAwIOKCq1wiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IDMwMDAwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiRVwiOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIlNoaXAgaMOgbmcgxJFpIGPDoWMgdOG7iW5oIHRyb25nIG7GsOG7m2MgMzUuMDAwIOKCq1wiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IDM1MDAwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgcGF5bWVudF9tZXRob2QgPSB7XHJcbiAgICAgICAgICAgIFwiQVwiOiBcIkNhc2ggT24gRGVsaXZlcnkgKHRoYW5oIHRvw6FuIGtoaSBuaOG6rW4gaMOgbmcpXCIsXHJcbiAgICAgICAgICAgIFwiQlwiOiBcIkJhbmsgVHJhbnNmZXIgUGF5bWVudCAoY2h1eeG7g24gcXVhIG5nw6JuIGjDoG5nKVwiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdXBkYXRlQ2hlY2tvdXRJbmZvOiBmdW5jdGlvbiAoaW5mbykge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBpbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tvdXRfaW5mb1tpXSA9IGluZm9baV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1bVRvdGFsKCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzdW1Ub3RhbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhcnQgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIik7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGNhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja291dF9pbmZvLnRvdGFsICs9IGNhcnRbaV0ucmVndWxhcl9wcmljZV93aXRoX3RheDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNoZWNrb3V0X2luZm8uZ3JhbmRUb3RhbCA9IGNoZWNrb3V0X2luZm8udG90YWwgKyBjaGVja291dF9pbmZvLm1ldGhvZFNoaXAudmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBjaGVja291dEluZm86IGNoZWNrb3V0X2luZm8sXHJcblxyXG4gICAgICAgICAgICBzaGlwcGluZ0luZm86IHNoaXBwaW5nX21ldGhvZCxcclxuXHJcbiAgICAgICAgICAgIHBheW1lbnRJbmZvOiBwYXltZW50X21ldGhvZFxyXG4gICAgICAgIH1cclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxucmVxdWlyZSgnLi9ob21lX2NvbnRyb2xsZXInKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnaG9tZScsIFsnYXBwLnNlcnZpY2UnLCBcImhvbWUuY29udHJvbGxlclwiXSk7XHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiaG9tZS5jb250cm9sbGVyXCIsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJIb21lQ29udHJvbGxlclwiLCBbJyRzY29wZScsICdMb2dpblNlcnZpY2UnLCckbG9jYWxzdG9yYWdlJywnJHN0YXRlJywnQ29udHJvbE1vZGFsU2VydmljZScsJyR0aW1lb3V0JyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBMb2dpblNlcnZpY2UsICRsb2NhbHN0b3JhZ2UsICRzdGF0ZSwgQ29udHJvbE1vZGFsU2VydmljZSwgJHRpbWVvdXQpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjdXJyZW50X3VzZXJcIik7XHJcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBpZighY3VycmVudFVzZXIudXNlcm5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIENvbnRyb2xNb2RhbFNlcnZpY2Uuc2hvdygnanMvbW9kdWxlcy9yZWdpc3RlckxvZ2luL3JlZ2lzdGVyTG9naW4uaHRtbCcsICdSZWdpc3RlckxvZ2luQ29udHJvbGxlcicsIDEpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdtZW51LnByb2R1Y3RzJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDIwMDApO1xyXG5cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBkbyB5b3VyICQoKSBzdHVmZiBoZXJlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfV0pOyIsIlwidXNlIHN0cmljdFwiXHJcbnJlcXVpcmUoXCIuL21lbnVfY29udHJvbGxlclwiKTtcclxucmVxdWlyZSgnLi4vLi91c2VyL3VzZXInKTtcclxucmVxdWlyZShcIi4uLy4vcHJvZHVjdHMvcHJvZHVjdHNcIik7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJtZW51XCIsIFsnYXBwLnNlcnZpY2UnLCAndXNlcicsIFwicHJvZHVjdHNcIiwgXCJtZW51LmNvbnRyb2xsZXJcIl0pXHJcbiAgICAuY29uZmlnKGZ1bmN0aW9uICgkaW9uaWNDb25maWdQcm92aWRlcikge1xyXG4gICAgICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLmJhY2tCdXR0b24ucHJldmlvdXNUaXRsZVRleHQoZmFsc2UpLnRleHQoJycpO1xyXG4gICAgfSk7IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJtZW51LmNvbnRyb2xsZXJcIiwgW10pXHJcbiAgICAuY29udHJvbGxlcihcIk1lbnVDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRpb25pY1NpZGVNZW51RGVsZWdhdGUnLCAnUHJvZHVjdFNlcnZpY2UnLCAnJHN0YXRlJywgJ0NvbnRyb2xNb2RhbFNlcnZpY2UnLCAnJGxvY2Fsc3RvcmFnZScsICdVc2VyU2VydmljZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgUHJvZHVjdFNlcnZpY2UsICRzdGF0ZSwgQ29udHJvbE1vZGFsU2VydmljZSwgJGxvY2Fsc3RvcmFnZSwgVXNlclNlcnZpY2UpIHtcclxuICAgICAgICAgICAgJHNjb3BlLndpc2hsaXN0TnVtYmVyID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJ3aXNobGlzdFwiKS5sZW5ndGg7XHJcbiAgICAgICAgICAgICRzY29wZS5jYXJ0TnVtYmVyID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpLmxlbmd0aDtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBVc2VyU2VydmljZS5jdXJyZW50VXNlcjtcclxuICAgICAgICAgICAgVXNlclNlcnZpY2UuaXNMb2dpbigpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRvU3RhdGUubmFtZSA9PSBcIm1lbnUucHJvZHVjdHNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zaG93UHJvZHVjdEJhY2tCdG4gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zaG93UHJvZHVjdEJhY2tCdG4gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kb24oJ1dpc2hsaXN0VXBkYXRlJywgZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUud2lzaGxpc3ROdW1iZXIgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcIndpc2hsaXN0XCIpLmxlbmd0aDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdDYXJ0VXBkYXRlJywgZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2FydE51bWJlciA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmZpbHRlclR5cGUgPSBbXHJcbiAgICAgICAgICAgICAgICB7dHlwZTogXCJob3RcIiwgbmFtZTogJ1NhbiBwaGFtIGhvdCd9LFxyXG4gICAgICAgICAgICAgICAge3R5cGU6IFwiYmVzdHNlbGxlclwiLCBuYW1lOiAnU2FuIHBoYW0gYmFuIGNoYXknfSxcclxuICAgICAgICAgICAgICAgIHt0eXBlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbHQ6IDUwXHJcbiAgICAgICAgICAgICAgICB9LCBuYW1lOiAnRHVvaSA1MC4wMDAnfSxcclxuICAgICAgICAgICAgICAgIHt0eXBlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZDogWzUwLCAxMDBdXHJcbiAgICAgICAgICAgICAgICB9LCBuYW1lOiAnNTAuMDAwIGRlbiAxMDAuMDAwJ30sXHJcbiAgICAgICAgICAgICAgICB7dHlwZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmQ6IFsxMDAsIDIwMF1cclxuICAgICAgICAgICAgICAgIH0sIG5hbWU6ICcxMDAuMDAwIGRlbiAyMDAuMDAwJ30sXHJcbiAgICAgICAgICAgICAgICB7dHlwZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGd0OiAyMDBcclxuICAgICAgICAgICAgICAgIH0sIG5hbWU6ICdUcmVuIDIwMC4wMDAnfVxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wZW5NZW51ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS50b2dnbGVMZWZ0KCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZ2V0UHJvZHVjdHMgPSBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgdHlwZSA9IEpTT04uc3RyaW5naWZ5KHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2Uuc2V0VHlwZSh0eXBlKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLnNldFBhZ2UoMSk7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5maWx0ZXJQcm9kdWN0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jb250YWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgQ29udHJvbE1vZGFsU2VydmljZS5zaG93KCdqcy9tb2R1bGVzL2NvbnRhY3QvY29udGFjdC5odG1sJywgJ0NvbnRhY3RDb250cm9sbGVyJywgMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5zaG93X2NhcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJtZW51LmNhcnRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS51c2VyX2luZm8gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJtZW51LnVzZXJcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS50b19sb2dpbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIENvbnRyb2xNb2RhbFNlcnZpY2Uuc2hvdygnanMvbW9kdWxlcy9yZWdpc3RlckxvZ2luL3JlZ2lzdGVyTG9naW4uaHRtbCcsICdSZWdpc3RlckxvZ2luQ29udHJvbGxlcicsIDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2lnbm91dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIFVzZXJTZXJ2aWNlLnNpZ25PdXQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmdldFByb2R1Y3RzKFwiaG90XCIpO1xyXG4gICAgICAgIH1cclxuICAgIF0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcInByb2R1Y3QuY29udHJvbGxlclwiLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiUHJvZHVjdENvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnUHJvZHVjdFNlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgJ1dpc2hsaXN0U2VydmljZScsICckaHR0cCcsICdDb250cm9sTW9kYWxTZXJ2aWNlJywgJyRpb25pY1NsaWRlQm94RGVsZWdhdGUnLCAnQ2FydFNlcnZpY2UnLCckbG9jYWxzdG9yYWdlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBQcm9kdWN0U2VydmljZSwgJHN0YXRlUGFyYW1zLCBXaXNobGlzdFNlcnZpY2UsICRodHRwLCBDb250cm9sTW9kYWxTZXJ2aWNlLCAkaW9uaWNTbGlkZUJveERlbGVnYXRlLCBDYXJ0U2VydmljZSwgJGxvY2Fsc3RvcmFnZSkge1xyXG4gICAgICAgICAgICB2YXIgbGlua19hamF4ID0gXCJodHRwOi8vc2hvcDEway5xcm1hcnRkZW1vLmluZm8vYXBpL3Jlc3QvcHJvZHVjdHNcIjtcclxuICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3QgPSB7fTtcclxuICAgICAgICAgICAgJGh0dHAuZ2V0KGxpbmtfYWpheCArIFwiL1wiICsgJHN0YXRlUGFyYW1zLmlkKS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS51cGRhdGVBcnJheShyZXNwLmRhdGEsICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKSxcImFkZGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS51cGRhdGVBcnJheShyZXNwLmRhdGEsICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIiksIFwibGlrZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUucHJvZHVjdC5kZXRhaWwgPSByZXNwLmRhdGE7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJGh0dHAuZ2V0KGxpbmtfYWpheCArIFwiL1wiICsgJHN0YXRlUGFyYW1zLmlkICsgXCIvaW1hZ2VzXCIpLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5wcm9kdWN0LmltYWdlcyA9IHJlc3AuZGF0YTtcclxuICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVTbGlkZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkaHR0cC5nZXQobGlua19hamF4ICsgXCIvXCIgKyAkc3RhdGVQYXJhbXMuaWQgKyBcIi9jYXRlZ29yaWVzXCIpLnRoZW4oZnVuY3Rpb24gKGNhdCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3QuY2F0ZWdvcnkgPSBjYXQuZGF0YTtcclxuICAgICAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXggKyBcIj9jYXRlZ29yeV9pZD1cIiArICRzY29wZS5wcm9kdWN0LmNhdGVnb3J5WzBdLmNhdGVnb3J5X2lkKS50aGVuKGZ1bmN0aW9uIChyZWxhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJvZHVjdC5yZWxhdGVkID0gcmVsYXRlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlU2xpZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZS51cGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFkZFRvV2lzaGxpc3QgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgV2lzaGxpc3RTZXJ2aWNlLmFkZFdpc2hsaXN0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkX3RvX2NhcnQgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgQ2FydFNlcnZpY2UuYWRkQ2FydChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNob29zZVByb2R1Y3RPcHRpb24gPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgQ29udHJvbE1vZGFsU2VydmljZS5zaG93KCdqcy9tb2R1bGVzL2NhcnQvY2FydC5odG1sJywgJ0NhcnRDb250cm9sbGVyJywgMSwgaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XSk7XHJcblxyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5yZXF1aXJlKFwiLi9wcm9kdWN0c19mYWN0b3J5LmpzXCIpO1xyXG5yZXF1aXJlKFwiLi9wcm9kdWN0c19jb250cm9sbGVyLmpzXCIpO1xyXG5yZXF1aXJlKFwiLi9wcm9kdWN0X2NvbnRyb2xsZXIuanNcIik7XHJcbnJlcXVpcmUoJy4uLy4vd2lzaGxpc3Qvd2lzaGxpc3Rfc2VydmljZS5qcycpO1xyXG5yZXF1aXJlKCcuLi8uL2NhcnQvY2FydF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwcm9kdWN0c1wiLCBbJ2FwcC5zZXJ2aWNlJywgJ3dpc2hsaXN0LnNlcnZpY2UnLCAnY2FydC5zZXJ2aWNlcycsIFwicHJvZHVjdHMuZmFjdG9yeVwiLCBcInByb2R1Y3RzLmNvbnRyb2xsZXJcIiwgXCJwcm9kdWN0LmNvbnRyb2xsZXJcIl0pXHJcbiAgICAuY29uZmlnKGZ1bmN0aW9uICgkaW9uaWNDb25maWdQcm92aWRlcikge1xyXG4gICAgICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLmJhY2tCdXR0b24ucHJldmlvdXNUaXRsZVRleHQoZmFsc2UpLnRleHQoJycpO1xyXG4gICAgfSk7IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwcm9kdWN0cy5jb250cm9sbGVyXCIsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJQcm9kdWN0c0NvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZScsICdQcm9kdWN0U2VydmljZScsICdDb250cm9sTW9kYWxTZXJ2aWNlJywgJ1dpc2hsaXN0U2VydmljZScsJ0NhcnRTZXJ2aWNlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCBQcm9kdWN0U2VydmljZSwgQ29udHJvbE1vZGFsU2VydmljZSwgV2lzaGxpc3RTZXJ2aWNlLCBDYXJ0U2VydmljZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUucHJvZHVjdHMgPSBQcm9kdWN0U2VydmljZS5wcm9kdWN0Q3VycmVudDtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5vcGVuTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUudG9nZ2xlTGVmdCgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmxvYWRNb3JlRGF0YSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmZpbHRlclByb2R1Y3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLnNldFBhZ2UoKytkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdCgnc2Nyb2xsLmluZmluaXRlU2Nyb2xsQ29tcGxldGUnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFkZF90b19jYXJ0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIENhcnRTZXJ2aWNlLmFkZENhcnQoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hZGRUb1dpc2hsaXN0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIFdpc2hsaXN0U2VydmljZS5hZGRXaXNobGlzdChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIF0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcInByb2R1Y3RzLmZhY3RvcnlcIiwgW10pXHJcbiAgICAuZmFjdG9yeSgnUHJvZHVjdFNlcnZpY2UnLCBmdW5jdGlvbiAoJHEsICRodHRwLCAkbG9jYWxzdG9yYWdlKSB7XHJcbiAgICAgICAgdmFyIHByb2R1Y3RzID0gW107XHJcbiAgICAgICAgdmFyIGZpbHRlciA9IHtcclxuICAgICAgICAgICAgcGFnZTogMSxcclxuICAgICAgICAgICAgdHlwZTogJydcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRfcHJvZHVjdChkYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9ICQubWFwKGRhdGEsIGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbdmFsdWVdO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBhcnJheS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICAgICAgcHJvZHVjdHMucHVzaChhcnJheVtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybntcclxuICAgICAgICAgICAgZmlsdGVyUHJvZHVjdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuLy8gICAgICAgICAgICAgICAgdmFyIGxpbmtfYWpheCA9IFwiaHR0cDovL2xpcXVvcmRlbGl2ZXJ5LmNvbS5zZy93cC1hZG1pbi9hZG1pbi1hamF4LnBocFwiO1xyXG4vLyAgICAgICAgICAgICAgICAkaHR0cC5nZXQobGlua19hamF4ICsgXCI/YWN0aW9uPWxhdGVzdF9wcm9kdWN0c19hcHAmZmlsdGVyPVwiICsgZmlsdGVyVHlwZSArIFwiJnBhZ2U9XCIgKyBwYWdlX25leHQpLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgIGlmKGZpbHRlci5wYWdlID09IDEpe1xyXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyUHJvZHVjdHMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbGlua19hamF4ID0gXCJodHRwOi8vc2hvcDEway5xcm1hcnRkZW1vLmluZm8vYXBpL3Jlc3QvcHJvZHVjdHNcIjtcclxuICAgICAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXggKyBcIj9wYWdlPVwiICsgZmlsdGVyLnBhZ2UgKyBcIiZsaW1pdD0yMCZvcmRlcj1lbnRpdHlfaWQmZGlyPWRzY1wiKS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkX3Byb2R1Y3QocmVzcC5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGZpbHRlci5wYWdlKyspO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnVwZGF0ZUFycmF5KHByb2R1Y3RzLCAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIiksXCJhZGRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnVwZGF0ZUFycmF5KHByb2R1Y3RzLCAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcIndpc2hsaXN0XCIpLCBcImxpa2VcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVyci5zdGF0dXMgd2lsbCBjb250YWluIHRoZSBzdGF0dXMgY29kZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0VSUicsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdFUlIgJyArIGVycik7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0UGFnZTogZnVuY3Rpb24gKG51bWJlcikge1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyLnBhZ2UgPSBudW1iZXI7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXRUeXBlOiBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgYWRkQXR0cmlidXRlIDogZnVuY3Rpb24oaXRlbSwgaW5kZXgpe1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpIGluIHByb2R1Y3RzKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihwcm9kdWN0c1tpXS5lbnRpdHlfaWQgPT0gaXRlbS5lbnRpdHlfaWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0c1tpXVtpbmRleF0gPSBpdGVtW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBjbGVhclByb2R1Y3RzIDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBwcm9kdWN0Q3VycmVudDogcHJvZHVjdHMsXHJcblxyXG4gICAgICAgICAgICBwYWdlOiBmaWx0ZXIucGFnZVxyXG4gICAgICAgIH1cclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vdXNlcl9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4vdXNlcl9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoXCIuLi8uL3Byb2R1Y3RzL3Byb2R1Y3RzXCIpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwidXNlclwiLCBbJ2FwcC5zZXJ2aWNlJywgIFwicHJvZHVjdHNcIiwgJ3VzZXIuc2VydmljZScsICd1c2VyLmNvbnRyb2xsZXInXSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgndXNlci5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIlVzZXJDb250cm9sbGVyXCIsIFsnJHNjb3BlJywnVXNlclNlcnZpY2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIFVzZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gVXNlclNlcnZpY2UuY3VycmVudFVzZXI7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlVXNlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBVc2VyU2VydmljZS51cGRhdGVVc2VyKCRzY29wZS51c2VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIF0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ3VzZXIuc2VydmljZScsIFtdKVxyXG4gICAgLnNlcnZpY2UoJ1VzZXJTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkbG9jYWxzdG9yYWdlLCBQcm9kdWN0U2VydmljZSwgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHZhciBjdXJyZW50X3VzZXIgPSB7XHJcbiAgICAgICAgICAgIG5hbWUgOiBcIkxpbmggxJDhu5dcIixcclxuICAgICAgICAgICAgdXNlcm5hbWU6IFwidGVzdEBhZHZuLnZuXCIsXHJcbiAgICAgICAgICAgIGVtYWlsIDogXCJ2aWxtYS5raWxiYWNrQGxhcmtpbi5uYW1lXCIsXHJcbiAgICAgICAgICAgIHBhc3MgOiBcIjEyMzQ1NlwiLFxyXG4gICAgICAgICAgICBwaG9uZSA6IFwiMzM1LTEwNC0yNTQyXCIsXHJcbiAgICAgICAgICAgIGFkZHJlc3MgOiBcIjgwMCwgTOG6oWMgTG9uZyBRdcOiblwiLFxyXG4gICAgICAgICAgICBkaXN0cmljdCA6IFwiUXXhuq1uIFTDom4gQsOsbmhcIixcclxuICAgICAgICAgICAgd2FyZCA6IFwiUGjGsOG7nW5nIDEwXCIsXHJcbiAgICAgICAgICAgIGNpdHkgOiBcIkjhu5MgQ2jDrSBNaW5oXCIsXHJcbiAgICAgICAgICAgIHBvcnRyYWl0OiBcImltZy9wb3J0cmFpdC5qcGdcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRVc2VyIDogY3VycmVudF91c2VyLFxyXG5cclxuICAgICAgICAgICAgaXNMb2dpbiA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXNlciA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwidXNlclwiKTtcclxuICAgICAgICAgICAgICAgIGlmKHVzZXIubG9naW4pe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVXNlcih1c2VyKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgdXBkYXRlVXNlciA6IGZ1bmN0aW9uKGluZm8pe1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpIGluIGluZm8pe1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRfdXNlcltpXSA9IGluZm9baV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzaWduT3V0IDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRfdXNlci5sb2dpbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsKFwidXNlclwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE51bGwoXCJjYXJ0XCIpO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsKFwid2lzaGxpc3RcIik7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5zZXRQYWdlKDEpO1xyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuZmlsdGVyUHJvZHVjdCgpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiQ2FydFVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIldpc2hsaXN0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgbG9naW4gOiBmdW5jdGlvbih1c2VyKXtcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaSBpbiB1c2VyKXtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50X3VzZXJbaV0gPSB1c2VyW2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY3VycmVudF91c2VyLmxvZ2luID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0T2JqZWN0KFwidXNlclwiLCBjdXJyZW50X3VzZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbChcImNhcnRcIik7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE51bGwoXCJ3aXNobGlzdFwiKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLnNldFBhZ2UoMSk7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5maWx0ZXJQcm9kdWN0KCk7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJDYXJ0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiV2lzaGxpc3RVcGRhdGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCcuL3dpc2hsaXN0X2NvbnRyb2xsZXIuanMnKTtcclxucmVxdWlyZSgnLi93aXNobGlzdF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4vcHJvZHVjdHMvcHJvZHVjdHMnKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcIndpc2hsaXN0XCIsIFsnYXBwLnNlcnZpY2UnLCAncHJvZHVjdHMnLCAnd2lzaGxpc3Quc2VydmljZScsICd3aXNobGlzdC5jb250cm9sbGVyJ10pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ3dpc2hsaXN0LmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiV2lzaGxpc3RDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRsb2NhbHN0b3JhZ2UnLCdXaXNobGlzdFNlcnZpY2UnLCckc3RhdGUnLCdDYXJ0U2VydmljZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2Fsc3RvcmFnZSwgV2lzaGxpc3RTZXJ2aWNlLCAkc3RhdGUsIENhcnRTZXJ2aWNlKSB7XHJcbi8vICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsQWxsKCk7XHJcbiAgICAgICAgICAgICRzY29wZS53aXNobGlzdE51bWJlciA9IFdpc2hsaXN0U2VydmljZS53aXNobGlzdE51bWJlcjtcclxuICAgICAgICAgICAgJHNjb3BlLndpc2hsaXN0ID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJ3aXNobGlzdFwiKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5yZW1vdmVGcm9tV2lzaGxpc3QgPSBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgIFdpc2hsaXN0U2VydmljZS5yZW1vdmVXaXNobGlzdChpdGVtKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS53aXNobGlzdCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hZGRfdG9fY2FydCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBDYXJ0U2VydmljZS5hZGRDYXJ0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ3dpc2hsaXN0LnNlcnZpY2UnLCBbXSlcclxuICAgIC5zZXJ2aWNlKCdXaXNobGlzdFNlcnZpY2UnLCBmdW5jdGlvbiAoJHEsICRsb2NhbHN0b3JhZ2UsICRyb290U2NvcGUsIFByb2R1Y3RTZXJ2aWNlKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYWRkV2lzaGxpc3QgOiBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgIGlmKCFpdGVtLmxpa2Upe1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ubGlrZSA9ICFpdGVtLmxpa2U7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5hZGRPYmplY3QoXCJ3aXNobGlzdFwiLCBpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZEF0dHJpYnV0ZShcImNhcnRcIiwgaXRlbSwgXCJsaWtlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmFkZEF0dHJpYnV0ZShpdGVtLCBcImxpa2VcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcIldpc2hsaXN0VXBkYXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVdpc2hsaXN0KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcmVtb3ZlV2lzaGxpc3QgOiBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgIGl0ZW0ubGlrZSA9ICFpdGVtLmxpa2U7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnJlbW92ZU9iamVjdChcIndpc2hsaXN0XCIsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5hZGRBdHRyaWJ1dGUoXCJjYXJ0XCIsIGl0ZW0sIFwibGlrZVwiKTtcclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmFkZEF0dHJpYnV0ZShpdGVtLCBcImxpa2VcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiV2lzaGxpc3RVcGRhdGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIH1cclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vY29udGFjdF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4vY29udGFjdF9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJjb250YWN0XCIsIFsnYXBwLnNlcnZpY2UnLCAnY29udGFjdC5zZXJ2aWNlcycsICdjb250YWN0LmNvbnRyb2xsZXInXSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnY29udGFjdC5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIkNvbnRhY3RDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJ3BhcmFtZXRlcnMnLCAnJGxvY2Fsc3RvcmFnZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgcGFyYW1ldGVycywgJGxvY2Fsc3RvcmFnZSkge1xyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjb250YWN0LnNlcnZpY2VzJywgW10pXHJcbiAgICAuc2VydmljZSgnQ29udGFjdFNlcnZpY2UnLCBmdW5jdGlvbiAoJHEpIHtcclxuXHJcblxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgncmVnaXN0ZXJMb2dpbi5zZXJ2aWNlcycsIFtdKVxyXG4gICAgLnNlcnZpY2UoJ0xvZ2luU2VydmljZScsIGZ1bmN0aW9uICgkcSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxvZ2luVXNlcjogbG9naW5Vc2VyXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2luVXNlcihuYW1lLCBwdykge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAobmFtZSA9PSAndGVzdEBhZHZuLnZuJyAmJiBwdyA9PSAnMTIzNDU2Jykge1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgnV2VsY29tZSAnICsgbmFtZSArICchJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ1dyb25nIGNyZWRlbnRpYWxzLicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb21pc2Uuc3VjY2VzcyA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb21pc2UuZXJyb3IgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihudWxsLCBmbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9XHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCcuL2xvZ2luX3NlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi9yZWdpc3Rlcl9sb2dpbl9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vbGF5b3V0L3VzZXIvdXNlcicpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwicmVnaXN0ZXJMb2dpblwiLCBbJ2FwcC5zZXJ2aWNlJywgJ3VzZXInLCAncmVnaXN0ZXJMb2dpbi5zZXJ2aWNlcycsICdyZWdpc3RlckxvZ2luLmNvbnRyb2xsZXInXSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgncmVnaXN0ZXJMb2dpbi5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIlJlZ2lzdGVyTG9naW5Db250cm9sbGVyXCIsIFsnJHNjb3BlJywgJ0xvZ2luU2VydmljZScsICckc3RhdGUnLCAnJGlvbmljUG9wdXAnLCAnJGxvY2Fsc3RvcmFnZScsICdVc2VyU2VydmljZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgTG9naW5TZXJ2aWNlLCAkc3RhdGUsICRpb25pY1BvcHVwLCAkbG9jYWxzdG9yYWdlLCBVc2VyU2VydmljZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlciA9IFVzZXJTZXJ2aWNlLmN1cnJlbnRfdXNlcjtcclxuICAgICAgICAgICAgJHNjb3BlLnJlc3VsdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKExvZ2luU2VydmljZS5yZWMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdtb2RhbC5oaWRkZW4nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5wcm9kdWN0cycpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5sb2dpbkRhdGEgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5vcGVuTG9naW5Nb2RhbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5vcGVuTW9kYWwoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNsb3NlTG9naW5Nb2RhbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUucHJvZHVjdHMnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9sb2dpbiBzZWN0aW9uXHJcbiAgICAgICAgICAgICRzY29wZS5kb1JlZ2lzdGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0RvaW5nIHJlZ2lzdGVyJywgJHNjb3BlLmxvZ2luRGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU2ltdWxhdGUgYSBsb2dpbiBkZWxheS4gUmVtb3ZlIHRoaXMgYW5kIHJlcGxhY2Ugd2l0aCB5b3VyIGxvZ2luXHJcbiAgICAgICAgICAgICAgICAvLyBjb2RlIGlmIHVzaW5nIGEgbG9naW4gc3lzdGVtXHJcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlTG9naW5SZWdpc3RlcigpO1xyXG4gICAgICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAgICAgLy9yZWdpc3RlciBzZWN0aW9uXHJcbiAgICAgICAgICAgICRzY29wZS5kb0xvZ2luID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgTG9naW5TZXJ2aWNlLmxvZ2luVXNlcigkc2NvcGUubG9naW5EYXRhLmVtYWlsLCAkc2NvcGUubG9naW5EYXRhLnBhc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVXNlclNlcnZpY2UubG9naW4oJHNjb3BlLnVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VNb2RhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ21lbnUucHJvZHVjdHMnKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTG9naW4gZmFpbGVkIScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ1BsZWFzZSBjaGVjayB5b3VyIGNyZWRlbnRpYWxzISdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU2ltdWxhdGUgYSBsb2dpbiBkZWxheS4gUmVtb3ZlIHRoaXMgYW5kIHJlcGxhY2Ugd2l0aCB5b3VyIGxvZ2luXHJcbiAgICAgICAgICAgICAgICAvLyBjb2RlIGlmIHVzaW5nIGEgbG9naW4gc3lzdGVtXHJcbi8vICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgICAgJHNjb3BlLmNsb3NlTG9naW5SZWdpc3RlcigpO1xyXG4vLyAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXHJcbiAgICBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xyXG4gICAgICAgIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXHJcbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvXCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvaG9tZS9ob21lLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbG9naW4nLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2xvZ2luXCIsXHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZWdpc3RlckxvZ2luQ29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvbWVudVwiLFxyXG4gICAgICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvbWVudS9tZW51Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNZW51Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudS5wcm9kdWN0cycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvcHJvZHVjdHNcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0cy5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdHNDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUucHJvZHVjdCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvcHJvZHVjdC86aWRcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LmNhcnQnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2NhcnRcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9jYXJ0L2NhcnQuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NhcnRDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUud2lzaGxpc3QnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3dpc2hsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvd2lzaGxpc3Qvd2lzaGxpc3QuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1dpc2hsaXN0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LmNoZWNrb3V0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jaGVja291dFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGVja291dENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudS5jaGVja291dF9lZGl0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jaGVja291dF9lZGl0XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXRfZWRpdC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ2hlY2tvdXRFZGl0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LnVzZXInLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3VzZXJcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC91c2VyL3VzZXIuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VzZXJDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgIH1cclxuXVxyXG47Il19
