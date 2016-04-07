(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//module node
//require("angular");

//module functions
require("./modules/registerLogin/registerLogin");
require("./modules/cart/cart");
//module layout
require("./layout/home/home");
require("./layout/newMenu/newMenu");
require("./layout/products/products");
require("./layout/cart_page/cart_page");
require("./layout/checkout/checkout");
require("./layout/checkout_edit/checkout_edit");
require("./layout/wishlist/wishlist");

module.export = angular.module('starter', ['ionic', 'slick', 'akoenig.deckgrid',
        //functions
        'registerLogin',
        'cart',

        //layout
        'home',
        'newMenu',
        'products',
        'CartPage',
        'checkout',
        'checkoutEdit',
        'wishlist'
    ])
    .config(require('./router'))
    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.platform.android.tabs.position("bottom");
    })
    .run(require('./app-main'));




},{"./app-main":2,"./layout/cart_page/cart_page":4,"./layout/checkout/checkout":6,"./layout/checkout_edit/checkout_edit":8,"./layout/home/home":10,"./layout/newMenu/newMenu":12,"./layout/products/products":15,"./layout/wishlist/wishlist":20,"./modules/cart/cart":23,"./modules/registerLogin/registerLogin":27,"./router":29}],2:[function(require,module,exports){
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
        function show(templeteUrl, controller, autoshow, parameters, options) {
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
                $state.go("products.list");
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
                    $state.go('products.list');
                }
            }, 2000);


            $scope.load = function() {
                // do your $() stuff here
            };
        }]);
},{}],12:[function(require,module,exports){
"use strict"
require("./newMenu_controller.js");
require("./newMenu_factory.js");

module.exports = angular.module("newMenu", ["newMenu.factory", "newMenu.controller"]);
},{"./newMenu_controller.js":13,"./newMenu_factory.js":14}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
"use strict"
require("./products_controller.js");
require("./products_list_controller.js");
require("./products_single_controller.js");
require("./products_factory.js");
require('.././wishlist/wishlist_service.js');
require('../.././app_service');

module.exports = angular.module("products", ['app.service', 'wishlist.service', "products.factory", "products.controller", "products.list.controller", "products.single.controller"])
    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.backButton.previousTitleText(false).text('');
    });
},{"../.././app_service":3,".././wishlist/wishlist_service.js":22,"./products_controller.js":16,"./products_factory.js":17,"./products_list_controller.js":18,"./products_single_controller.js":19}],16:[function(require,module,exports){
"use strict"

module.exports = angular.module("products.controller", [])
    .controller("ProductsController", ['$scope', '$ionicSideMenuDelegate', 'ProductService', '$state',
        function ($scope, $ionicSideMenuDelegate, ProductService, $state) {
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
                        angular.copy({
                            number: 1
                        }, $scope.page);
                        angular.copy(data, $scope.products);//must use angular.copy than use "=" so it can continue binding to first service param
                        if ($scope.firstTime)
                            $state.go("products.list");
                        $scope.firstTime = 1;
                    }
                );
            }

            $scope.getProducts("hot");
        }
    ]);

},{}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
"use strict"

module.exports = angular.module("products.list.controller", [])
    .controller("ProductsListController", ['$scope', '$ionicSideMenuDelegate','ProductService', 'ControlModalService','WishlistService',
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

},{}],19:[function(require,module,exports){
"use strict"

module.exports = angular.module("products.single.controller", [])
    .controller("ProductsSingleController", ['$scope', 'ProductService', '$stateParams','WishlistService',
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

},{}],20:[function(require,module,exports){
'use strict';

require('./wishlist_controller.js');
require('./wishlist_service.js');
require('../.././app_service');

module.exports = angular.module("wishlist", ['app.service', 'wishlist.service', 'wishlist.controller']);
},{"../.././app_service":3,"./wishlist_controller.js":21,"./wishlist_service.js":22}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
'use strict';

require('./cart_service.js');
require('./cart_controller.js');
require('../.././app_service');

module.exports = angular.module("cart", ['app.service', 'cart.services', 'cart.controller']);






},{"../.././app_service":3,"./cart_controller.js":24,"./cart_service.js":25}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
'use strict';

module.exports = angular.module('cart.services', [])
    .service('CartService', function ($q) {


    });
},{}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
'use strict';

require('./login_service.js');
require('./register_login_controller.js');
require('../.././app_service');

module.exports = angular.module("registerLogin", ['app.service', 'registerLogin.services', 'registerLogin.controller']);






},{"../.././app_service":3,"./login_service.js":26,"./register_login_controller.js":28}],28:[function(require,module,exports){
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
                $state.go('products.list');
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
                        $state.go('products.list');
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
},{}],29:[function(require,module,exports){
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
            .state('products', {
                url: "/products",
                abstract: true,
                templateUrl: "js/layout/products/products.html",
                controller: 'ProductsController'
            })
        ;
        $stateProvider
            .state('products.list', {
                url: "/list",
                templateUrl: "js/layout/products/list.html",
                controller: 'ProductsListController'
            })
        ;
        $stateProvider
            .state('products.single', {
                url: "/single/:index",
                templateUrl: "js/layout/products/single.html",
                controller: 'ProductsSingleController'
            })
        ;
        $stateProvider
            .state('products.cart_page', {
                url: "/cart_page",
                templateUrl: "js/layout/cart_page/cart_page.html",
                controller: 'CartPageController'
            })
        ;
        $stateProvider
            .state('products.checkout', {
                url: "/checkout",
                templateUrl: "js/layout/checkout/checkout.html",
                controller: 'CheckoutController'
            })
        ;
        $stateProvider
            .state('products.checkout_edit', {
                url: "/checkout_edit",
                templateUrl: "js/layout/checkout_edit/checkout_edit.html",
                controller: 'CheckoutEditController'
            })
        ;
        $stateProvider
            .state('products.wishlist', {
                url: "/wishlist",
                templateUrl: "js/layout/wishlist/wishlist.html",
                controller: 'WishlistController'
            })
        ;
    }
]
;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIi4vd3d3L2pzL2FwcC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvYXBwLW1haW4uanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2FwcF9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2FydF9wYWdlL2NhcnRfcGFnZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NhcnRfcGFnZS9jYXJ0X3BhZ2VfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXRfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0X2VkaXQvY2hlY2tvdXRfZWRpdC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0X2VkaXQvY2hlY2tvdXRfZWRpdF9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvaG9tZS9ob21lLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvaG9tZS9ob21lX2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9uZXdNZW51L25ld01lbnUuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9uZXdNZW51L25ld01lbnVfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L25ld01lbnUvbmV3TWVudV9mYWN0b3J5LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHMuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0c19jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHNfZmFjdG9yeS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3Byb2R1Y3RzL3Byb2R1Y3RzX2xpc3RfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3Byb2R1Y3RzL3Byb2R1Y3RzX3NpbmdsZV9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvd2lzaGxpc3Qvd2lzaGxpc3QuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC93aXNobGlzdC93aXNobGlzdF9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvd2lzaGxpc3Qvd2lzaGxpc3Rfc2VydmljZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9jYXJ0L2NhcnQuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL21vZHVsZXMvY2FydC9jYXJ0X2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL21vZHVsZXMvY2FydC9jYXJ0X3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9sb2dpbl9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJMb2dpbi5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9yZWdpc3RlckxvZ2luL3JlZ2lzdGVyX2xvZ2luX2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL3JvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vbW9kdWxlIG5vZGVcbi8vcmVxdWlyZShcImFuZ3VsYXJcIik7XG5cbi8vbW9kdWxlIGZ1bmN0aW9uc1xucmVxdWlyZShcIi4vbW9kdWxlcy9yZWdpc3RlckxvZ2luL3JlZ2lzdGVyTG9naW5cIik7XG5yZXF1aXJlKFwiLi9tb2R1bGVzL2NhcnQvY2FydFwiKTtcbi8vbW9kdWxlIGxheW91dFxucmVxdWlyZShcIi4vbGF5b3V0L2hvbWUvaG9tZVwiKTtcbnJlcXVpcmUoXCIuL2xheW91dC9uZXdNZW51L25ld01lbnVcIik7XG5yZXF1aXJlKFwiLi9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHNcIik7XG5yZXF1aXJlKFwiLi9sYXlvdXQvY2FydF9wYWdlL2NhcnRfcGFnZVwiKTtcbnJlcXVpcmUoXCIuL2xheW91dC9jaGVja291dC9jaGVja291dFwiKTtcbnJlcXVpcmUoXCIuL2xheW91dC9jaGVja291dF9lZGl0L2NoZWNrb3V0X2VkaXRcIik7XG5yZXF1aXJlKFwiLi9sYXlvdXQvd2lzaGxpc3Qvd2lzaGxpc3RcIik7XG5cbm1vZHVsZS5leHBvcnQgPSBhbmd1bGFyLm1vZHVsZSgnc3RhcnRlcicsIFsnaW9uaWMnLCAnc2xpY2snLCAnYWtvZW5pZy5kZWNrZ3JpZCcsXG4gICAgICAgIC8vZnVuY3Rpb25zXG4gICAgICAgICdyZWdpc3RlckxvZ2luJyxcbiAgICAgICAgJ2NhcnQnLFxuXG4gICAgICAgIC8vbGF5b3V0XG4gICAgICAgICdob21lJyxcbiAgICAgICAgJ25ld01lbnUnLFxuICAgICAgICAncHJvZHVjdHMnLFxuICAgICAgICAnQ2FydFBhZ2UnLFxuICAgICAgICAnY2hlY2tvdXQnLFxuICAgICAgICAnY2hlY2tvdXRFZGl0JyxcbiAgICAgICAgJ3dpc2hsaXN0J1xuICAgIF0pXG4gICAgLmNvbmZpZyhyZXF1aXJlKCcuL3JvdXRlcicpKVxuICAgIC5jb25maWcoZnVuY3Rpb24gKCRpb25pY0NvbmZpZ1Byb3ZpZGVyKSB7XG4gICAgICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLnBsYXRmb3JtLmFuZHJvaWQudGFicy5wb3NpdGlvbihcImJvdHRvbVwiKTtcbiAgICB9KVxuICAgIC5ydW4ocmVxdWlyZSgnLi9hcHAtbWFpbicpKTtcblxuXG5cbiIsIid1c2Ugc3RyaWN0JztcclxuZnVuY3Rpb24gQXBwTWFpbigkaW9uaWNQbGF0Zm9ybSl7XHJcbiAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXHJcbiAgICAgICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxyXG4gICAgICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XHJcbiAgICAgICAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XHJcbiAgICAgICAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5kaXNhYmxlU2Nyb2xsKHRydWUpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcclxuICAgICAgICAgICAgLy8gb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxyXG4gICAgICAgICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gWyckaW9uaWNQbGF0Zm9ybScsIEFwcE1haW5dOyIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VcIiwgW10pXHJcbiAgICAuZmFjdG9yeSgnJGxvY2Fsc3RvcmFnZScsIFsnJHdpbmRvdycsJyRpb25pY0hpc3RvcnknLCBmdW5jdGlvbiAoJHdpbmRvdywgJGlvbmljSGlzdG9yeSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoa2V5LCBkZWZhdWx0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8IGRlZmF1bHRWYWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0T2JqZWN0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0T2JqZWN0OiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8ICd7fScpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXROdWxsOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRPYmplY3Qoa2V5LHt9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0TnVsbEFsbDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFyQ2FjaGUoKTtcclxuICAgICAgICAgICAgICAgICRpb25pY0hpc3RvcnkuY2xlYXJIaXN0b3J5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XSlcclxuICAgIC5zZXJ2aWNlKCdDb250cm9sTW9kYWxTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkaW9uaWNNb2RhbCwgJHJvb3RTY29wZSwgJHRpbWVvdXQsICRjb250cm9sbGVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2hvdzogc2hvd1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBzaG93KHRlbXBsZXRlVXJsLCBjb250cm9sbGVyLCBhdXRvc2hvdywgcGFyYW1ldGVycywgb3B0aW9ucykge1xyXG4gICAgICAgICAgICAvLyBHcmFiIHRoZSBpbmplY3RvciBhbmQgY3JlYXRlIGEgbmV3IHNjb3BlXHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCksXHJcbiAgICAgICAgICAgICAgICBjdHJsSW5zdGFuY2UsXHJcbiAgICAgICAgICAgICAgICBtb2RhbFNjb3BlID0gJHJvb3RTY29wZS4kbmV3KCksXHJcbiAgICAgICAgICAgICAgICB0aGlzU2NvcGVJZCA9IG1vZGFsU2NvcGUuJGlkLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiAnc2xpZGUtaW4tdXAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvY3VzRmlyc3RJbnB1dDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2Ryb3BDbGlja1RvQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgaGFyZHdhcmVCYWNrQnV0dG9uQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxDYWxsYmFjazogbnVsbFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgJGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKHRlbXBsZXRlVXJsLCB7XHJcbiAgICAgICAgICAgICAgICBzY29wZTogbW9kYWxTY29wZSxcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogb3B0aW9ucy5hbmltYXRpb24sXHJcbiAgICAgICAgICAgICAgICBmb2N1c0ZpcnN0SW5wdXQ6IG9wdGlvbnMuZm9jdXNGaXJzdElucHV0LFxyXG4gICAgICAgICAgICAgICAgYmFja2Ryb3BDbGlja1RvQ2xvc2U6IG9wdGlvbnMuYmFja2Ryb3BDbGlja1RvQ2xvc2UsXHJcbiAgICAgICAgICAgICAgICBoYXJkd2FyZUJhY2tCdXR0b25DbG9zZTogb3B0aW9ucy5oYXJkd2FyZUJhY2tCdXR0b25DbG9zZVxyXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWwgPSBtb2RhbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWwuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC50ZXN0ID0gXCJhYVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLm1vZGFsLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLiRvbignbW9kYWwuaGlkZGVuJywgZnVuY3Rpb24gKHRoaXNNb2RhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc01vZGFsLmN1cnJlbnRTY29wZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1vZGFsU2NvcGVJZCA9IHRoaXNNb2RhbC5jdXJyZW50U2NvcGUuJGlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNTY29wZUlkID09PSBtb2RhbFNjb3BlSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jbGVhbnVwKHRoaXNNb2RhbC5jdXJyZW50U2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEludm9rZSB0aGUgY29udHJvbGxlclxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsb2NhbHMgPSB7ICckc2NvcGUnOiBtb2RhbFNjb3BlLCAncGFyYW1ldGVycyc6IHBhcmFtZXRlcnMgfTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY3RybEV2YWwgPSBfZXZhbENvbnRyb2xsZXIoY29udHJvbGxlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybEluc3RhbmNlID0gJGNvbnRyb2xsZXIoY29udHJvbGxlciwgbG9jYWxzKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3RybEV2YWwuaXNDb250cm9sbGVyQXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RybEluc3RhbmNlLm9wZW5Nb2RhbCA9IG1vZGFsU2NvcGUub3Blbk1vZGFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHJsSW5zdGFuY2UuY2xvc2VNb2RhbCA9IG1vZGFsU2NvcGUuY2xvc2VNb2RhbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdXRvc2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLm1vZGFsLnNob3coKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUuJGJyb2FkY2FzdCgnbW9kYWwuYWZ0ZXJTaG93JywgbW9kYWxTY29wZS5tb2RhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24ob3B0aW9ucy5tb2RhbENhbGxiYWNrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm1vZGFsQ2FsbGJhY2sobW9kYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX2NsZWFudXAoc2NvcGUpIHtcclxuICAgICAgICAgICAgc2NvcGUuJGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgaWYgKHNjb3BlLm1vZGFsKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5tb2RhbC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX2V2YWxDb250cm9sbGVyKGN0cmxOYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7XHJcbiAgICAgICAgICAgICAgICBpc0NvbnRyb2xsZXJBczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyTmFtZTogJycsXHJcbiAgICAgICAgICAgICAgICBwcm9wTmFtZTogJydcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdmFyIGZyYWdtZW50cyA9IChjdHJsTmFtZSB8fCAnJykudHJpbSgpLnNwbGl0KC9cXHMrLyk7XHJcbiAgICAgICAgICAgIHJlc3VsdC5pc0NvbnRyb2xsZXJBcyA9IGZyYWdtZW50cy5sZW5ndGggPT09IDMgJiYgKGZyYWdtZW50c1sxXSB8fCAnJykudG9Mb3dlckNhc2UoKSA9PT0gJ2FzJztcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5pc0NvbnRyb2xsZXJBcykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmNvbnRyb2xsZXJOYW1lID0gZnJhZ21lbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnByb3BOYW1lID0gZnJhZ21lbnRzWzJdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmNvbnRyb2xsZXJOYW1lID0gY3RybE5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9jYXJ0X3BhZ2VfY29udHJvbGxlci5qcycpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiQ2FydFBhZ2VcIiwgWydhcHAuc2VydmljZScsICdDYXJ0UGFnZS5jb250cm9sbGVyJ10pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ0NhcnRQYWdlLmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiQ2FydFBhZ2VDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRsb2NhbHN0b3JhZ2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhbHN0b3JhZ2UpIHtcclxuLy8gICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE51bGwoXCJjYXJ0XCIpO1xyXG4gICAgICAgICAgICAkc2NvcGUuY2FydGxpc3QgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5jYXJ0bGlzdCk7XHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vY2hlY2tvdXRfY29udHJvbGxlci5qcycpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiY2hlY2tvdXRcIiwgWydhcHAuc2VydmljZScsICdjaGVja291dC5jb250cm9sbGVyJ10pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NoZWNrb3V0LmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiQ2hlY2tvdXRDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRsb2NhbHN0b3JhZ2UnLCAnQ29udHJvbE1vZGFsU2VydmljZScsICckc3RhdGUnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhbHN0b3JhZ2UsIENvbnRyb2xNb2RhbFNlcnZpY2UsICRzdGF0ZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUuY2FydGxpc3QgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIik7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY2hlY2tvdXQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsKFwiY2FydFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcInByb2R1Y3RzLmxpc3RcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9jaGVja291dF9lZGl0X2NvbnRyb2xsZXIuanMnKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcImNoZWNrb3V0RWRpdFwiLCBbJ2FwcC5zZXJ2aWNlJywgJ2NoZWNrb3V0RWRpdC5jb250cm9sbGVyJ10pO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NoZWNrb3V0RWRpdC5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIkNoZWNrb3V0RWRpdENvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnJGxvY2Fsc3RvcmFnZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgICRsb2NhbHN0b3JhZ2UpIHtcclxuLy8gICAgICAgICAgICAkc2NvcGUucHJvZHVjdEF0dHIgPSB7XHJcbi8vICAgICAgICAgICAgICAgIGNvbG9yOltcInllbGxvd1wiLCBcInJlZFwiLCBcIm9yYW5nZVwiLCBcImJsdWVcIl0sXHJcbi8vICAgICAgICAgICAgICAgIHNpemU6W1wiU1wiLCBcIk1cIiwgXCJMXCIsIFwiWExcIl1cclxuLy8gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzY29wZS5jYXJ0ID0gW107XHJcblxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wdFByb2QgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hZGRfdG9fY2FydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2FydCA9ICRzY29wZS5jYXJ0LmNvbmNhdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHBhcmFtZXRlcnMuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgdGh1bWI6IHBhcmFtZXRlcnMuaW1nLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAkc2NvcGUub3B0UHJvZC5jb2xvcixcclxuICAgICAgICAgICAgICAgICAgICBzaXplOiAkc2NvcGUub3B0UHJvZC5zaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAkc2NvcGUub3B0UHJvZC5xdWFudGl0eVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIikpO1xyXG5cclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0T2JqZWN0KFwiY2FydFwiLCAkc2NvcGUuY2FydCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxucmVxdWlyZSgnLi9ob21lX2NvbnRyb2xsZXInKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnaG9tZScsIFsnYXBwLnNlcnZpY2UnLCBcImhvbWUuY29udHJvbGxlclwiXSk7XHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiaG9tZS5jb250cm9sbGVyXCIsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJIb21lQ29udHJvbGxlclwiLCBbJyRzY29wZScsICdMb2dpblNlcnZpY2UnLCckbG9jYWxzdG9yYWdlJywnJHN0YXRlJywnQ29udHJvbE1vZGFsU2VydmljZScsJyR0aW1lb3V0JyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBMb2dpblNlcnZpY2UsICRsb2NhbHN0b3JhZ2UsICRzdGF0ZSwgQ29udHJvbE1vZGFsU2VydmljZSwgJHRpbWVvdXQpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjdXJyZW50X3VzZXJcIik7XHJcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBpZighY3VycmVudFVzZXIudXNlcm5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIENvbnRyb2xNb2RhbFNlcnZpY2Uuc2hvdygnanMvbW9kdWxlcy9yZWdpc3RlckxvZ2luL3JlZ2lzdGVyTG9naW4uaHRtbCcsICdSZWdpc3RlckxvZ2luQ29udHJvbGxlcicsIDEpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3VycmVudFVzZXIudXNlcm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygncHJvZHVjdHMubGlzdCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCAyMDAwKTtcclxuXHJcblxyXG4gICAgICAgICAgICAkc2NvcGUubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gZG8geW91ciAkKCkgc3R1ZmYgaGVyZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1dKTsiLCJcInVzZSBzdHJpY3RcIlxyXG5yZXF1aXJlKFwiLi9uZXdNZW51X2NvbnRyb2xsZXIuanNcIik7XHJcbnJlcXVpcmUoXCIuL25ld01lbnVfZmFjdG9yeS5qc1wiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJuZXdNZW51XCIsIFtcIm5ld01lbnUuZmFjdG9yeVwiLCBcIm5ld01lbnUuY29udHJvbGxlclwiXSk7IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJuZXdNZW51LmNvbnRyb2xsZXJcIiwgW10pXHJcbiAgICAuY29udHJvbGxlcihcIk5ld21lbnVDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRpb25pY1NpZGVNZW51RGVsZWdhdGUnLCAnTW92aWVzJyxcclxuICAgICAgICBmdW5jdGlvbigkc2NvcGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsIE1vdmllcykge1xyXG4gICAgICAgICAgICAkc2NvcGUuc29ydGluZyA9IFt7c2NvcmU6IDksIG5hbWUgOiAnU2NvcmUgbW9yZSB0aGVuIDknfSxcclxuICAgICAgICAgICAgICAgIHtzY29yZTogOCwgbmFtZSA6ICdTY29yZSBtb3JlIHRoZW4gOCd9LFxyXG4gICAgICAgICAgICAgICAge3Njb3JlOiA3LCBuYW1lIDogJ1Njb3JlIG1vcmUgdGhlbiA3J30sXHJcbiAgICAgICAgICAgICAgICB7c2NvcmU6IDYsIG5hbWUgOiAnU2NvcmUgbW9yZSB0aGVuIDYnfSxcclxuICAgICAgICAgICAgICAgIHtzY29yZTogNSwgbmFtZSA6ICdTY29yZSBtb3JlIHRoZW4gNSd9LFxyXG4gICAgICAgICAgICAgICAge3Njb3JlOiA0LCBuYW1lIDogJ1Njb3JlIG1vcmUgdGhlbiA0J30sXHJcbiAgICAgICAgICAgICAgICB7c2NvcmU6IDMsIG5hbWUgOiAnU2NvcmUgbW9yZSB0aGVuIDMnfSxcclxuICAgICAgICAgICAgICAgIHtzY29yZTogMiwgbmFtZSA6ICdTY29yZSBtb3JlIHRoZW4gMid9LFxyXG4gICAgICAgICAgICAgICAge3Njb3JlOiAxLCBuYW1lIDogJ1Njb3JlIG1vcmUgdGhlbiAxJ30sXHJcbiAgICAgICAgICAgICAgICB7c2NvcmU6IDAsIG5hbWUgOiAnU2hvdyBtZSBldmVyeSBtb3ZpZSd9XTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZCA9IHtcclxuICAgICAgICAgICAgICAgIHNjb3JlIDogMCxcclxuICAgICAgICAgICAgICAgIG1vdmllTmFtZSA6ICdCYXRtYW4nXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5vcGVuTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUudG9nZ2xlTGVmdCgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmdyZWF0ZXJUaGFuID0gZnVuY3Rpb24oZmllbGROYW1lKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVtmaWVsZE5hbWVdID4gJHNjb3BlLnNlbGVjdGVkLnNjb3JlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2VhcmNoTW92aWVEQiA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIE1vdmllcy5saXN0KCRzY29wZS5zZWxlY3RlZC5tb3ZpZU5hbWUsIGZ1bmN0aW9uKG1vdmllcykge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tb3ZpZXMgPSBtb3ZpZXM7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2VhcmNoTW92aWVEQigpO1xyXG4gICAgICAgIH1cclxuICAgIF0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcIm5ld01lbnUuZmFjdG9yeVwiLCBbXSlcclxuICAgIC5mYWN0b3J5KCdNb3ZpZXMnLCBmdW5jdGlvbiAoJGh0dHApIHtcclxuICAgICAgICB2YXIgY2FjaGVkRGF0YTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGF0YShtb3ZpZW5hbWUsIGNhbGxiYWNrKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy8nLFxyXG4gICAgICAgICAgICAgICAgbW9kZSA9ICdzZWFyY2gvbW92aWU/cXVlcnk9JyxcclxuICAgICAgICAgICAgICAgIG5hbWUgPSAnJnF1ZXJ5PScgKyBlbmNvZGVVUkkobW92aWVuYW1lKSxcclxuICAgICAgICAgICAgICAgIGtleSA9ICcmYXBpX2tleT00NzBmZDJlYzg4NTNlMjVkMmY4ZDg2ZjY4NWQyMjcwZSc7XHJcblxyXG4gICAgICAgICAgICAkaHR0cC5nZXQodXJsICsgbW9kZSArIGtleSArIG5hbWUpLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjYWNoZWREYXRhID0gZGF0YS5yZXN1bHRzO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YS5yZXN1bHRzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBsaXN0OiBnZXREYXRhLFxyXG4gICAgICAgICAgICBmaW5kOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vdmllID0gY2FjaGVkRGF0YS5maWx0ZXIoZnVuY3Rpb24gKGVudHJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVudHJ5LmlkID09IG5hbWU7XHJcbiAgICAgICAgICAgICAgICB9KVswXTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG1vdmllKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfSk7IiwiXCJ1c2Ugc3RyaWN0XCJcclxucmVxdWlyZShcIi4vcHJvZHVjdHNfY29udHJvbGxlci5qc1wiKTtcclxucmVxdWlyZShcIi4vcHJvZHVjdHNfbGlzdF9jb250cm9sbGVyLmpzXCIpO1xyXG5yZXF1aXJlKFwiLi9wcm9kdWN0c19zaW5nbGVfY29udHJvbGxlci5qc1wiKTtcclxucmVxdWlyZShcIi4vcHJvZHVjdHNfZmFjdG9yeS5qc1wiKTtcclxucmVxdWlyZSgnLi4vLi93aXNobGlzdC93aXNobGlzdF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwcm9kdWN0c1wiLCBbJ2FwcC5zZXJ2aWNlJywgJ3dpc2hsaXN0LnNlcnZpY2UnLCBcInByb2R1Y3RzLmZhY3RvcnlcIiwgXCJwcm9kdWN0cy5jb250cm9sbGVyXCIsIFwicHJvZHVjdHMubGlzdC5jb250cm9sbGVyXCIsIFwicHJvZHVjdHMuc2luZ2xlLmNvbnRyb2xsZXJcIl0pXHJcbiAgICAuY29uZmlnKGZ1bmN0aW9uICgkaW9uaWNDb25maWdQcm92aWRlcikge1xyXG4gICAgICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLmJhY2tCdXR0b24ucHJldmlvdXNUaXRsZVRleHQoZmFsc2UpLnRleHQoJycpO1xyXG4gICAgfSk7IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwcm9kdWN0cy5jb250cm9sbGVyXCIsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJQcm9kdWN0c0NvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZScsICdQcm9kdWN0U2VydmljZScsICckc3RhdGUnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsIFByb2R1Y3RTZXJ2aWNlLCAkc3RhdGUpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmZpbHRlclR5cGUgPSBbXHJcbiAgICAgICAgICAgICAgICB7dHlwZTogXCJob3RcIiwgbmFtZTogJ1NhbiBwaGFtIGhvdCd9LFxyXG4gICAgICAgICAgICAgICAge3R5cGU6IFwiYmVzdHNlbGxlclwiLCBuYW1lOiAnU2FuIHBoYW0gYmFuIGNoYXknfSxcclxuICAgICAgICAgICAgICAgIHt0eXBlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbHQ6IDUwXHJcbiAgICAgICAgICAgICAgICB9LCBuYW1lOiAnRHVvaSA1MC4wMDAnfSxcclxuICAgICAgICAgICAgICAgIHt0eXBlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZDogWzUwLCAxMDBdXHJcbiAgICAgICAgICAgICAgICB9LCBuYW1lOiAnNTAuMDAwIGRlbiAxMDAuMDAwJ30sXHJcbiAgICAgICAgICAgICAgICB7dHlwZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmQ6IFsxMDAsIDIwMF1cclxuICAgICAgICAgICAgICAgIH0sIG5hbWU6ICcxMDAuMDAwIGRlbiAyMDAuMDAwJ30sXHJcbiAgICAgICAgICAgICAgICB7dHlwZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGd0OiAyMDBcclxuICAgICAgICAgICAgICAgIH0sIG5hbWU6ICdUcmVuIDIwMC4wMDAnfVxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wZW5NZW51ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS50b2dnbGVMZWZ0KCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUucHJvZHVjdHMgPSBQcm9kdWN0U2VydmljZS5wcm9kdWN0Q3VycmVudDtcclxuICAgICAgICAgICAgJHNjb3BlLnBhZ2UgPSBQcm9kdWN0U2VydmljZS5wYWdlO1xyXG4gICAgICAgICAgICAkc2NvcGUuZmlyc3RUaW1lID0gMDtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5nZXRQcm9kdWN0cyA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlID0gSlNPTi5zdHJpbmdpZnkodHlwZSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudGNoZWNrQ3RybCA9IHR5cGU7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5maWx0ZXJQcm9kdWN0KHR5cGUpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5jb3B5KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bWJlcjogMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAkc2NvcGUucGFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuY29weShkYXRhLCAkc2NvcGUucHJvZHVjdHMpOy8vbXVzdCB1c2UgYW5ndWxhci5jb3B5IHRoYW4gdXNlIFwiPVwiIHNvIGl0IGNhbiBjb250aW51ZSBiaW5kaW5nIHRvIGZpcnN0IHNlcnZpY2UgcGFyYW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5maXJzdFRpbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJwcm9kdWN0cy5saXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmlyc3RUaW1lID0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZ2V0UHJvZHVjdHMoXCJob3RcIik7XHJcbiAgICAgICAgfVxyXG4gICAgXSk7XHJcbiIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwicHJvZHVjdHMuZmFjdG9yeVwiLCBbXSlcclxuICAgIC5mYWN0b3J5KCdQcm9kdWN0U2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGh0dHAsICRsb2NhbHN0b3JhZ2UpIHtcclxuICAgICAgICB2YXIgcHJvZHVjdHMgPSBbXTtcclxuICAgICAgICB2YXIgcGFnZSA9IHtcclxuICAgICAgICAgICAgbnVtYmVyIDogMVxyXG4gICAgICAgIH07Ly9zaG91bGQgdXNlIG9iamVjdCBvciBhcnJheSwgZG9uJ3QgdXNlIGEgc2luZ2xlIHZhcmlhYmxlXHJcblxyXG4gICAgICAgIHJldHVybntcclxuICAgICAgICAgICAgZmlsdGVyUHJvZHVjdDogZnVuY3Rpb24gKGZpbHRlclR5cGUsIGFqYXgsIHBhZ2VfbmV4dCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbGlua19hamF4ID0gXCJodHRwOi8vbGlxdW9yZGVsaXZlcnkuY29tLnNnL3dwLWFkbWluL2FkbWluLWFqYXgucGhwXCI7XHJcbiAgICAgICAgICAgICAgICAkaHR0cC5nZXQobGlua19hamF4ICsgXCI/YWN0aW9uPWxhdGVzdF9wcm9kdWN0c19hcHAmZmlsdGVyPVwiICsgZmlsdGVyVHlwZSArIFwiJnBhZ2U9XCIgKyBwYWdlX25leHQpLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFqYXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHMgPSBwcm9kdWN0cy5jb25jYXQocmVzcC5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3RzID0gcmVzcC5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHJlc3AuZGF0YSwgJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJ3aXNobGlzdFwiKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcC5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBGb3IgSlNPTiByZXNwb25zZXMsIHJlc3AuZGF0YSBjb250YWlucyB0aGUgcmVzdWx0XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRVJSJywgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0VSUiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBlcnIuc3RhdHVzIHdpbGwgY29udGFpbiB0aGUgc3RhdHVzIGNvZGVcclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICB2aWV3RGV0YWlsOiBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9kdWN0c1tpbmRleF07XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBwcm9kdWN0Q3VycmVudCA6IHByb2R1Y3RzLFxyXG5cclxuICAgICAgICAgICAgcGFnZSA6IHBhZ2VcclxuICAgICAgICB9XHJcbiAgICB9KTsiLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcInByb2R1Y3RzLmxpc3QuY29udHJvbGxlclwiLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiUHJvZHVjdHNMaXN0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckaW9uaWNTaWRlTWVudURlbGVnYXRlJywnUHJvZHVjdFNlcnZpY2UnLCAnQ29udHJvbE1vZGFsU2VydmljZScsJ1dpc2hsaXN0U2VydmljZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgUHJvZHVjdFNlcnZpY2UsIENvbnRyb2xNb2RhbFNlcnZpY2UsIFdpc2hsaXN0U2VydmljZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUucHJvZHVjdHMgPSBQcm9kdWN0U2VydmljZS5wcm9kdWN0Q3VycmVudDtcclxuICAgICAgICAgICAgJHNjb3BlLnBhZ2UgPSBQcm9kdWN0U2VydmljZS5wYWdlO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wZW5NZW51ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS50b2dnbGVMZWZ0KCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUubG9hZE1vcmVEYXRhID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSAkc2NvcGUuY3VycmVudGNoZWNrQ3RybDtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcHBhZ2UgPSAkc2NvcGUucGFnZS5udW1iZXI7XHJcbiAgICAgICAgICAgICAgICB0ZW1wcGFnZSsrO1xyXG5cclxuICAgICAgICAgICAgICAgIFByb2R1Y3RTZXJ2aWNlLmZpbHRlclByb2R1Y3QodHlwZSwgMSwgdGVtcHBhZ2UpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXAgPSAkc2NvcGUucHJvZHVjdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXAgPSB0ZW1wLmNvbmNhdChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5jb3B5KHRlbXAsICRzY29wZS5wcm9kdWN0cyk7Ly9tdXN0IHVzZSBhbmd1bGFyLmNvcHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRicm9hZGNhc3QoJ3Njcm9sbC5pbmZpbml0ZVNjcm9sbENvbXBsZXRlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmNvcHkoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyIDogdGVtcHBhZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgJHNjb3BlLnBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY2hvb3NlUHJvZHVjdE9wdGlvbiA9IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgQ29udHJvbE1vZGFsU2VydmljZS5zaG93KCdqcy9tb2R1bGVzL2NhcnQvY2FydC5odG1sJywgJ0NhcnRDb250cm9sbGVyJywgMSwgaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hZGRUb1dpc2hsaXN0ID0gZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgICBXaXNobGlzdFNlcnZpY2UuYWRkV2lzaGxpc3QoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICBdKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwcm9kdWN0cy5zaW5nbGUuY29udHJvbGxlclwiLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiUHJvZHVjdHNTaW5nbGVDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJ1Byb2R1Y3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsJ1dpc2hsaXN0U2VydmljZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgUHJvZHVjdFNlcnZpY2UsICRzdGF0ZVBhcmFtcywgV2lzaGxpc3RTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5wcm9kdWN0ID0gUHJvZHVjdFNlcnZpY2Uudmlld0RldGFpbCgkc3RhdGVQYXJhbXMuaW5kZXgpO1xyXG5cclxuLy8gICAgICAgICAgICAkc2NvcGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG4vLyAgICAgICAgICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdCgnZGF0YWxvYWRlZCcpO1xyXG4vLyAgICAgICAgICAgIH07XHJcbi8vXHJcbi8vICAgICAgICAgICAgJHNjb3BlLmluaXQoKTtcclxuICAgICAgICAgICAgJHNjb3BlLmFkZFRvV2lzaGxpc3QgPSBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgIFdpc2hsaXN0U2VydmljZS5hZGRXaXNobGlzdChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1dKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi93aXNobGlzdF9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4vd2lzaGxpc3Rfc2VydmljZS5qcycpO1xyXG5yZXF1aXJlKCcuLi8uLi8uL2FwcF9zZXJ2aWNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwid2lzaGxpc3RcIiwgWydhcHAuc2VydmljZScsICd3aXNobGlzdC5zZXJ2aWNlJywgJ3dpc2hsaXN0LmNvbnRyb2xsZXInXSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnd2lzaGxpc3QuY29udHJvbGxlcicsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJXaXNobGlzdENvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnJGxvY2Fsc3RvcmFnZScsJ1dpc2hsaXN0U2VydmljZScsJyRzdGF0ZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2Fsc3RvcmFnZSwgV2lzaGxpc3RTZXJ2aWNlLCAkc3RhdGUpIHtcclxuICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXROdWxsKCk7XHJcbiAgICAgICAgICAgICRzY29wZS53aXNobGlzdCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIik7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkVG9XaXNobGlzdCA9IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgV2lzaGxpc3RTZXJ2aWNlLmFkZFdpc2hsaXN0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnd2lzaGxpc3Quc2VydmljZScsIFtdKVxyXG4gICAgLnNlcnZpY2UoJ1dpc2hsaXN0U2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGxvY2Fsc3RvcmFnZSkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGV4aXRzSW5BcnJheShvYmosIGFycmF5KXtcclxuICAgICAgICAgICAgdmFyIHRlbXAgPSAwO1xyXG4gICAgICAgICAgICAkLmVhY2goYXJyYXksIGZ1bmN0aW9uKGkpe1xyXG4gICAgICAgICAgICAgICAgaWYoYXJyYXlbaV0uaWQgPT09IG9iai5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXAgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZW1wO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlT2JqKG9iaiwgYXJyYXkpe1xyXG4gICAgICAgICAgICB2YXIgdGVtcCA9IGV4aXRzSW5BcnJheShvYmosIGFycmF5KTtcclxuICAgICAgICAgICAgaWYodGVtcCl7XHJcbiAgICAgICAgICAgICAgICBhcnJheS5zcGxpY2UodGVtcCwxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGVtcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYWRkV2lzaGxpc3QgOiBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgIGl0ZW0ubGlrZSA9ICFpdGVtLmxpa2U7XHJcbiAgICAgICAgICAgICAgICB2YXIgd2lzaGxpc3RfdGVtcCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwid2lzaGxpc3RcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IHJlbW92ZU9iaihpdGVtLCB3aXNobGlzdF90ZW1wKTtcclxuICAgICAgICAgICAgICAgIHZhciB3aXNobGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgaWYoIXRlbXApe1xyXG4gICAgICAgICAgICAgICAgICAgIHdpc2hsaXN0ID0gd2lzaGxpc3QuY29uY2F0KGl0ZW0sIHdpc2hsaXN0X3RlbXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICB3aXNobGlzdCA9IHdpc2hsaXN0X3RlbXA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE9iamVjdChcIndpc2hsaXN0XCIsIHdpc2hsaXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vY2FydF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4vY2FydF9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJjYXJ0XCIsIFsnYXBwLnNlcnZpY2UnLCAnY2FydC5zZXJ2aWNlcycsICdjYXJ0LmNvbnRyb2xsZXInXSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnY2FydC5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIkNhcnRDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJ3BhcmFtZXRlcnMnLCAnJGxvY2Fsc3RvcmFnZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgcGFyYW1ldGVycywgJGxvY2Fsc3RvcmFnZSkge1xyXG4vLyAgICAgICAgICAgICRzY29wZS5wcm9kdWN0QXR0ciA9IHtcclxuLy8gICAgICAgICAgICAgICAgY29sb3I6W1wieWVsbG93XCIsIFwicmVkXCIsIFwib3JhbmdlXCIsIFwiYmx1ZVwiXSxcclxuLy8gICAgICAgICAgICAgICAgc2l6ZTpbXCJTXCIsIFwiTVwiLCBcIkxcIiwgXCJYTFwiXVxyXG4vLyAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jYXJ0ID0gW107XHJcblxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wdFByb2QgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hZGRfdG9fY2FydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2FydCA9ICRzY29wZS5jYXJ0LmNvbmNhdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBwYXJhbWV0ZXJzLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogcGFyYW1ldGVycy50aXRsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGh1bWI6IHBhcmFtZXRlcnMuaW1nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJHNjb3BlLm9wdFByb2QuY29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6ICRzY29wZS5vcHRQcm9kLnNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAkc2NvcGUub3B0UHJvZC5xdWFudGl0eVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLnNldE9iamVjdChcImNhcnRcIiwgJHNjb3BlLmNhcnQpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlTW9kYWwoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnY2FydC5zZXJ2aWNlcycsIFtdKVxyXG4gICAgLnNlcnZpY2UoJ0NhcnRTZXJ2aWNlJywgZnVuY3Rpb24gKCRxKSB7XHJcblxyXG5cclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ3JlZ2lzdGVyTG9naW4uc2VydmljZXMnLCBbXSlcclxuICAgIC5zZXJ2aWNlKCdMb2dpblNlcnZpY2UnLCBmdW5jdGlvbiAoJHEpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBsb2dpblVzZXI6IGxvZ2luVXNlclxyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBsb2dpblVzZXIobmFtZSwgcHcpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5hbWUgPT0gJzEyMzQ1JyAmJiBwdyA9PSAnMTIzNDUnKSB7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCdXZWxjb21lICcgKyBuYW1lICsgJyEnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgnV3JvbmcgY3JlZGVudGlhbHMuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvbWlzZS5zdWNjZXNzID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oZm4pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvbWlzZS5lcnJvciA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKG51bGwsIGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH1cclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vbG9naW5fc2VydmljZS5qcycpO1xyXG5yZXF1aXJlKCcuL3JlZ2lzdGVyX2xvZ2luX2NvbnRyb2xsZXIuanMnKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcInJlZ2lzdGVyTG9naW5cIiwgWydhcHAuc2VydmljZScsICdyZWdpc3RlckxvZ2luLnNlcnZpY2VzJywgJ3JlZ2lzdGVyTG9naW4uY29udHJvbGxlciddKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdyZWdpc3RlckxvZ2luLmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiUmVnaXN0ZXJMb2dpbkNvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnTG9naW5TZXJ2aWNlJywgJyRzdGF0ZScsICckaW9uaWNQb3B1cCcsICckbG9jYWxzdG9yYWdlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBMb2dpblNlcnZpY2UsICRzdGF0ZSwgJGlvbmljUG9wdXAsICRsb2NhbHN0b3JhZ2UpIHtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5yZXN1bHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhMb2dpblNlcnZpY2UucmVjKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmxvZ2luRGF0YSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wZW5Mb2dpbk1vZGFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm9wZW5Nb2RhbCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY2xvc2VMb2dpbk1vZGFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygncHJvZHVjdHMubGlzdCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2xvZ2luIHNlY3Rpb25cclxuICAgICAgICAgICAgJHNjb3BlLmRvUmVnaXN0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRG9pbmcgcmVnaXN0ZXInLCAkc2NvcGUubG9naW5EYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTaW11bGF0ZSBhIGxvZ2luIGRlbGF5LiBSZW1vdmUgdGhpcyBhbmQgcmVwbGFjZSB3aXRoIHlvdXIgbG9naW5cclxuICAgICAgICAgICAgICAgIC8vIGNvZGUgaWYgdXNpbmcgYSBsb2dpbiBzeXN0ZW1cclxuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VMb2dpblJlZ2lzdGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgICAgICAvL3JlZ2lzdGVyIHNlY3Rpb25cclxuICAgICAgICAgICAgJHNjb3BlLmRvTG9naW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBMb2dpblNlcnZpY2UubG9naW5Vc2VyKCRzY29wZS5sb2dpbkRhdGEudXNlcm5hbWUsICRzY29wZS5sb2dpbkRhdGEucGFzc3dvcmQpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygndGFiLmRhc2gnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXRPYmplY3QoXCJjdXJyZW50X3VzZXJcIiwgJHNjb3BlLmxvZ2luRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygncHJvZHVjdHMubGlzdCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZG8gbm90IExvZ2luXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTG9naW4gZmFpbGVkIScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ1BsZWFzZSBjaGVjayB5b3VyIGNyZWRlbnRpYWxzISdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU2ltdWxhdGUgYSBsb2dpbiBkZWxheS4gUmVtb3ZlIHRoaXMgYW5kIHJlcGxhY2Ugd2l0aCB5b3VyIGxvZ2luXHJcbiAgICAgICAgICAgICAgICAvLyBjb2RlIGlmIHVzaW5nIGEgbG9naW4gc3lzdGVtXHJcbi8vICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgICAgJHNjb3BlLmNsb3NlTG9naW5SZWdpc3RlcigpO1xyXG4vLyAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXHJcbiAgICBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xyXG4gICAgICAgIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXHJcbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvXCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvaG9tZS9ob21lLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnY2FydCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvY2FydFwiLFxyXG4gICAgICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9tb2R1bGVzL2NhcnQvY2FydC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ2FydENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG5cclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ2xvZ2luJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9sb2dpblwiLFxyXG4gICAgICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vcmVnaXN0ZXJMb2dpbi5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVnaXN0ZXJMb2dpbkNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG5cclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ25ld01lbnUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL25ld01lbnVcIixcclxuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L25ld01lbnUvbmV3TWVudS5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTmV3bWVudUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbmV3TWVudS5ob21lJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9ob21lXCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvbmV3TWVudS9ob21lLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOZXdtZW51Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdwcm9kdWN0cycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvcHJvZHVjdHNcIixcclxuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L3Byb2R1Y3RzL3Byb2R1Y3RzLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0c0NvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgncHJvZHVjdHMubGlzdCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvbGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L3Byb2R1Y3RzL2xpc3QuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2R1Y3RzTGlzdENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgncHJvZHVjdHMuc2luZ2xlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9zaW5nbGUvOmluZGV4XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvcHJvZHVjdHMvc2luZ2xlLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0c1NpbmdsZUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgncHJvZHVjdHMuY2FydF9wYWdlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jYXJ0X3BhZ2VcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9jYXJ0X3BhZ2UvY2FydF9wYWdlLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDYXJ0UGFnZUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgncHJvZHVjdHMuY2hlY2tvdXQnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2NoZWNrb3V0XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXQuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NoZWNrb3V0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdwcm9kdWN0cy5jaGVja291dF9lZGl0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jaGVja291dF9lZGl0XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvY2hlY2tvdXRfZWRpdC9jaGVja291dF9lZGl0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGVja291dEVkaXRDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ3Byb2R1Y3RzLndpc2hsaXN0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi93aXNobGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L3dpc2hsaXN0L3dpc2hsaXN0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdXaXNobGlzdENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgfVxyXG5dXHJcbjsiXX0=
