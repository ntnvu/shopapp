(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//module node
//require("angular");

//module functions
require("./modules/registerLogin/registerLogin");
require("./modules/cart/cart");
require("./modules/contact/contact");
//module layout
require("./layout/home/home");
require("./layout/newMenu/newMenu");
require("./layout/products/products");
require("./layout/menu/menu");
require("./layout/cart_page/cart_page");
require("./layout/checkout/checkout");
require("./layout/checkout_edit/checkout_edit");
require("./layout/wishlist/wishlist");

module.export = angular.module('starter', ['ionic', 'slick', 'akoenig.deckgrid','ng-mfb',
        //functions
        'registerLogin',
        'cart',
        'contact',

        //layout
        'home',
        'menu',
        'newMenu',
        'products',
        'CartPage',
        'checkout',
        'checkoutEdit',
        'wishlist',

    ])
    .config(require('./router'))
    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.platform.android.tabs.position("bottom");
    })
    .run(require('./app-main'));




},{"./app-main":2,"./layout/cart_page/cart_page":4,"./layout/checkout/checkout":6,"./layout/checkout_edit/checkout_edit":8,"./layout/home/home":10,"./layout/menu/menu":12,"./layout/newMenu/newMenu":14,"./layout/products/products":18,"./layout/wishlist/wishlist":21,"./modules/cart/cart":24,"./modules/contact/contact":27,"./modules/registerLogin/registerLogin":31,"./router":33}],2:[function(require,module,exports){
'use strict';
function AppMain($ionicPlatform){
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
}

module.exports = ['$ionicPlatform', AppMain];
},{}],3:[function(require,module,exports){
"use strict"

module.exports = angular.module("app.service", [])
    .factory('$localstorage', ['$window','$ionicHistory', function ($window, $ionicHistory) {
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
            setNull: function(key){
                this.setObject(key,{});
            },
            setNullAll: function(){
                $window.localStorage.clear();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
            }
        }
    }])
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
                        modalScope.modal.addClass("addruine");
                        deferred.test = "aa";
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

require('./cart_page_controller.js');
require('../.././app_service');

module.exports = angular.module("CartPage", ['app.service', 'CartPage.controller']);
},{"../.././app_service":3,"./cart_page_controller.js":5}],5:[function(require,module,exports){
'use strict';

module.exports = angular.module('CartPage.controller', [])
    .controller("CartPageController", ['$scope', '$localstorage',
        function ($scope, $localstorage) {
//            $localstorage.setNull("cart");
            $scope.cartlist = $localstorage.getObject("cart");
            console.log($scope.cartlist);
        }]);
},{}],6:[function(require,module,exports){
'use strict';

require('./checkout_controller.js');
require('../.././app_service');

module.exports = angular.module("checkout", ['app.service', 'checkout.controller']);
},{"../.././app_service":3,"./checkout_controller.js":7}],7:[function(require,module,exports){
'use strict';

module.exports = angular.module('checkout.controller', [])
    .controller("CheckoutController", ['$scope', '$localstorage', 'ControlModalService', '$state',
        function ($scope, $localstorage, ControlModalService, $state) {
            $scope.cartlist = $localstorage.getObject("cart");

            $scope.checkout = function(){
                $localstorage.setNull("cart");
                $state.go("menu.products");
            }
        }]);
},{}],8:[function(require,module,exports){
'use strict';

require('./checkout_edit_controller.js');
require('../.././app_service');

module.exports = angular.module("checkoutEdit", ['app.service', 'checkoutEdit.controller']);






},{"../.././app_service":3,"./checkout_edit_controller.js":9}],9:[function(require,module,exports){
'use strict';

module.exports = angular.module('checkoutEdit.controller', [])
    .controller("CheckoutEditController", ['$scope', '$localstorage',
        function ($scope,  $localstorage) {
//            $scope.productAttr = {
//                color:["yellow", "red", "orange", "blue"],
//                size:["S", "M", "L", "XL"]
//            }
            $scope.cart = [];


            $scope.optProd = {};

            $scope.add_to_cart = function () {
                console.log($localstorage.getObject("cart"));
                $scope.cart = $scope.cart.concat({
                    id: parameters.id,
                    thumb: parameters.img,
                    color: $scope.optProd.color,
                    size: $scope.optProd.size,
                    quantity: $scope.optProd.quantity
                },
                    $localstorage.getObject("cart"));

                $localstorage.setObject("cart", $scope.cart);
            }

        }]);
},{}],10:[function(require,module,exports){
'use strict';
require('./home_controller');
require('../.././app_service');

module.exports = angular.module('home', ['app.service', "home.controller"]);


},{"../.././app_service":3,"./home_controller":11}],11:[function(require,module,exports){
'use strict';

module.exports = angular.module("home.controller", [])
    .controller("HomeController", ['$scope', 'LoginService','$localstorage','$state','ControlModalService','$timeout',
        function ($scope, LoginService, $localstorage, $state, ControlModalService, $timeout) {
            var currentUser = $localstorage.getObject("current_user");
            $timeout(function(){
                if(!currentUser.username){
                    ControlModalService.show('js/modules/registerLogin/registerLogin.html', 'RegisterLoginController', 1);
                }else{
                    console.log(currentUser.username);
                    $state.go('menu.products');
                }
            }, 2000);


            $scope.load = function() {
                // do your $() stuff here
            };
        }]);
},{}],12:[function(require,module,exports){
"use strict"
require("./menu_controller.js");
require(".././products/products_factory.js");
require('../.././app_service');

module.exports = angular.module("menu", ['app.service', "products.factory", "menu.controller"])
    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.backButton.previousTitleText(false).text('');
    });
},{"../.././app_service":3,".././products/products_factory.js":20,"./menu_controller.js":13}],13:[function(require,module,exports){
"use strict"

module.exports = angular.module("menu.controller", [])
    .controller("MenuController", ['$scope', '$ionicSideMenuDelegate', 'ProductService', '$state', 'ControlModalService','$ionicHistory',
        function ($scope, $ionicSideMenuDelegate, ProductService, $state, ControlModalService, $ionicHistory) {
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

            $scope.products = ProductService.productCurrent;
            $scope.page = ProductService.page;
            $scope.firstTime = 0;

            $scope.getProducts = function (type) {
                type = JSON.stringify(type);
                $scope.currentcheckCtrl = type;
                ProductService.filterProduct(type).then(
                    function (data) {
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });

                        angular.copy({
                            number: 1
                        }, $scope.page);
                        angular.copy(data, $scope.products);//must use angular.copy than use "=" so it can continue binding to first service param
                        if ($scope.firstTime)
                            $state.go("menu.products");
                        $scope.firstTime = 1;
                    }
                );
            }

            $scope.contact = function(){
                ControlModalService.show('js/modules/contact/contact.html', 'ContactController', 1);
            }

            $scope.show_cart = function(){
                $state.go("menu.cart_page");
            }
            $scope.getProducts("hot");
        }
    ]);

},{}],14:[function(require,module,exports){
"use strict"
require("./newMenu_controller.js");
require("./newMenu_factory.js");

module.exports = angular.module("newMenu", ["newMenu.factory", "newMenu.controller"]);
},{"./newMenu_controller.js":15,"./newMenu_factory.js":16}],15:[function(require,module,exports){
"use strict"

module.exports = angular.module("newMenu.controller", [])
    .controller("NewmenuController", ['$scope', '$ionicSideMenuDelegate', 'Movies',
        function($scope, $ionicSideMenuDelegate, Movies) {
            $scope.sorting = [{score: 9, name : 'Score more then 9'},
                {score: 8, name : 'Score more then 8'},
                {score: 7, name : 'Score more then 7'},
                {score: 6, name : 'Score more then 6'},
                {score: 5, name : 'Score more then 5'},
                {score: 4, name : 'Score more then 4'},
                {score: 3, name : 'Score more then 3'},
                {score: 2, name : 'Score more then 2'},
                {score: 1, name : 'Score more then 1'},
                {score: 0, name : 'Show me every movie'}];

            $scope.selected = {
                score : 0,
                movieName : 'Batman'
            }

            $scope.openMenu = function () {
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.greaterThan = function(fieldName){
                return function(item){
                    return item[fieldName] > $scope.selected.score;
                }
            }

            $scope.searchMovieDB = function() {

                Movies.list($scope.selected.movieName, function(movies) {
                    $scope.movies = movies;
                });

            };

            $scope.searchMovieDB();
        }
    ]);

},{}],16:[function(require,module,exports){
"use strict"

module.exports = angular.module("newMenu.factory", [])
    .factory('Movies', function ($http) {
        var cachedData;

        function getData(moviename, callback) {

            var url = 'http://api.themoviedb.org/3/',
                mode = 'search/movie?query=',
                name = '&query=' + encodeURI(moviename),
                key = '&api_key=470fd2ec8853e25d2f8d86f685d2270e';

            $http.get(url + mode + key + name).success(function (data) {

                cachedData = data.results;
                callback(data.results);
            });
        }

        return {
            list: getData,
            find: function (name, callback) {
                console.log(name);
                var movie = cachedData.filter(function (entry) {
                    return entry.id == name;
                })[0];
                callback(movie);
            }
        };

    });
},{}],17:[function(require,module,exports){
"use strict"

module.exports = angular.module("product.controller", [])
    .controller("ProductController", ['$scope', 'ProductService', '$stateParams','WishlistService',
        function ($scope, ProductService, $stateParams, WishlistService) {
            $scope.product = ProductService.viewDetail($stateParams.index);

//            $scope.init = function () {
//                $scope.loading = true;
//                $scope.$broadcast('dataloaded');
//            };
//
//            $scope.init();
            $scope.addToWishlist = function(item){
                WishlistService.addWishlist(item);
            }
        }]);

},{}],18:[function(require,module,exports){
"use strict"
require("./products_factory.js");
require("./products_controller.js");
require("./product_controller.js");
require('.././wishlist/wishlist_service.js');
require('../.././app_service');

module.exports = angular.module("products", ['app.service', 'wishlist.service', "products.factory", "products.controller", "product.controller"])
    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.backButton.previousTitleText(false).text('');
    });
},{"../.././app_service":3,".././wishlist/wishlist_service.js":23,"./product_controller.js":17,"./products_controller.js":19,"./products_factory.js":20}],19:[function(require,module,exports){
"use strict"

module.exports = angular.module("products.controller", [])
    .controller("ProductsController", ['$scope', '$ionicSideMenuDelegate','ProductService', 'ControlModalService','WishlistService',
        function ($scope, $ionicSideMenuDelegate, ProductService, ControlModalService, WishlistService) {
            $scope.products = ProductService.productCurrent;
            $scope.page = ProductService.page;

            $scope.openMenu = function () {
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.loadMoreData = function () {
                var type = $scope.currentcheckCtrl;

                var temppage = $scope.page.number;
                temppage++;

                ProductService.filterProduct(type, 1, temppage).then(
                    function (data) {
                        var temp = $scope.products;
                        temp = temp.concat(data);
                        angular.copy(temp, $scope.products);//must use angular.copy
                        $scope.$broadcast('scroll.infiniteScrollComplete');

                        angular.copy({
                            number : temppage
                        }, $scope.page);
                    }
                );
            };

            $scope.chooseProductOption = function(item){
                ControlModalService.show('js/modules/cart/cart.html', 'CartController', 1, item);
            }

            $scope.addToWishlist = function(item){
                WishlistService.addWishlist(item);
            }
        }
    ]);

},{}],20:[function(require,module,exports){
"use strict"

module.exports = angular.module("products.factory", [])
    .factory('ProductService', function ($q, $http, $localstorage) {
        var products = [];
        var page = {
            number : 1
        };//should use object or array, don't use a single variable

        return{
            filterProduct: function (filterType, ajax, page_next) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                var link_ajax = "http://liquordelivery.com.sg/wp-admin/admin-ajax.php";
                $http.get(link_ajax + "?action=latest_products_app&filter=" + filterType + "&page=" + page_next).then(function (resp) {

                    if (ajax) {
                        products = products.concat(resp.data);
                    }
                    else {
                        products = resp.data;
                    }
//                    angular.extend(resp.data, $localstorage.getObject("wishlist"));

                    deferred.resolve(resp.data);
                    // For JSON responses, resp.data contains the result
                }, function (err) {
                    console.error('ERR', err);
                    deferred.reject('ERR ' + err);
                    // err.status will contain the status code
                })

                return promise;
            },

            viewDetail: function (index) {
                return products[index];
            },

            productCurrent : products,

            page : page
        }
    });
},{}],21:[function(require,module,exports){
'use strict';

require('./wishlist_controller.js');
require('./wishlist_service.js');
require('../.././app_service');

module.exports = angular.module("wishlist", ['app.service', 'wishlist.service', 'wishlist.controller']);
},{"../.././app_service":3,"./wishlist_controller.js":22,"./wishlist_service.js":23}],22:[function(require,module,exports){
'use strict';

module.exports = angular.module('wishlist.controller', [])
    .controller("WishlistController", ['$scope', '$localstorage','WishlistService','$state',
        function ($scope, $localstorage, WishlistService, $state) {
            $localstorage.setNull();
            $scope.wishlist = $localstorage.getObject("wishlist");

            $scope.addToWishlist = function(item){
                WishlistService.addWishlist(item);
            }


        }]);
},{}],23:[function(require,module,exports){
'use strict';

module.exports = angular.module('wishlist.service', [])
    .service('WishlistService', function ($q, $localstorage) {
        function exitsInArray(obj, array){
            var temp = 0;
            $.each(array, function(i){
                if(array[i].id === obj.id) {
                    temp = i;
                    return false;
                }
            });
            return temp;
        }

        function removeObj(obj, array){
            var temp = exitsInArray(obj, array);
            if(temp){
                array.splice(temp,1);
            }
            return temp;
        }
        return {
            addWishlist : function(item){
                item.like = !item.like;
                var wishlist_temp = $localstorage.getObject("wishlist");
                var temp = removeObj(item, wishlist_temp);
                var wishlist = [];
                if(!temp){
                    wishlist = wishlist.concat(item, wishlist_temp);
                }
                else{
                    wishlist = wishlist_temp;
                }
                $localstorage.setObject("wishlist", wishlist);
            }
        }
    });
},{}],24:[function(require,module,exports){
'use strict';

require('./cart_service.js');
require('./cart_controller.js');
require('../.././app_service');

module.exports = angular.module("cart", ['app.service', 'cart.services', 'cart.controller']);






},{"../.././app_service":3,"./cart_controller.js":25,"./cart_service.js":26}],25:[function(require,module,exports){
'use strict';

module.exports = angular.module('cart.controller', [])
    .controller("CartController", ['$scope', 'parameters', '$localstorage',
        function ($scope, parameters, $localstorage) {
//            $scope.productAttr = {
//                color:["yellow", "red", "orange", "blue"],
//                size:["S", "M", "L", "XL"]
//            }

            $scope.cart = [];


            $scope.optProd = {};

            $scope.add_to_cart = function () {
                console.log($localstorage.getObject("cart"));
                $scope.cart = $scope.cart.concat({
                        id: parameters.id,
                        title: parameters.title,
                        thumb: parameters.img,
                        color: $scope.optProd.color,
                        size: $scope.optProd.size,
                        quantity: $scope.optProd.quantity
                    },
                    $localstorage.getObject("cart"));

                $localstorage.setObject("cart", $scope.cart);
                $scope.closeModal();
            }

        }]);
},{}],26:[function(require,module,exports){
'use strict';

module.exports = angular.module('cart.services', [])
    .service('CartService', function ($q) {


    });
},{}],27:[function(require,module,exports){
'use strict';

require('./contact_service.js');
require('./contact_controller.js');
require('../.././app_service');

module.exports = angular.module("contact", ['app.service', 'contact.services', 'contact.controller']);






},{"../.././app_service":3,"./contact_controller.js":28,"./contact_service.js":29}],28:[function(require,module,exports){
'use strict';

module.exports = angular.module('contact.controller', [])
    .controller("ContactController", ['$scope', 'parameters', '$localstorage',
        function ($scope, parameters, $localstorage) {
        }]);
},{}],29:[function(require,module,exports){
'use strict';

module.exports = angular.module('contact.services', [])
    .service('ContactService', function ($q) {


    });
},{}],30:[function(require,module,exports){
'use strict';

module.exports = angular.module('registerLogin.services', [])
    .service('LoginService', function ($q) {
        return {
            loginUser: loginUser
        }
        function loginUser(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            if (name == '12345' && pw == '12345') {
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
},{}],31:[function(require,module,exports){
'use strict';

require('./login_service.js');
require('./register_login_controller.js');
require('../.././app_service');

module.exports = angular.module("registerLogin", ['app.service', 'registerLogin.services', 'registerLogin.controller']);






},{"../.././app_service":3,"./login_service.js":30,"./register_login_controller.js":32}],32:[function(require,module,exports){
'use strict';

module.exports = angular.module('registerLogin.controller', [])
    .controller("RegisterLoginController", ['$scope', 'LoginService', '$state', '$ionicPopup', '$localstorage',
        function ($scope, LoginService, $state, $ionicPopup, $localstorage) {

            $scope.result = function () {
                console.log(LoginService.rec);
            }

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
                LoginService.loginUser($scope.loginData.username, $scope.loginData.password)
                    .success(function (data) {
//                    $state.go('tab.dash');
                        $localstorage.setObject("current_user", $scope.loginData);
                        $scope.closeModal();
                        $state.go('menu.products');
                    })
                    .error(function (data) {
                        console.log("do not Login");
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
},{}],33:[function(require,module,exports){
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
            .state('cart', {
                url: "/cart",
                abstract: true,
                templateUrl: "js/modules/cart/cart.html",
                controller: 'CartController'
            })
        ;

        $stateProvider
            .state('contact', {
                url: "/conta",
                abstract: true,
                templateUrl: "js/modules/cart/cart.html",
                controller: 'CartController'
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
            .state('newMenu', {
                url: "/newMenu",
                abstract: true,
                templateUrl: "js/layout/newMenu/newMenu.html",
                controller: 'NewmenuController'
            })
        ;
        $stateProvider
            .state('newMenu.home', {
                url: "/home",
                templateUrl: "js/layout/newMenu/home.html",
                controller: 'NewmenuController'
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
                url: "/product/:index",
                templateUrl: "js/layout/products/product.html",
                controller: 'ProductController'
            })
        ;
        $stateProvider
            .state('menu.cart_page', {
                url: "/cart_page",
                templateUrl: "js/layout/cart_page/cart_page.html",
                controller: 'CartPageController'
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
                templateUrl: "js/layout/checkout_edit/checkout_edit.html",
                controller: 'CheckoutEditController'
            })
        ;
        $stateProvider
            .state('menu.wishlist', {
                url: "/wishlist",
                templateUrl: "js/layout/wishlist/wishlist.html",
                controller: 'WishlistController'
            })
        ;
    }
]
;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIi4vd3d3L2pzL2FwcC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvYXBwLW1haW4uanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2FwcF9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2FydF9wYWdlL2NhcnRfcGFnZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NhcnRfcGFnZS9jYXJ0X3BhZ2VfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXRfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0X2VkaXQvY2hlY2tvdXRfZWRpdC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0X2VkaXQvY2hlY2tvdXRfZWRpdF9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvaG9tZS9ob21lLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvaG9tZS9ob21lX2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9tZW51L21lbnUuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9tZW51L21lbnVfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L25ld01lbnUvbmV3TWVudS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L25ld01lbnUvbmV3TWVudV9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvbmV3TWVudS9uZXdNZW51X2ZhY3RvcnkuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0X2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0cy5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3Byb2R1Y3RzL3Byb2R1Y3RzX2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0c19mYWN0b3J5LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvd2lzaGxpc3Qvd2lzaGxpc3QuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC93aXNobGlzdC93aXNobGlzdF9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvd2lzaGxpc3Qvd2lzaGxpc3Rfc2VydmljZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9jYXJ0L2NhcnQuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL21vZHVsZXMvY2FydC9jYXJ0X2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL21vZHVsZXMvY2FydC9jYXJ0X3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL21vZHVsZXMvY29udGFjdC9jb250YWN0LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL2NvbnRhY3QvY29udGFjdF9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL2NvbnRhY3QvY29udGFjdF9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vbG9naW5fc2VydmljZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9yZWdpc3RlckxvZ2luL3JlZ2lzdGVyTG9naW4uanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3Rlcl9sb2dpbl9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9yb3V0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy9tb2R1bGUgbm9kZVxuLy9yZXF1aXJlKFwiYW5ndWxhclwiKTtcblxuLy9tb2R1bGUgZnVuY3Rpb25zXG5yZXF1aXJlKFwiLi9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJMb2dpblwiKTtcbnJlcXVpcmUoXCIuL21vZHVsZXMvY2FydC9jYXJ0XCIpO1xucmVxdWlyZShcIi4vbW9kdWxlcy9jb250YWN0L2NvbnRhY3RcIik7XG4vL21vZHVsZSBsYXlvdXRcbnJlcXVpcmUoXCIuL2xheW91dC9ob21lL2hvbWVcIik7XG5yZXF1aXJlKFwiLi9sYXlvdXQvbmV3TWVudS9uZXdNZW51XCIpO1xucmVxdWlyZShcIi4vbGF5b3V0L3Byb2R1Y3RzL3Byb2R1Y3RzXCIpO1xucmVxdWlyZShcIi4vbGF5b3V0L21lbnUvbWVudVwiKTtcbnJlcXVpcmUoXCIuL2xheW91dC9jYXJ0X3BhZ2UvY2FydF9wYWdlXCIpO1xucmVxdWlyZShcIi4vbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0XCIpO1xucmVxdWlyZShcIi4vbGF5b3V0L2NoZWNrb3V0X2VkaXQvY2hlY2tvdXRfZWRpdFwiKTtcbnJlcXVpcmUoXCIuL2xheW91dC93aXNobGlzdC93aXNobGlzdFwiKTtcblxubW9kdWxlLmV4cG9ydCA9IGFuZ3VsYXIubW9kdWxlKCdzdGFydGVyJywgWydpb25pYycsICdzbGljaycsICdha29lbmlnLmRlY2tncmlkJywnbmctbWZiJyxcbiAgICAgICAgLy9mdW5jdGlvbnNcbiAgICAgICAgJ3JlZ2lzdGVyTG9naW4nLFxuICAgICAgICAnY2FydCcsXG4gICAgICAgICdjb250YWN0JyxcblxuICAgICAgICAvL2xheW91dFxuICAgICAgICAnaG9tZScsXG4gICAgICAgICdtZW51JyxcbiAgICAgICAgJ25ld01lbnUnLFxuICAgICAgICAncHJvZHVjdHMnLFxuICAgICAgICAnQ2FydFBhZ2UnLFxuICAgICAgICAnY2hlY2tvdXQnLFxuICAgICAgICAnY2hlY2tvdXRFZGl0JyxcbiAgICAgICAgJ3dpc2hsaXN0JyxcblxuICAgIF0pXG4gICAgLmNvbmZpZyhyZXF1aXJlKCcuL3JvdXRlcicpKVxuICAgIC5jb25maWcoZnVuY3Rpb24gKCRpb25pY0NvbmZpZ1Byb3ZpZGVyKSB7XG4gICAgICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLnBsYXRmb3JtLmFuZHJvaWQudGFicy5wb3NpdGlvbihcImJvdHRvbVwiKTtcbiAgICB9KVxuICAgIC5ydW4ocmVxdWlyZSgnLi9hcHAtbWFpbicpKTtcblxuXG5cbiIsIid1c2Ugc3RyaWN0JztcclxuZnVuY3Rpb24gQXBwTWFpbigkaW9uaWNQbGF0Zm9ybSl7XHJcbiAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXHJcbiAgICAgICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxyXG4gICAgICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XHJcbiAgICAgICAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XHJcbiAgICAgICAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5kaXNhYmxlU2Nyb2xsKHRydWUpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcclxuICAgICAgICAgICAgLy8gb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxyXG4gICAgICAgICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gWyckaW9uaWNQbGF0Zm9ybScsIEFwcE1haW5dOyIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VcIiwgW10pXHJcbiAgICAuZmFjdG9yeSgnJGxvY2Fsc3RvcmFnZScsIFsnJHdpbmRvdycsJyRpb25pY0hpc3RvcnknLCBmdW5jdGlvbiAoJHdpbmRvdywgJGlvbmljSGlzdG9yeSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoa2V5LCBkZWZhdWx0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8IGRlZmF1bHRWYWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0T2JqZWN0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0T2JqZWN0OiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8ICd7fScpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXROdWxsOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRPYmplY3Qoa2V5LHt9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0TnVsbEFsbDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFyQ2FjaGUoKTtcclxuICAgICAgICAgICAgICAgICRpb25pY0hpc3RvcnkuY2xlYXJIaXN0b3J5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XSlcclxuICAgIC5zZXJ2aWNlKCdDb250cm9sTW9kYWxTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkaW9uaWNNb2RhbCwgJHJvb3RTY29wZSwgJHRpbWVvdXQsICRjb250cm9sbGVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2hvdzogc2hvd1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBzaG93KHRlbXBsZXRlVXJsLCBjb250cm9sbGVyLCBhdXRvc2hvdywgcGFyYW1ldGVycywgb3B0aW9ucywgd3JhcENhbHNzKSB7XHJcbiAgICAgICAgICAgIC8vIEdyYWIgdGhlIGluamVjdG9yIGFuZCBjcmVhdGUgYSBuZXcgc2NvcGVcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKSxcclxuICAgICAgICAgICAgICAgIGN0cmxJbnN0YW5jZSxcclxuICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKSxcclxuICAgICAgICAgICAgICAgIHRoaXNTY29wZUlkID0gbW9kYWxTY29wZS4kaWQsXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb246ICdzbGlkZS1pbi11cCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZm9jdXNGaXJzdElucHV0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZHJvcENsaWNrVG9DbG9zZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBoYXJkd2FyZUJhY2tCdXR0b25DbG9zZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBtb2RhbENhbGxiYWNrOiBudWxsXHJcblxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgJGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKHRlbXBsZXRlVXJsLCB7XHJcbiAgICAgICAgICAgICAgICBzY29wZTogbW9kYWxTY29wZSxcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogb3B0aW9ucy5hbmltYXRpb24sXHJcbiAgICAgICAgICAgICAgICBmb2N1c0ZpcnN0SW5wdXQ6IG9wdGlvbnMuZm9jdXNGaXJzdElucHV0LFxyXG4gICAgICAgICAgICAgICAgYmFja2Ryb3BDbGlja1RvQ2xvc2U6IG9wdGlvbnMuYmFja2Ryb3BDbGlja1RvQ2xvc2UsXHJcbiAgICAgICAgICAgICAgICBoYXJkd2FyZUJhY2tCdXR0b25DbG9zZTogb3B0aW9ucy5oYXJkd2FyZUJhY2tCdXR0b25DbG9zZVxyXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWwgPSBtb2RhbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWwuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLm1vZGFsLmFkZENsYXNzKFwiYWRkcnVpbmVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnRlc3QgPSBcImFhXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWwuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUuJG9uKCdtb2RhbC5oaWRkZW4nLCBmdW5jdGlvbiAodGhpc01vZGFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzTW9kYWwuY3VycmVudFNjb3BlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbW9kYWxTY29wZUlkID0gdGhpc01vZGFsLmN1cnJlbnRTY29wZS4kaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc1Njb3BlSWQgPT09IG1vZGFsU2NvcGVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2NsZWFudXAodGhpc01vZGFsLmN1cnJlbnRTY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSW52b2tlIHRoZSBjb250cm9sbGVyXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2FscyA9IHsgJyRzY29wZSc6IG1vZGFsU2NvcGUsICdwYXJhbWV0ZXJzJzogcGFyYW1ldGVycyB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdHJsRXZhbCA9IF9ldmFsQ29udHJvbGxlcihjb250cm9sbGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBjdHJsSW5zdGFuY2UgPSAkY29udHJvbGxlcihjb250cm9sbGVyLCBsb2NhbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdHJsRXZhbC5pc0NvbnRyb2xsZXJBcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHJsSW5zdGFuY2Uub3Blbk1vZGFsID0gbW9kYWxTY29wZS5vcGVuTW9kYWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0cmxJbnN0YW5jZS5jbG9zZU1vZGFsID0gbW9kYWxTY29wZS5jbG9zZU1vZGFsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF1dG9zaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWwuc2hvdygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS4kYnJvYWRjYXN0KCdtb2RhbC5hZnRlclNob3cnLCBtb2RhbFNjb3BlLm1vZGFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihvcHRpb25zLm1vZGFsQ2FsbGJhY2spKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubW9kYWxDYWxsYmFjayhtb2RhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBfY2xlYW51cChzY29wZSkge1xyXG4gICAgICAgICAgICBzY29wZS4kZGVzdHJveSgpO1xyXG4gICAgICAgICAgICBpZiAoc2NvcGUubW9kYWwpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLm1vZGFsLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBfZXZhbENvbnRyb2xsZXIoY3RybE5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgICAgICAgICAgIGlzQ29udHJvbGxlckFzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJOYW1lOiAnJyxcclxuICAgICAgICAgICAgICAgIHByb3BOYW1lOiAnJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB2YXIgZnJhZ21lbnRzID0gKGN0cmxOYW1lIHx8ICcnKS50cmltKCkuc3BsaXQoL1xccysvKTtcclxuICAgICAgICAgICAgcmVzdWx0LmlzQ29udHJvbGxlckFzID0gZnJhZ21lbnRzLmxlbmd0aCA9PT0gMyAmJiAoZnJhZ21lbnRzWzFdIHx8ICcnKS50b0xvd2VyQ2FzZSgpID09PSAnYXMnO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LmlzQ29udHJvbGxlckFzKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuY29udHJvbGxlck5hbWUgPSBmcmFnbWVudHNbMF07XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHJvcE5hbWUgPSBmcmFnbWVudHNbMl07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuY29udHJvbGxlck5hbWUgPSBjdHJsTmFtZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCcuL2NhcnRfcGFnZV9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJDYXJ0UGFnZVwiLCBbJ2FwcC5zZXJ2aWNlJywgJ0NhcnRQYWdlLmNvbnRyb2xsZXInXSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnQ2FydFBhZ2UuY29udHJvbGxlcicsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJDYXJ0UGFnZUNvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnJGxvY2Fsc3RvcmFnZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2Fsc3RvcmFnZSkge1xyXG4vLyAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbChcImNhcnRcIik7XHJcbiAgICAgICAgICAgICRzY29wZS5jYXJ0bGlzdCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmNhcnRsaXN0KTtcclxuICAgICAgICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9jaGVja291dF9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJjaGVja291dFwiLCBbJ2FwcC5zZXJ2aWNlJywgJ2NoZWNrb3V0LmNvbnRyb2xsZXInXSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnY2hlY2tvdXQuY29udHJvbGxlcicsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJDaGVja291dENvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnJGxvY2Fsc3RvcmFnZScsICdDb250cm9sTW9kYWxTZXJ2aWNlJywgJyRzdGF0ZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2Fsc3RvcmFnZSwgQ29udHJvbE1vZGFsU2VydmljZSwgJHN0YXRlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5jYXJ0bGlzdCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jaGVja291dCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE51bGwoXCJjYXJ0XCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwibWVudS5wcm9kdWN0c1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCcuL2NoZWNrb3V0X2VkaXRfY29udHJvbGxlci5qcycpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiY2hlY2tvdXRFZGl0XCIsIFsnYXBwLnNlcnZpY2UnLCAnY2hlY2tvdXRFZGl0LmNvbnRyb2xsZXInXSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnY2hlY2tvdXRFZGl0LmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiQ2hlY2tvdXRFZGl0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckbG9jYWxzdG9yYWdlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAgJGxvY2Fsc3RvcmFnZSkge1xyXG4vLyAgICAgICAgICAgICRzY29wZS5wcm9kdWN0QXR0ciA9IHtcclxuLy8gICAgICAgICAgICAgICAgY29sb3I6W1wieWVsbG93XCIsIFwicmVkXCIsIFwib3JhbmdlXCIsIFwiYmx1ZVwiXSxcclxuLy8gICAgICAgICAgICAgICAgc2l6ZTpbXCJTXCIsIFwiTVwiLCBcIkxcIiwgXCJYTFwiXVxyXG4vLyAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHNjb3BlLmNhcnQgPSBbXTtcclxuXHJcblxyXG4gICAgICAgICAgICAkc2NvcGUub3B0UHJvZCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFkZF90b19jYXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jYXJ0ID0gJHNjb3BlLmNhcnQuY29uY2F0KHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogcGFyYW1ldGVycy5pZCxcclxuICAgICAgICAgICAgICAgICAgICB0aHVtYjogcGFyYW1ldGVycy5pbWcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICRzY29wZS5vcHRQcm9kLmNvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgIHNpemU6ICRzY29wZS5vcHRQcm9kLnNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6ICRzY29wZS5vcHRQcm9kLnF1YW50aXR5XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXRPYmplY3QoXCJjYXJ0XCIsICRzY29wZS5jYXJ0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5yZXF1aXJlKCcuL2hvbWVfY29udHJvbGxlcicpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdob21lJywgWydhcHAuc2VydmljZScsIFwiaG9tZS5jb250cm9sbGVyXCJdKTtcclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJob21lLmNvbnRyb2xsZXJcIiwgW10pXHJcbiAgICAuY29udHJvbGxlcihcIkhvbWVDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJ0xvZ2luU2VydmljZScsJyRsb2NhbHN0b3JhZ2UnLCckc3RhdGUnLCdDb250cm9sTW9kYWxTZXJ2aWNlJywnJHRpbWVvdXQnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIExvZ2luU2VydmljZSwgJGxvY2Fsc3RvcmFnZSwgJHN0YXRlLCBDb250cm9sTW9kYWxTZXJ2aWNlLCAkdGltZW91dCkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudFVzZXIgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImN1cnJlbnRfdXNlclwiKTtcclxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGlmKCFjdXJyZW50VXNlci51c2VybmFtZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29udHJvbE1vZGFsU2VydmljZS5zaG93KCdqcy9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJMb2dpbi5odG1sJywgJ1JlZ2lzdGVyTG9naW5Db250cm9sbGVyJywgMSk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50VXNlci51c2VybmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdtZW51LnByb2R1Y3RzJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDIwMDApO1xyXG5cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBkbyB5b3VyICQoKSBzdHVmZiBoZXJlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfV0pOyIsIlwidXNlIHN0cmljdFwiXHJcbnJlcXVpcmUoXCIuL21lbnVfY29udHJvbGxlci5qc1wiKTtcclxucmVxdWlyZShcIi4uLy4vcHJvZHVjdHMvcHJvZHVjdHNfZmFjdG9yeS5qc1wiKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcIm1lbnVcIiwgWydhcHAuc2VydmljZScsIFwicHJvZHVjdHMuZmFjdG9yeVwiLCBcIm1lbnUuY29udHJvbGxlclwiXSlcclxuICAgIC5jb25maWcoZnVuY3Rpb24gKCRpb25pY0NvbmZpZ1Byb3ZpZGVyKSB7XHJcbiAgICAgICAgJGlvbmljQ29uZmlnUHJvdmlkZXIuYmFja0J1dHRvbi5wcmV2aW91c1RpdGxlVGV4dChmYWxzZSkudGV4dCgnJyk7XHJcbiAgICB9KTsiLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcIm1lbnUuY29udHJvbGxlclwiLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiTWVudUNvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZScsICdQcm9kdWN0U2VydmljZScsICckc3RhdGUnLCAnQ29udHJvbE1vZGFsU2VydmljZScsJyRpb25pY0hpc3RvcnknLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsIFByb2R1Y3RTZXJ2aWNlLCAkc3RhdGUsIENvbnRyb2xNb2RhbFNlcnZpY2UsICRpb25pY0hpc3RvcnkpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmZpbHRlclR5cGUgPSBbXHJcbiAgICAgICAgICAgICAgICB7dHlwZTogXCJob3RcIiwgbmFtZTogJ1NhbiBwaGFtIGhvdCd9LFxyXG4gICAgICAgICAgICAgICAge3R5cGU6IFwiYmVzdHNlbGxlclwiLCBuYW1lOiAnU2FuIHBoYW0gYmFuIGNoYXknfSxcclxuICAgICAgICAgICAgICAgIHt0eXBlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbHQ6IDUwXHJcbiAgICAgICAgICAgICAgICB9LCBuYW1lOiAnRHVvaSA1MC4wMDAnfSxcclxuICAgICAgICAgICAgICAgIHt0eXBlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZDogWzUwLCAxMDBdXHJcbiAgICAgICAgICAgICAgICB9LCBuYW1lOiAnNTAuMDAwIGRlbiAxMDAuMDAwJ30sXHJcbiAgICAgICAgICAgICAgICB7dHlwZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmQ6IFsxMDAsIDIwMF1cclxuICAgICAgICAgICAgICAgIH0sIG5hbWU6ICcxMDAuMDAwIGRlbiAyMDAuMDAwJ30sXHJcbiAgICAgICAgICAgICAgICB7dHlwZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGd0OiAyMDBcclxuICAgICAgICAgICAgICAgIH0sIG5hbWU6ICdUcmVuIDIwMC4wMDAnfVxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wZW5NZW51ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS50b2dnbGVMZWZ0KCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUucHJvZHVjdHMgPSBQcm9kdWN0U2VydmljZS5wcm9kdWN0Q3VycmVudDtcclxuICAgICAgICAgICAgJHNjb3BlLnBhZ2UgPSBQcm9kdWN0U2VydmljZS5wYWdlO1xyXG4gICAgICAgICAgICAkc2NvcGUuZmlyc3RUaW1lID0gMDtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5nZXRQcm9kdWN0cyA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlID0gSlNPTi5zdHJpbmdpZnkodHlwZSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudGNoZWNrQ3RybCA9IHR5cGU7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5maWx0ZXJQcm9kdWN0KHR5cGUpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5uZXh0Vmlld09wdGlvbnMoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZUJhY2s6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmNvcHkoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5wYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5jb3B5KGRhdGEsICRzY29wZS5wcm9kdWN0cyk7Ly9tdXN0IHVzZSBhbmd1bGFyLmNvcHkgdGhhbiB1c2UgXCI9XCIgc28gaXQgY2FuIGNvbnRpbnVlIGJpbmRpbmcgdG8gZmlyc3Qgc2VydmljZSBwYXJhbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmZpcnN0VGltZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcIm1lbnUucHJvZHVjdHNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5maXJzdFRpbWUgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jb250YWN0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIENvbnRyb2xNb2RhbFNlcnZpY2Uuc2hvdygnanMvbW9kdWxlcy9jb250YWN0L2NvbnRhY3QuaHRtbCcsICdDb250YWN0Q29udHJvbGxlcicsIDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2hvd19jYXJ0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcIm1lbnUuY2FydF9wYWdlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzY29wZS5nZXRQcm9kdWN0cyhcImhvdFwiKTtcclxuICAgICAgICB9XHJcbiAgICBdKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCJcclxucmVxdWlyZShcIi4vbmV3TWVudV9jb250cm9sbGVyLmpzXCIpO1xyXG5yZXF1aXJlKFwiLi9uZXdNZW51X2ZhY3RvcnkuanNcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwibmV3TWVudVwiLCBbXCJuZXdNZW51LmZhY3RvcnlcIiwgXCJuZXdNZW51LmNvbnRyb2xsZXJcIl0pOyIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwibmV3TWVudS5jb250cm9sbGVyXCIsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJOZXdtZW51Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckaW9uaWNTaWRlTWVudURlbGVnYXRlJywgJ01vdmllcycsXHJcbiAgICAgICAgZnVuY3Rpb24oJHNjb3BlLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCBNb3ZpZXMpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnNvcnRpbmcgPSBbe3Njb3JlOiA5LCBuYW1lIDogJ1Njb3JlIG1vcmUgdGhlbiA5J30sXHJcbiAgICAgICAgICAgICAgICB7c2NvcmU6IDgsIG5hbWUgOiAnU2NvcmUgbW9yZSB0aGVuIDgnfSxcclxuICAgICAgICAgICAgICAgIHtzY29yZTogNywgbmFtZSA6ICdTY29yZSBtb3JlIHRoZW4gNyd9LFxyXG4gICAgICAgICAgICAgICAge3Njb3JlOiA2LCBuYW1lIDogJ1Njb3JlIG1vcmUgdGhlbiA2J30sXHJcbiAgICAgICAgICAgICAgICB7c2NvcmU6IDUsIG5hbWUgOiAnU2NvcmUgbW9yZSB0aGVuIDUnfSxcclxuICAgICAgICAgICAgICAgIHtzY29yZTogNCwgbmFtZSA6ICdTY29yZSBtb3JlIHRoZW4gNCd9LFxyXG4gICAgICAgICAgICAgICAge3Njb3JlOiAzLCBuYW1lIDogJ1Njb3JlIG1vcmUgdGhlbiAzJ30sXHJcbiAgICAgICAgICAgICAgICB7c2NvcmU6IDIsIG5hbWUgOiAnU2NvcmUgbW9yZSB0aGVuIDInfSxcclxuICAgICAgICAgICAgICAgIHtzY29yZTogMSwgbmFtZSA6ICdTY29yZSBtb3JlIHRoZW4gMSd9LFxyXG4gICAgICAgICAgICAgICAge3Njb3JlOiAwLCBuYW1lIDogJ1Nob3cgbWUgZXZlcnkgbW92aWUnfV07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWQgPSB7XHJcbiAgICAgICAgICAgICAgICBzY29yZSA6IDAsXHJcbiAgICAgICAgICAgICAgICBtb3ZpZU5hbWUgOiAnQmF0bWFuJ1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUub3Blbk1lbnUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLnRvZ2dsZUxlZnQoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5ncmVhdGVyVGhhbiA9IGZ1bmN0aW9uKGZpZWxkTmFtZSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1bZmllbGROYW1lXSA+ICRzY29wZS5zZWxlY3RlZC5zY29yZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNlYXJjaE1vdmllREIgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBNb3ZpZXMubGlzdCgkc2NvcGUuc2VsZWN0ZWQubW92aWVOYW1lLCBmdW5jdGlvbihtb3ZpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW92aWVzID0gbW92aWVzO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNlYXJjaE1vdmllREIoKTtcclxuICAgICAgICB9XHJcbiAgICBdKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJuZXdNZW51LmZhY3RvcnlcIiwgW10pXHJcbiAgICAuZmFjdG9yeSgnTW92aWVzJywgZnVuY3Rpb24gKCRodHRwKSB7XHJcbiAgICAgICAgdmFyIGNhY2hlZERhdGE7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldERhdGEobW92aWVuYW1lLCBjYWxsYmFjaykge1xyXG5cclxuICAgICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvJyxcclxuICAgICAgICAgICAgICAgIG1vZGUgPSAnc2VhcmNoL21vdmllP3F1ZXJ5PScsXHJcbiAgICAgICAgICAgICAgICBuYW1lID0gJyZxdWVyeT0nICsgZW5jb2RlVVJJKG1vdmllbmFtZSksXHJcbiAgICAgICAgICAgICAgICBrZXkgPSAnJmFwaV9rZXk9NDcwZmQyZWM4ODUzZTI1ZDJmOGQ4NmY2ODVkMjI3MGUnO1xyXG5cclxuICAgICAgICAgICAgJGh0dHAuZ2V0KHVybCArIG1vZGUgKyBrZXkgKyBuYW1lKS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FjaGVkRGF0YSA9IGRhdGEucmVzdWx0cztcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEucmVzdWx0cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbGlzdDogZ2V0RGF0YSxcclxuICAgICAgICAgICAgZmluZDogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhuYW1lKTtcclxuICAgICAgICAgICAgICAgIHZhciBtb3ZpZSA9IGNhY2hlZERhdGEuZmlsdGVyKGZ1bmN0aW9uIChlbnRyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbnRyeS5pZCA9PSBuYW1lO1xyXG4gICAgICAgICAgICAgICAgfSlbMF07XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhtb3ZpZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH0pOyIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwicHJvZHVjdC5jb250cm9sbGVyXCIsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJQcm9kdWN0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICdQcm9kdWN0U2VydmljZScsICckc3RhdGVQYXJhbXMnLCdXaXNobGlzdFNlcnZpY2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIFByb2R1Y3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMsIFdpc2hsaXN0U2VydmljZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUucHJvZHVjdCA9IFByb2R1Y3RTZXJ2aWNlLnZpZXdEZXRhaWwoJHN0YXRlUGFyYW1zLmluZGV4KTtcclxuXHJcbi8vICAgICAgICAgICAgJHNjb3BlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcclxuLy8gICAgICAgICAgICAgICAgJHNjb3BlLiRicm9hZGNhc3QoJ2RhdGFsb2FkZWQnKTtcclxuLy8gICAgICAgICAgICB9O1xyXG4vL1xyXG4vLyAgICAgICAgICAgICRzY29wZS5pbml0KCk7XHJcbiAgICAgICAgICAgICRzY29wZS5hZGRUb1dpc2hsaXN0ID0gZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgICBXaXNobGlzdFNlcnZpY2UuYWRkV2lzaGxpc3QoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XSk7XHJcbiIsIlwidXNlIHN0cmljdFwiXHJcbnJlcXVpcmUoXCIuL3Byb2R1Y3RzX2ZhY3RvcnkuanNcIik7XHJcbnJlcXVpcmUoXCIuL3Byb2R1Y3RzX2NvbnRyb2xsZXIuanNcIik7XHJcbnJlcXVpcmUoXCIuL3Byb2R1Y3RfY29udHJvbGxlci5qc1wiKTtcclxucmVxdWlyZSgnLi4vLi93aXNobGlzdC93aXNobGlzdF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwcm9kdWN0c1wiLCBbJ2FwcC5zZXJ2aWNlJywgJ3dpc2hsaXN0LnNlcnZpY2UnLCBcInByb2R1Y3RzLmZhY3RvcnlcIiwgXCJwcm9kdWN0cy5jb250cm9sbGVyXCIsIFwicHJvZHVjdC5jb250cm9sbGVyXCJdKVxyXG4gICAgLmNvbmZpZyhmdW5jdGlvbiAoJGlvbmljQ29uZmlnUHJvdmlkZXIpIHtcclxuICAgICAgICAkaW9uaWNDb25maWdQcm92aWRlci5iYWNrQnV0dG9uLnByZXZpb3VzVGl0bGVUZXh0KGZhbHNlKS50ZXh0KCcnKTtcclxuICAgIH0pOyIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwicHJvZHVjdHMuY29udHJvbGxlclwiLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiUHJvZHVjdHNDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRpb25pY1NpZGVNZW51RGVsZWdhdGUnLCdQcm9kdWN0U2VydmljZScsICdDb250cm9sTW9kYWxTZXJ2aWNlJywnV2lzaGxpc3RTZXJ2aWNlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCBQcm9kdWN0U2VydmljZSwgQ29udHJvbE1vZGFsU2VydmljZSwgV2lzaGxpc3RTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5wcm9kdWN0cyA9IFByb2R1Y3RTZXJ2aWNlLnByb2R1Y3RDdXJyZW50O1xyXG4gICAgICAgICAgICAkc2NvcGUucGFnZSA9IFByb2R1Y3RTZXJ2aWNlLnBhZ2U7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUub3Blbk1lbnUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLnRvZ2dsZUxlZnQoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5sb2FkTW9yZURhdGEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHlwZSA9ICRzY29wZS5jdXJyZW50Y2hlY2tDdHJsO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0ZW1wcGFnZSA9ICRzY29wZS5wYWdlLm51bWJlcjtcclxuICAgICAgICAgICAgICAgIHRlbXBwYWdlKys7XHJcblxyXG4gICAgICAgICAgICAgICAgUHJvZHVjdFNlcnZpY2UuZmlsdGVyUHJvZHVjdCh0eXBlLCAxLCB0ZW1wcGFnZSkudGhlbihcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcCA9ICRzY29wZS5wcm9kdWN0cztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcCA9IHRlbXAuY29uY2F0KGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmNvcHkodGVtcCwgJHNjb3BlLnByb2R1Y3RzKTsvL211c3QgdXNlIGFuZ3VsYXIuY29weVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdCgnc2Nyb2xsLmluZmluaXRlU2Nyb2xsQ29tcGxldGUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuY29weSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1iZXIgOiB0ZW1wcGFnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUucGFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jaG9vc2VQcm9kdWN0T3B0aW9uID0gZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgICBDb250cm9sTW9kYWxTZXJ2aWNlLnNob3coJ2pzL21vZHVsZXMvY2FydC9jYXJ0Lmh0bWwnLCAnQ2FydENvbnRyb2xsZXInLCAxLCBpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFkZFRvV2lzaGxpc3QgPSBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgIFdpc2hsaXN0U2VydmljZS5hZGRXaXNobGlzdChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIF0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcInByb2R1Y3RzLmZhY3RvcnlcIiwgW10pXHJcbiAgICAuZmFjdG9yeSgnUHJvZHVjdFNlcnZpY2UnLCBmdW5jdGlvbiAoJHEsICRodHRwLCAkbG9jYWxzdG9yYWdlKSB7XHJcbiAgICAgICAgdmFyIHByb2R1Y3RzID0gW107XHJcbiAgICAgICAgdmFyIHBhZ2UgPSB7XHJcbiAgICAgICAgICAgIG51bWJlciA6IDFcclxuICAgICAgICB9Oy8vc2hvdWxkIHVzZSBvYmplY3Qgb3IgYXJyYXksIGRvbid0IHVzZSBhIHNpbmdsZSB2YXJpYWJsZVxyXG5cclxuICAgICAgICByZXR1cm57XHJcbiAgICAgICAgICAgIGZpbHRlclByb2R1Y3Q6IGZ1bmN0aW9uIChmaWx0ZXJUeXBlLCBhamF4LCBwYWdlX25leHQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGxpbmtfYWpheCA9IFwiaHR0cDovL2xpcXVvcmRlbGl2ZXJ5LmNvbS5zZy93cC1hZG1pbi9hZG1pbi1hamF4LnBocFwiO1xyXG4gICAgICAgICAgICAgICAgJGh0dHAuZ2V0KGxpbmtfYWpheCArIFwiP2FjdGlvbj1sYXRlc3RfcHJvZHVjdHNfYXBwJmZpbHRlcj1cIiArIGZpbHRlclR5cGUgKyBcIiZwYWdlPVwiICsgcGFnZV9uZXh0KS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhamF4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3RzID0gcHJvZHVjdHMuY29uY2F0KHJlc3AuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0cyA9IHJlc3AuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmV4dGVuZChyZXNwLmRhdGEsICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3AuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9yIEpTT04gcmVzcG9uc2VzLCByZXNwLmRhdGEgY29udGFpbnMgdGhlIHJlc3VsdFxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0VSUicsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdFUlIgJyArIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZXJyLnN0YXR1cyB3aWxsIGNvbnRhaW4gdGhlIHN0YXR1cyBjb2RlXHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgdmlld0RldGFpbDogZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvZHVjdHNbaW5kZXhdO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcHJvZHVjdEN1cnJlbnQgOiBwcm9kdWN0cyxcclxuXHJcbiAgICAgICAgICAgIHBhZ2UgOiBwYWdlXHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi93aXNobGlzdF9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4vd2lzaGxpc3Rfc2VydmljZS5qcycpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwid2lzaGxpc3RcIiwgWydhcHAuc2VydmljZScsICd3aXNobGlzdC5zZXJ2aWNlJywgJ3dpc2hsaXN0LmNvbnRyb2xsZXInXSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnd2lzaGxpc3QuY29udHJvbGxlcicsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJXaXNobGlzdENvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnJGxvY2Fsc3RvcmFnZScsJ1dpc2hsaXN0U2VydmljZScsJyRzdGF0ZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2Fsc3RvcmFnZSwgV2lzaGxpc3RTZXJ2aWNlLCAkc3RhdGUpIHtcclxuICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsKCk7XHJcbiAgICAgICAgICAgICRzY29wZS53aXNobGlzdCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIik7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkVG9XaXNobGlzdCA9IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgV2lzaGxpc3RTZXJ2aWNlLmFkZFdpc2hsaXN0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnd2lzaGxpc3Quc2VydmljZScsIFtdKVxyXG4gICAgLnNlcnZpY2UoJ1dpc2hsaXN0U2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGxvY2Fsc3RvcmFnZSkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGV4aXRzSW5BcnJheShvYmosIGFycmF5KXtcclxuICAgICAgICAgICAgdmFyIHRlbXAgPSAwO1xyXG4gICAgICAgICAgICAkLmVhY2goYXJyYXksIGZ1bmN0aW9uKGkpe1xyXG4gICAgICAgICAgICAgICAgaWYoYXJyYXlbaV0uaWQgPT09IG9iai5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXAgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZW1wO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlT2JqKG9iaiwgYXJyYXkpe1xyXG4gICAgICAgICAgICB2YXIgdGVtcCA9IGV4aXRzSW5BcnJheShvYmosIGFycmF5KTtcclxuICAgICAgICAgICAgaWYodGVtcCl7XHJcbiAgICAgICAgICAgICAgICBhcnJheS5zcGxpY2UodGVtcCwxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGVtcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYWRkV2lzaGxpc3QgOiBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgIGl0ZW0ubGlrZSA9ICFpdGVtLmxpa2U7XHJcbiAgICAgICAgICAgICAgICB2YXIgd2lzaGxpc3RfdGVtcCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IHJlbW92ZU9iaihpdGVtLCB3aXNobGlzdF90ZW1wKTtcclxuICAgICAgICAgICAgICAgIHZhciB3aXNobGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgaWYoIXRlbXApe1xyXG4gICAgICAgICAgICAgICAgICAgIHdpc2hsaXN0ID0gd2lzaGxpc3QuY29uY2F0KGl0ZW0sIHdpc2hsaXN0X3RlbXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICB3aXNobGlzdCA9IHdpc2hsaXN0X3RlbXA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE9iamVjdChcIndpc2hsaXN0XCIsIHdpc2hsaXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vY2FydF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4vY2FydF9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJjYXJ0XCIsIFsnYXBwLnNlcnZpY2UnLCAnY2FydC5zZXJ2aWNlcycsICdjYXJ0LmNvbnRyb2xsZXInXSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnY2FydC5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIkNhcnRDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJ3BhcmFtZXRlcnMnLCAnJGxvY2Fsc3RvcmFnZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgcGFyYW1ldGVycywgJGxvY2Fsc3RvcmFnZSkge1xyXG4vLyAgICAgICAgICAgICRzY29wZS5wcm9kdWN0QXR0ciA9IHtcclxuLy8gICAgICAgICAgICAgICAgY29sb3I6W1wieWVsbG93XCIsIFwicmVkXCIsIFwib3JhbmdlXCIsIFwiYmx1ZVwiXSxcclxuLy8gICAgICAgICAgICAgICAgc2l6ZTpbXCJTXCIsIFwiTVwiLCBcIkxcIiwgXCJYTFwiXVxyXG4vLyAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jYXJ0ID0gW107XHJcblxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wdFByb2QgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hZGRfdG9fY2FydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2FydCA9ICRzY29wZS5jYXJ0LmNvbmNhdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBwYXJhbWV0ZXJzLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogcGFyYW1ldGVycy50aXRsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGh1bWI6IHBhcmFtZXRlcnMuaW1nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJHNjb3BlLm9wdFByb2QuY29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6ICRzY29wZS5vcHRQcm9kLnNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAkc2NvcGUub3B0UHJvZC5xdWFudGl0eVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE9iamVjdChcImNhcnRcIiwgJHNjb3BlLmNhcnQpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlTW9kYWwoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnY2FydC5zZXJ2aWNlcycsIFtdKVxyXG4gICAgLnNlcnZpY2UoJ0NhcnRTZXJ2aWNlJywgZnVuY3Rpb24gKCRxKSB7XHJcblxyXG5cclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vY29udGFjdF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4vY29udGFjdF9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJjb250YWN0XCIsIFsnYXBwLnNlcnZpY2UnLCAnY29udGFjdC5zZXJ2aWNlcycsICdjb250YWN0LmNvbnRyb2xsZXInXSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnY29udGFjdC5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIkNvbnRhY3RDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJ3BhcmFtZXRlcnMnLCAnJGxvY2Fsc3RvcmFnZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgcGFyYW1ldGVycywgJGxvY2Fsc3RvcmFnZSkge1xyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjb250YWN0LnNlcnZpY2VzJywgW10pXHJcbiAgICAuc2VydmljZSgnQ29udGFjdFNlcnZpY2UnLCBmdW5jdGlvbiAoJHEpIHtcclxuXHJcblxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgncmVnaXN0ZXJMb2dpbi5zZXJ2aWNlcycsIFtdKVxyXG4gICAgLnNlcnZpY2UoJ0xvZ2luU2VydmljZScsIGZ1bmN0aW9uICgkcSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxvZ2luVXNlcjogbG9naW5Vc2VyXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2luVXNlcihuYW1lLCBwdykge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAobmFtZSA9PSAnMTIzNDUnICYmIHB3ID09ICcxMjM0NScpIHtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoJ1dlbGNvbWUgJyArIG5hbWUgKyAnIScpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdXcm9uZyBjcmVkZW50aWFscy4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcm9taXNlLnN1Y2Nlc3MgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihmbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcm9taXNlLmVycm9yID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4obnVsbCwgZm4pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9sb2dpbl9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4vcmVnaXN0ZXJfbG9naW5fY29udHJvbGxlci5qcycpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwicmVnaXN0ZXJMb2dpblwiLCBbJ2FwcC5zZXJ2aWNlJywgJ3JlZ2lzdGVyTG9naW4uc2VydmljZXMnLCAncmVnaXN0ZXJMb2dpbi5jb250cm9sbGVyJ10pO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ3JlZ2lzdGVyTG9naW4uY29udHJvbGxlcicsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJSZWdpc3RlckxvZ2luQ29udHJvbGxlclwiLCBbJyRzY29wZScsICdMb2dpblNlcnZpY2UnLCAnJHN0YXRlJywgJyRpb25pY1BvcHVwJywgJyRsb2NhbHN0b3JhZ2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIExvZ2luU2VydmljZSwgJHN0YXRlLCAkaW9uaWNQb3B1cCwgJGxvY2Fsc3RvcmFnZSkge1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnJlc3VsdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKExvZ2luU2VydmljZS5yZWMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUubG9naW5EYXRhID0ge307XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUub3BlbkxvZ2luTW9kYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUub3Blbk1vZGFsKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jbG9zZUxvZ2luTW9kYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VNb2RhbCgpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdtZW51LnByb2R1Y3RzJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vbG9naW4gc2VjdGlvblxyXG4gICAgICAgICAgICAkc2NvcGUuZG9SZWdpc3RlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEb2luZyByZWdpc3RlcicsICRzY29wZS5sb2dpbkRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNpbXVsYXRlIGEgbG9naW4gZGVsYXkuIFJlbW92ZSB0aGlzIGFuZCByZXBsYWNlIHdpdGggeW91ciBsb2dpblxyXG4gICAgICAgICAgICAgICAgLy8gY29kZSBpZiB1c2luZyBhIGxvZ2luIHN5c3RlbVxyXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZUxvZ2luUmVnaXN0ZXIoKTtcclxuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vcmVnaXN0ZXIgc2VjdGlvblxyXG4gICAgICAgICAgICAkc2NvcGUuZG9Mb2dpbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIExvZ2luU2VydmljZS5sb2dpblVzZXIoJHNjb3BlLmxvZ2luRGF0YS51c2VybmFtZSwgJHNjb3BlLmxvZ2luRGF0YS5wYXNzd29yZClcclxuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCd0YWIuZGFzaCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE9iamVjdChcImN1cnJlbnRfdXNlclwiLCAkc2NvcGUubG9naW5EYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdtZW51LnByb2R1Y3RzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkbyBub3QgTG9naW5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdMb2dpbiBmYWlsZWQhJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnUGxlYXNlIGNoZWNrIHlvdXIgY3JlZGVudGlhbHMhJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTaW11bGF0ZSBhIGxvZ2luIGRlbGF5LiBSZW1vdmUgdGhpcyBhbmQgcmVwbGFjZSB3aXRoIHlvdXIgbG9naW5cclxuICAgICAgICAgICAgICAgIC8vIGNvZGUgaWYgdXNpbmcgYSBsb2dpbiBzeXN0ZW1cclxuLy8gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgICAgICAkc2NvcGUuY2xvc2VMb2dpblJlZ2lzdGVyKCk7XHJcbi8vICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcclxuICAgIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XHJcbiAgICAgICAgLy8gaWYgbm9uZSBvZiB0aGUgYWJvdmUgc3RhdGVzIGFyZSBtYXRjaGVkLCB1c2UgdGhpcyBhcyB0aGUgZmFsbGJhY2tcclxuICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdob21lJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9cIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9ob21lL2hvbWUuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdjYXJ0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jYXJ0XCIsXHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL21vZHVsZXMvY2FydC9jYXJ0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDYXJ0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29udGFjdCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvY29udGFcIixcclxuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbW9kdWxlcy9jYXJ0L2NhcnQuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NhcnRDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdsb2dpbicsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvbG9naW5cIixcclxuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbW9kdWxlcy9yZWdpc3RlckxvZ2luL3JlZ2lzdGVyTG9naW4uaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlZ2lzdGVyTG9naW5Db250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCduZXdNZW51Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9uZXdNZW51XCIsXHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9uZXdNZW51L25ld01lbnUuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ05ld21lbnVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ25ld01lbnUuaG9tZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvaG9tZVwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L25ld01lbnUvaG9tZS5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTmV3bWVudUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG5cclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL21lbnVcIixcclxuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L21lbnUvbWVudS5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWVudUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG5cclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUucHJvZHVjdHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3Byb2R1Y3RzXCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHMuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2R1Y3RzQ29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LnByb2R1Y3QnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3Byb2R1Y3QvOmluZGV4XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZHVjdENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudS5jYXJ0X3BhZ2UnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2NhcnRfcGFnZVwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L2NhcnRfcGFnZS9jYXJ0X3BhZ2UuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NhcnRQYWdlQ29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LmNoZWNrb3V0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jaGVja291dFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGVja291dENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudS5jaGVja291dF9lZGl0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jaGVja291dF9lZGl0XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvY2hlY2tvdXRfZWRpdC9jaGVja291dF9lZGl0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGVja291dEVkaXRDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUud2lzaGxpc3QnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3dpc2hsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvd2lzaGxpc3Qvd2lzaGxpc3QuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1dpc2hsaXN0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICB9XHJcbl1cclxuOyJdfQ==
