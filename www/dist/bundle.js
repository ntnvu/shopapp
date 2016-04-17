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

module.export = angular.module('starter', ['ionic', 'slick', 'akoenig.deckgrid', 'ng-mfb',
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

    $ionicPlatform.on('resume', function(){
        alert("haha");
    });
}

module.exports = ['$ionicPlatform', AppMain];
},{}],3:[function(require,module,exports){
"use strict"

module.exports = angular.module("app.service", [])
    .factory('$localstorage', ['$window', '$ionicHistory', function ($window, $ionicHistory) {
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
                        if (arr[i].id == value[0].id) {
                            shared = true;
                            break;
                        }
                    }
                    if (!shared) {
                        value = value.concat(arr);
                    }
                    else{
                        value = arr;
                    }
                }
                this.setObject(key, value);
            },

            /*
            * objArrNeedUpdate : is an array need update after main array is
            * */
            removeObject: function(key, item, objArrNeedUpdate){
                var arr = this.getObject(key);
                for (var i in arr) {
                    if (arr[i].id == item.id) {
                        arr.splice(i, 1);
                        break;
                    }
                }
                this.setObject(key, arr);

                //update value in array need update
                var arr2 = this.getObject(objArrNeedUpdate);
                if (arr2.length > 0) {
                    for (var i in arr2) {
                        if (arr2[i].id == item.id) {
                            arr2[i] = item;
                            break;
                        }
                    }
                }
                this.setObject(objArrNeedUpdate, arr2);
            },

            mergeArray : function(arr1, arr2){
                var arr3 = [];
                for(var i in arr1){
                    var shared = false;
                    for (var j in arr2)
                        if (arr2[j].id == arr1[i].id) {
                            shared = true;
                            break;
                        }
                    if(!shared) arr3.push(arr1[i])
                }
                arr3 = arr3.concat(arr2);
                return arr3;
            },
            //input 2 array
            //return array contain all elements which are in both array and update follow arr2
            updateArray : function(arr1, arr2){
                for(var i in arr1){
                    for (var j in arr2)
                        if (arr2[j].id == arr1[i].id) {
                            arr1[i] = arr2[j];
                        }
                }
                return arr1;
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
require('../.././modules/cart/cart_service.js');
require('../wishlist/wishlist_service.js');
require('../.././app_service');

module.exports = angular.module("CartPage", ['app.service', 'cart.services', 'wishlist.service', 'CartPage.controller']);
},{"../.././app_service":3,"../.././modules/cart/cart_service.js":26,"../wishlist/wishlist_service.js":23,"./cart_page_controller.js":5}],5:[function(require,module,exports){
'use strict';

module.exports = angular.module('CartPage.controller', [])
    .controller("CartPageController", ['$scope', '$localstorage', 'WishlistService', 'CartService',
        function ($scope, $localstorage, WishlistService, CartService) {

//            $localstorage.setNull("cart");
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
                        angular.copy({number: 1}, $scope.page);
                        angular.copy(data, $scope.products);//must use angular.copy instead use "=" so it can continue binding to first service param
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
    .controller("ProductController", ['$scope', 'ProductService', '$stateParams', 'WishlistService', '$http', 'ControlModalService', '$ionicSlideBoxDelegate','$timeout',
        function ($scope, ProductService, $stateParams, WishlistService, $http, ControlModalService, $ionicSlideBoxDelegate, $timeout) {
            var link_ajax = "http://shop10k.qrmartdemo.info/api/rest/products";
            $scope.product = {};
            $http.get(link_ajax + "/" + $stateParams.id).then(function (resp) {
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

            $scope.chooseProductOption = function (item) {
                ControlModalService.show('js/modules/cart/cart.html', 'CartController', 1, item);
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

        function edit_object_return(products){
            var temp = [];
            $.each( products, function( key, value ) {
                value.img = value.image_url;
                value.id = value.entity_id;
                temp.push(value);
            })
            return temp;
        }

        return{
            filterProduct: function (filterType, ajax, page_next) {
                var deferred = $q.defer();
                var promise = deferred.promise;
//                var link_ajax = "http://liquordelivery.com.sg/wp-admin/admin-ajax.php";
//                $http.get(link_ajax + "?action=latest_products_app&filter=" + filterType + "&page=" + page_next).then(function (resp) {

                var link_ajax = "http://shop10k.qrmartdemo.info/api/rest/products";
                $http.get(link_ajax + "?page="+ page_next + "&limit=20&order=entity_id&dir=dsc").then(function (resp) {

                    if (ajax) {
                        products = products.concat(resp.data);
                    }
                    else {
                        products = resp.data;
                    }
                    if(!Array.isArray(products))
                        products = edit_object_return(products);

                    products = $localstorage.updateArray(products, $localstorage.getObject("wishlist"));
                    products = $localstorage.updateArray(products, $localstorage.getObject("cart"));

                    deferred.resolve(products);
                    // For JSON responses, resp.data contains the result
                }, function (err) {
                    console.error('ERR', err);
                    deferred.reject('ERR ' + err);
                    // err.status will contain the status code
                })

                return promise;
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
//            $localstorage.setNull("wishlist");
            $scope.wishlist = $localstorage.getObject("wishlist");

            $scope.removeFromWishlist = function(item){
                WishlistService.removeWishlist(item);
                $scope.wishlist = $localstorage.getObject("wishlist");
            }
        }]);
},{}],23:[function(require,module,exports){
'use strict';

module.exports = angular.module('wishlist.service', [])
    .service('WishlistService', function ($q, $localstorage) {
        return {
            addWishlist : function(item){                
                if(!item.like){
                    item.like = !item.like;
                    $localstorage.addObject("wishlist", item);
                }
                else{
                    this.removeWishlist(item);
                }
            },
            removeWishlist : function(item){
                item.like = !item.like;
                $localstorage.removeObject("wishlist", item, "cart");
            },
            isInWishlist : function(obj){

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
    .controller("CartController", ['$scope', 'parameters', 'CartService',
        function ($scope, parameters, CartService) {

            $scope.optProd = {
                color:["yellow", "red", "orange", "blue"],
                size:["S", "M", "L", "XL"]
            };

            $scope.choice = {};

            $scope.add_to_cart = function () {
                parameters.color = $scope.choice.color;
                parameters.size = $scope.choice.size;
                parameters.quantity = $scope.choice.quantity;


                CartService.addCart(parameters);
                $scope.closeModal();
            }

        }]);
},{}],26:[function(require,module,exports){
'use strict';

module.exports = angular.module('cart.services', [])
    .service('CartService', function ($q, $localstorage) {
        return {
            addCart : function(item){
                item.added = !item.added;
                $localstorage.addObject("cart", item);
            },
            removeCart : function(item){
                item.added = !item.added;
                $localstorage.removeObject("cart", item, "wishlist");
            }
        }
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
                url: "/product/:id",
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
                templateUrl: "js/layout/checkout_edit/checkout_edit.html",
                controller: 'CheckoutEditController'
            })
        ;

    }
]
;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIi4vd3d3L2pzL2FwcC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvYXBwLW1haW4uanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2FwcF9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2FydF9wYWdlL2NhcnRfcGFnZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NhcnRfcGFnZS9jYXJ0X3BhZ2VfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0L2NoZWNrb3V0LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXRfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0X2VkaXQvY2hlY2tvdXRfZWRpdC5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L2NoZWNrb3V0X2VkaXQvY2hlY2tvdXRfZWRpdF9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvaG9tZS9ob21lLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvaG9tZS9ob21lX2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9tZW51L21lbnUuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9tZW51L21lbnVfY29udHJvbGxlci5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L25ld01lbnUvbmV3TWVudS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L25ld01lbnUvbmV3TWVudV9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvbmV3TWVudS9uZXdNZW51X2ZhY3RvcnkuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0X2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0cy5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbGF5b3V0L3Byb2R1Y3RzL3Byb2R1Y3RzX2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC9wcm9kdWN0cy9wcm9kdWN0c19mYWN0b3J5LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvd2lzaGxpc3Qvd2lzaGxpc3QuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL2xheW91dC93aXNobGlzdC93aXNobGlzdF9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9sYXlvdXQvd2lzaGxpc3Qvd2lzaGxpc3Rfc2VydmljZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9jYXJ0L2NhcnQuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL21vZHVsZXMvY2FydC9jYXJ0X2NvbnRyb2xsZXIuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL21vZHVsZXMvY2FydC9jYXJ0X3NlcnZpY2UuanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL21vZHVsZXMvY29udGFjdC9jb250YWN0LmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL2NvbnRhY3QvY29udGFjdF9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL2NvbnRhY3QvY29udGFjdF9zZXJ2aWNlLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9tb2R1bGVzL3JlZ2lzdGVyTG9naW4vbG9naW5fc2VydmljZS5qcyIsIkQ6L2Fkdm5fcHJvamVjdHMvaW9uaWMvc2hvcGFwcC93d3cvanMvbW9kdWxlcy9yZWdpc3RlckxvZ2luL3JlZ2lzdGVyTG9naW4uanMiLCJEOi9hZHZuX3Byb2plY3RzL2lvbmljL3Nob3BhcHAvd3d3L2pzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3Rlcl9sb2dpbl9jb250cm9sbGVyLmpzIiwiRDovYWR2bl9wcm9qZWN0cy9pb25pYy9zaG9wYXBwL3d3dy9qcy9yb3V0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvL21vZHVsZSBub2RlXG4vL3JlcXVpcmUoXCJhbmd1bGFyXCIpO1xuXG4vL21vZHVsZSBmdW5jdGlvbnNcbnJlcXVpcmUoXCIuL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luXCIpO1xucmVxdWlyZShcIi4vbW9kdWxlcy9jYXJ0L2NhcnRcIik7XG5yZXF1aXJlKFwiLi9tb2R1bGVzL2NvbnRhY3QvY29udGFjdFwiKTtcbi8vbW9kdWxlIGxheW91dFxucmVxdWlyZShcIi4vbGF5b3V0L2hvbWUvaG9tZVwiKTtcbnJlcXVpcmUoXCIuL2xheW91dC9uZXdNZW51L25ld01lbnVcIik7XG5yZXF1aXJlKFwiLi9sYXlvdXQvcHJvZHVjdHMvcHJvZHVjdHNcIik7XG5yZXF1aXJlKFwiLi9sYXlvdXQvbWVudS9tZW51XCIpO1xucmVxdWlyZShcIi4vbGF5b3V0L2NhcnRfcGFnZS9jYXJ0X3BhZ2VcIik7XG5yZXF1aXJlKFwiLi9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXRcIik7XG5yZXF1aXJlKFwiLi9sYXlvdXQvY2hlY2tvdXRfZWRpdC9jaGVja291dF9lZGl0XCIpO1xucmVxdWlyZShcIi4vbGF5b3V0L3dpc2hsaXN0L3dpc2hsaXN0XCIpO1xuXG5tb2R1bGUuZXhwb3J0ID0gYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXInLCBbJ2lvbmljJywgJ3NsaWNrJywgJ2Frb2VuaWcuZGVja2dyaWQnLCAnbmctbWZiJyxcbiAgICAgICAgLy9mdW5jdGlvbnNcbiAgICAgICAgJ3JlZ2lzdGVyTG9naW4nLFxuICAgICAgICAnY2FydCcsXG4gICAgICAgICdjb250YWN0JyxcblxuICAgICAgICAvL2xheW91dFxuICAgICAgICAnaG9tZScsXG4gICAgICAgICdtZW51JyxcbiAgICAgICAgJ25ld01lbnUnLFxuICAgICAgICAncHJvZHVjdHMnLFxuICAgICAgICAnQ2FydFBhZ2UnLFxuICAgICAgICAnY2hlY2tvdXQnLFxuICAgICAgICAnY2hlY2tvdXRFZGl0JyxcbiAgICAgICAgJ3dpc2hsaXN0JyxcblxuICAgIF0pXG4gICAgLmNvbmZpZyhyZXF1aXJlKCcuL3JvdXRlcicpKVxuICAgIC5jb25maWcoZnVuY3Rpb24gKCRpb25pY0NvbmZpZ1Byb3ZpZGVyKSB7XG4gICAgICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLnBsYXRmb3JtLmFuZHJvaWQudGFicy5wb3NpdGlvbihcImJvdHRvbVwiKTtcbiAgICB9KVxuICAgIC5ydW4ocmVxdWlyZSgnLi9hcHAtbWFpbicpKTtcblxuXG5cbiIsIid1c2Ugc3RyaWN0JztcclxuZnVuY3Rpb24gQXBwTWFpbigkaW9uaWNQbGF0Zm9ybSl7XHJcbiAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXHJcbiAgICAgICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxyXG4gICAgICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XHJcbiAgICAgICAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XHJcbiAgICAgICAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5kaXNhYmxlU2Nyb2xsKHRydWUpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcclxuICAgICAgICAgICAgLy8gb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxyXG4gICAgICAgICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGlvbmljUGxhdGZvcm0ub24oJ3Jlc3VtZScsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgYWxlcnQoXCJoYWhhXCIpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gWyckaW9uaWNQbGF0Zm9ybScsIEFwcE1haW5dOyIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiYXBwLnNlcnZpY2VcIiwgW10pXHJcbiAgICAuZmFjdG9yeSgnJGxvY2Fsc3RvcmFnZScsIFsnJHdpbmRvdycsICckaW9uaWNIaXN0b3J5JywgZnVuY3Rpb24gKCR3aW5kb3csICRpb25pY0hpc3RvcnkpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChrZXksIGRlZmF1bHRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gfHwgZGVmYXVsdFZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0T2JqZWN0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0T2JqZWN0OiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8ICd7fScpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0TnVsbDogZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRPYmplY3Qoa2V5LCB7fSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldE51bGxBbGw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFyQ2FjaGUoKTtcclxuICAgICAgICAgICAgICAgICRpb25pY0hpc3RvcnkuY2xlYXJIaXN0b3J5KCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGRPYmplY3Q6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBuZXcgQXJyYXkodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IHRoaXMuZ2V0T2JqZWN0KGtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2hhcmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycltpXS5pZCA9PSB2YWx1ZVswXS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2hhcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuY29uY2F0KGFycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gYXJyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0T2JqZWN0KGtleSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgKiBvYmpBcnJOZWVkVXBkYXRlIDogaXMgYW4gYXJyYXkgbmVlZCB1cGRhdGUgYWZ0ZXIgbWFpbiBhcnJheSBpc1xyXG4gICAgICAgICAgICAqICovXHJcbiAgICAgICAgICAgIHJlbW92ZU9iamVjdDogZnVuY3Rpb24oa2V5LCBpdGVtLCBvYmpBcnJOZWVkVXBkYXRlKXtcclxuICAgICAgICAgICAgICAgIHZhciBhcnIgPSB0aGlzLmdldE9iamVjdChrZXkpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJyW2ldLmlkID09IGl0ZW0uaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRPYmplY3Qoa2V5LCBhcnIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vdXBkYXRlIHZhbHVlIGluIGFycmF5IG5lZWQgdXBkYXRlXHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyMiA9IHRoaXMuZ2V0T2JqZWN0KG9iakFyck5lZWRVcGRhdGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFycjIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYXJyMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyMltpXS5pZCA9PSBpdGVtLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnIyW2ldID0gaXRlbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRPYmplY3Qob2JqQXJyTmVlZFVwZGF0ZSwgYXJyMik7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBtZXJnZUFycmF5IDogZnVuY3Rpb24oYXJyMSwgYXJyMil7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyMyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpIGluIGFycjEpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzaGFyZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqIGluIGFycjIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnIyW2pdLmlkID09IGFycjFbaV0uaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFzaGFyZWQpIGFycjMucHVzaChhcnIxW2ldKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYXJyMyA9IGFycjMuY29uY2F0KGFycjIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFycjM7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vaW5wdXQgMiBhcnJheVxyXG4gICAgICAgICAgICAvL3JldHVybiBhcnJheSBjb250YWluIGFsbCBlbGVtZW50cyB3aGljaCBhcmUgaW4gYm90aCBhcnJheSBhbmQgdXBkYXRlIGZvbGxvdyBhcnIyXHJcbiAgICAgICAgICAgIHVwZGF0ZUFycmF5IDogZnVuY3Rpb24oYXJyMSwgYXJyMil7XHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgaW4gYXJyMSl7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBhcnIyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyMltqXS5pZCA9PSBhcnIxW2ldLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnIxW2ldID0gYXJyMltqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFycjE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XSlcclxuICAgIC5zZXJ2aWNlKCdDb250cm9sTW9kYWxTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkaW9uaWNNb2RhbCwgJHJvb3RTY29wZSwgJHRpbWVvdXQsICRjb250cm9sbGVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2hvdzogc2hvd1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBzaG93KHRlbXBsZXRlVXJsLCBjb250cm9sbGVyLCBhdXRvc2hvdywgcGFyYW1ldGVycywgb3B0aW9ucywgd3JhcENhbHNzKSB7XHJcbiAgICAgICAgICAgIC8vIEdyYWIgdGhlIGluamVjdG9yIGFuZCBjcmVhdGUgYSBuZXcgc2NvcGVcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKSxcclxuICAgICAgICAgICAgICAgIGN0cmxJbnN0YW5jZSxcclxuICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKSxcclxuICAgICAgICAgICAgICAgIHRoaXNTY29wZUlkID0gbW9kYWxTY29wZS4kaWQsXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb246ICdzbGlkZS1pbi11cCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZm9jdXNGaXJzdElucHV0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZHJvcENsaWNrVG9DbG9zZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBoYXJkd2FyZUJhY2tCdXR0b25DbG9zZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBtb2RhbENhbGxiYWNrOiBudWxsXHJcblxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgJGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKHRlbXBsZXRlVXJsLCB7XHJcbiAgICAgICAgICAgICAgICBzY29wZTogbW9kYWxTY29wZSxcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogb3B0aW9ucy5hbmltYXRpb24sXHJcbiAgICAgICAgICAgICAgICBmb2N1c0ZpcnN0SW5wdXQ6IG9wdGlvbnMuZm9jdXNGaXJzdElucHV0LFxyXG4gICAgICAgICAgICAgICAgYmFja2Ryb3BDbGlja1RvQ2xvc2U6IG9wdGlvbnMuYmFja2Ryb3BDbGlja1RvQ2xvc2UsXHJcbiAgICAgICAgICAgICAgICBoYXJkd2FyZUJhY2tCdXR0b25DbG9zZTogb3B0aW9ucy5oYXJkd2FyZUJhY2tCdXR0b25DbG9zZVxyXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWwgPSBtb2RhbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWwuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLm1vZGFsLmFkZENsYXNzKFwiYWRkcnVpbmVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnRlc3QgPSBcImFhXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWwuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUuJG9uKCdtb2RhbC5oaWRkZW4nLCBmdW5jdGlvbiAodGhpc01vZGFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzTW9kYWwuY3VycmVudFNjb3BlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbW9kYWxTY29wZUlkID0gdGhpc01vZGFsLmN1cnJlbnRTY29wZS4kaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc1Njb3BlSWQgPT09IG1vZGFsU2NvcGVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2NsZWFudXAodGhpc01vZGFsLmN1cnJlbnRTY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSW52b2tlIHRoZSBjb250cm9sbGVyXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2FscyA9IHsgJyRzY29wZSc6IG1vZGFsU2NvcGUsICdwYXJhbWV0ZXJzJzogcGFyYW1ldGVycyB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdHJsRXZhbCA9IF9ldmFsQ29udHJvbGxlcihjb250cm9sbGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBjdHJsSW5zdGFuY2UgPSAkY29udHJvbGxlcihjb250cm9sbGVyLCBsb2NhbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdHJsRXZhbC5pc0NvbnRyb2xsZXJBcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHJsSW5zdGFuY2Uub3Blbk1vZGFsID0gbW9kYWxTY29wZS5vcGVuTW9kYWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0cmxJbnN0YW5jZS5jbG9zZU1vZGFsID0gbW9kYWxTY29wZS5jbG9zZU1vZGFsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF1dG9zaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWwuc2hvdygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZS4kYnJvYWRjYXN0KCdtb2RhbC5hZnRlclNob3cnLCBtb2RhbFNjb3BlLm1vZGFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihvcHRpb25zLm1vZGFsQ2FsbGJhY2spKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubW9kYWxDYWxsYmFjayhtb2RhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBfY2xlYW51cChzY29wZSkge1xyXG4gICAgICAgICAgICBzY29wZS4kZGVzdHJveSgpO1xyXG4gICAgICAgICAgICBpZiAoc2NvcGUubW9kYWwpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLm1vZGFsLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBfZXZhbENvbnRyb2xsZXIoY3RybE5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgICAgICAgICAgIGlzQ29udHJvbGxlckFzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJOYW1lOiAnJyxcclxuICAgICAgICAgICAgICAgIHByb3BOYW1lOiAnJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB2YXIgZnJhZ21lbnRzID0gKGN0cmxOYW1lIHx8ICcnKS50cmltKCkuc3BsaXQoL1xccysvKTtcclxuICAgICAgICAgICAgcmVzdWx0LmlzQ29udHJvbGxlckFzID0gZnJhZ21lbnRzLmxlbmd0aCA9PT0gMyAmJiAoZnJhZ21lbnRzWzFdIHx8ICcnKS50b0xvd2VyQ2FzZSgpID09PSAnYXMnO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LmlzQ29udHJvbGxlckFzKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuY29udHJvbGxlck5hbWUgPSBmcmFnbWVudHNbMF07XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHJvcE5hbWUgPSBmcmFnbWVudHNbMl07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuY29udHJvbGxlck5hbWUgPSBjdHJsTmFtZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCcuL2NhcnRfcGFnZV9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vbW9kdWxlcy9jYXJ0L2NhcnRfc2VydmljZS5qcycpO1xyXG5yZXF1aXJlKCcuLi93aXNobGlzdC93aXNobGlzdF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJDYXJ0UGFnZVwiLCBbJ2FwcC5zZXJ2aWNlJywgJ2NhcnQuc2VydmljZXMnLCAnd2lzaGxpc3Quc2VydmljZScsICdDYXJ0UGFnZS5jb250cm9sbGVyJ10pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ0NhcnRQYWdlLmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiQ2FydFBhZ2VDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRsb2NhbHN0b3JhZ2UnLCAnV2lzaGxpc3RTZXJ2aWNlJywgJ0NhcnRTZXJ2aWNlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYWxzdG9yYWdlLCBXaXNobGlzdFNlcnZpY2UsIENhcnRTZXJ2aWNlKSB7XHJcblxyXG4vLyAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbChcImNhcnRcIik7XHJcbiAgICAgICAgICAgICRzY29wZS5jYXJ0bGlzdCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hZGRUb1dpc2hsaXN0ID0gZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgICBXaXNobGlzdFNlcnZpY2UuYWRkV2lzaGxpc3QoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5yZW1vdmVGcm9tQ2FydCA9IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgQ2FydFNlcnZpY2UucmVtb3ZlQ2FydChpdGVtKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jYXJ0bGlzdCA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KFwiY2FydFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCcuL2NoZWNrb3V0X2NvbnRyb2xsZXIuanMnKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcImNoZWNrb3V0XCIsIFsnYXBwLnNlcnZpY2UnLCAnY2hlY2tvdXQuY29udHJvbGxlciddKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjaGVja291dC5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIkNoZWNrb3V0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckbG9jYWxzdG9yYWdlJywgJ0NvbnRyb2xNb2RhbFNlcnZpY2UnLCAnJHN0YXRlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYWxzdG9yYWdlLCBDb250cm9sTW9kYWxTZXJ2aWNlLCAkc3RhdGUpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmNhcnRsaXN0ID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjYXJ0XCIpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNoZWNrb3V0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbChcImNhcnRcIik7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJtZW51LnByb2R1Y3RzXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vY2hlY2tvdXRfZWRpdF9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJjaGVja291dEVkaXRcIiwgWydhcHAuc2VydmljZScsICdjaGVja291dEVkaXQuY29udHJvbGxlciddKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjaGVja291dEVkaXQuY29udHJvbGxlcicsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJDaGVja291dEVkaXRDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRsb2NhbHN0b3JhZ2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICAkbG9jYWxzdG9yYWdlKSB7XHJcbi8vICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3RBdHRyID0ge1xyXG4vLyAgICAgICAgICAgICAgICBjb2xvcjpbXCJ5ZWxsb3dcIiwgXCJyZWRcIiwgXCJvcmFuZ2VcIiwgXCJibHVlXCJdLFxyXG4vLyAgICAgICAgICAgICAgICBzaXplOltcIlNcIiwgXCJNXCIsIFwiTFwiLCBcIlhMXCJdXHJcbi8vICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc2NvcGUuY2FydCA9IFtdO1xyXG5cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5vcHRQcm9kID0ge307XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkX3RvX2NhcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2FydCA9ICRzY29wZS5jYXJ0LmNvbmNhdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHBhcmFtZXRlcnMuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgdGh1bWI6IHBhcmFtZXRlcnMuaW1nLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAkc2NvcGUub3B0UHJvZC5jb2xvcixcclxuICAgICAgICAgICAgICAgICAgICBzaXplOiAkc2NvcGUub3B0UHJvZC5zaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAkc2NvcGUub3B0UHJvZC5xdWFudGl0eVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIikpO1xyXG5cclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0T2JqZWN0KFwiY2FydFwiLCAkc2NvcGUuY2FydCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxucmVxdWlyZSgnLi9ob21lX2NvbnRyb2xsZXInKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnaG9tZScsIFsnYXBwLnNlcnZpY2UnLCBcImhvbWUuY29udHJvbGxlclwiXSk7XHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwiaG9tZS5jb250cm9sbGVyXCIsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJIb21lQ29udHJvbGxlclwiLCBbJyRzY29wZScsICdMb2dpblNlcnZpY2UnLCckbG9jYWxzdG9yYWdlJywnJHN0YXRlJywnQ29udHJvbE1vZGFsU2VydmljZScsJyR0aW1lb3V0JyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBMb2dpblNlcnZpY2UsICRsb2NhbHN0b3JhZ2UsICRzdGF0ZSwgQ29udHJvbE1vZGFsU2VydmljZSwgJHRpbWVvdXQpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJjdXJyZW50X3VzZXJcIik7XHJcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBpZighY3VycmVudFVzZXIudXNlcm5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIENvbnRyb2xNb2RhbFNlcnZpY2Uuc2hvdygnanMvbW9kdWxlcy9yZWdpc3RlckxvZ2luL3JlZ2lzdGVyTG9naW4uaHRtbCcsICdSZWdpc3RlckxvZ2luQ29udHJvbGxlcicsIDEpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdtZW51LnByb2R1Y3RzJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDIwMDApO1xyXG5cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBkbyB5b3VyICQoKSBzdHVmZiBoZXJlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfV0pOyIsIlwidXNlIHN0cmljdFwiXHJcbnJlcXVpcmUoXCIuL21lbnVfY29udHJvbGxlci5qc1wiKTtcclxucmVxdWlyZShcIi4uLy4vcHJvZHVjdHMvcHJvZHVjdHNfZmFjdG9yeS5qc1wiKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcIm1lbnVcIiwgWydhcHAuc2VydmljZScsIFwicHJvZHVjdHMuZmFjdG9yeVwiLCBcIm1lbnUuY29udHJvbGxlclwiXSlcclxuICAgIC5jb25maWcoZnVuY3Rpb24gKCRpb25pY0NvbmZpZ1Byb3ZpZGVyKSB7XHJcbiAgICAgICAgJGlvbmljQ29uZmlnUHJvdmlkZXIuYmFja0J1dHRvbi5wcmV2aW91c1RpdGxlVGV4dChmYWxzZSkudGV4dCgnJyk7XHJcbiAgICB9KTsiLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcIm1lbnUuY29udHJvbGxlclwiLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiTWVudUNvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZScsICdQcm9kdWN0U2VydmljZScsICckc3RhdGUnLCAnQ29udHJvbE1vZGFsU2VydmljZScsJyRpb25pY0hpc3RvcnknLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsIFByb2R1Y3RTZXJ2aWNlLCAkc3RhdGUsIENvbnRyb2xNb2RhbFNlcnZpY2UsICRpb25pY0hpc3RvcnkpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmZpbHRlclR5cGUgPSBbXHJcbiAgICAgICAgICAgICAgICB7dHlwZTogXCJob3RcIiwgbmFtZTogJ1NhbiBwaGFtIGhvdCd9LFxyXG4gICAgICAgICAgICAgICAge3R5cGU6IFwiYmVzdHNlbGxlclwiLCBuYW1lOiAnU2FuIHBoYW0gYmFuIGNoYXknfSxcclxuICAgICAgICAgICAgICAgIHt0eXBlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbHQ6IDUwXHJcbiAgICAgICAgICAgICAgICB9LCBuYW1lOiAnRHVvaSA1MC4wMDAnfSxcclxuICAgICAgICAgICAgICAgIHt0eXBlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZDogWzUwLCAxMDBdXHJcbiAgICAgICAgICAgICAgICB9LCBuYW1lOiAnNTAuMDAwIGRlbiAxMDAuMDAwJ30sXHJcbiAgICAgICAgICAgICAgICB7dHlwZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmQ6IFsxMDAsIDIwMF1cclxuICAgICAgICAgICAgICAgIH0sIG5hbWU6ICcxMDAuMDAwIGRlbiAyMDAuMDAwJ30sXHJcbiAgICAgICAgICAgICAgICB7dHlwZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGd0OiAyMDBcclxuICAgICAgICAgICAgICAgIH0sIG5hbWU6ICdUcmVuIDIwMC4wMDAnfVxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wZW5NZW51ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS50b2dnbGVMZWZ0KCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUucHJvZHVjdHMgPSBQcm9kdWN0U2VydmljZS5wcm9kdWN0Q3VycmVudDtcclxuICAgICAgICAgICAgJHNjb3BlLnBhZ2UgPSBQcm9kdWN0U2VydmljZS5wYWdlO1xyXG4gICAgICAgICAgICAkc2NvcGUuZmlyc3RUaW1lID0gMDtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5nZXRQcm9kdWN0cyA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlID0gSlNPTi5zdHJpbmdpZnkodHlwZSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudGNoZWNrQ3RybCA9IHR5cGU7XHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5maWx0ZXJQcm9kdWN0KHR5cGUpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5jb3B5KHtudW1iZXI6IDF9LCAkc2NvcGUucGFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuY29weShkYXRhLCAkc2NvcGUucHJvZHVjdHMpOy8vbXVzdCB1c2UgYW5ndWxhci5jb3B5IGluc3RlYWQgdXNlIFwiPVwiIHNvIGl0IGNhbiBjb250aW51ZSBiaW5kaW5nIHRvIGZpcnN0IHNlcnZpY2UgcGFyYW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5maXJzdFRpbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJtZW51LnByb2R1Y3RzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmlyc3RUaW1lID0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY29udGFjdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBDb250cm9sTW9kYWxTZXJ2aWNlLnNob3coJ2pzL21vZHVsZXMvY29udGFjdC9jb250YWN0Lmh0bWwnLCAnQ29udGFjdENvbnRyb2xsZXInLCAxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNob3dfY2FydCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJtZW51LmNhcnRfcGFnZVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmdldFByb2R1Y3RzKFwiaG90XCIpO1xyXG4gICAgICAgIH1cclxuICAgIF0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5yZXF1aXJlKFwiLi9uZXdNZW51X2NvbnRyb2xsZXIuanNcIik7XHJcbnJlcXVpcmUoXCIuL25ld01lbnVfZmFjdG9yeS5qc1wiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJuZXdNZW51XCIsIFtcIm5ld01lbnUuZmFjdG9yeVwiLCBcIm5ld01lbnUuY29udHJvbGxlclwiXSk7IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJuZXdNZW51LmNvbnRyb2xsZXJcIiwgW10pXHJcbiAgICAuY29udHJvbGxlcihcIk5ld21lbnVDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJyRpb25pY1NpZGVNZW51RGVsZWdhdGUnLCAnTW92aWVzJyxcclxuICAgICAgICBmdW5jdGlvbigkc2NvcGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsIE1vdmllcykge1xyXG4gICAgICAgICAgICAkc2NvcGUuc29ydGluZyA9IFt7c2NvcmU6IDksIG5hbWUgOiAnU2NvcmUgbW9yZSB0aGVuIDknfSxcclxuICAgICAgICAgICAgICAgIHtzY29yZTogOCwgbmFtZSA6ICdTY29yZSBtb3JlIHRoZW4gOCd9LFxyXG4gICAgICAgICAgICAgICAge3Njb3JlOiA3LCBuYW1lIDogJ1Njb3JlIG1vcmUgdGhlbiA3J30sXHJcbiAgICAgICAgICAgICAgICB7c2NvcmU6IDYsIG5hbWUgOiAnU2NvcmUgbW9yZSB0aGVuIDYnfSxcclxuICAgICAgICAgICAgICAgIHtzY29yZTogNSwgbmFtZSA6ICdTY29yZSBtb3JlIHRoZW4gNSd9LFxyXG4gICAgICAgICAgICAgICAge3Njb3JlOiA0LCBuYW1lIDogJ1Njb3JlIG1vcmUgdGhlbiA0J30sXHJcbiAgICAgICAgICAgICAgICB7c2NvcmU6IDMsIG5hbWUgOiAnU2NvcmUgbW9yZSB0aGVuIDMnfSxcclxuICAgICAgICAgICAgICAgIHtzY29yZTogMiwgbmFtZSA6ICdTY29yZSBtb3JlIHRoZW4gMid9LFxyXG4gICAgICAgICAgICAgICAge3Njb3JlOiAxLCBuYW1lIDogJ1Njb3JlIG1vcmUgdGhlbiAxJ30sXHJcbiAgICAgICAgICAgICAgICB7c2NvcmU6IDAsIG5hbWUgOiAnU2hvdyBtZSBldmVyeSBtb3ZpZSd9XTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZCA9IHtcclxuICAgICAgICAgICAgICAgIHNjb3JlIDogMCxcclxuICAgICAgICAgICAgICAgIG1vdmllTmFtZSA6ICdCYXRtYW4nXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5vcGVuTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUudG9nZ2xlTGVmdCgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmdyZWF0ZXJUaGFuID0gZnVuY3Rpb24oZmllbGROYW1lKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVtmaWVsZE5hbWVdID4gJHNjb3BlLnNlbGVjdGVkLnNjb3JlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2VhcmNoTW92aWVEQiA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIE1vdmllcy5saXN0KCRzY29wZS5zZWxlY3RlZC5tb3ZpZU5hbWUsIGZ1bmN0aW9uKG1vdmllcykge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tb3ZpZXMgPSBtb3ZpZXM7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2VhcmNoTW92aWVEQigpO1xyXG4gICAgICAgIH1cclxuICAgIF0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcIm5ld01lbnUuZmFjdG9yeVwiLCBbXSlcclxuICAgIC5mYWN0b3J5KCdNb3ZpZXMnLCBmdW5jdGlvbiAoJGh0dHApIHtcclxuICAgICAgICB2YXIgY2FjaGVkRGF0YTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGF0YShtb3ZpZW5hbWUsIGNhbGxiYWNrKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy8nLFxyXG4gICAgICAgICAgICAgICAgbW9kZSA9ICdzZWFyY2gvbW92aWU/cXVlcnk9JyxcclxuICAgICAgICAgICAgICAgIG5hbWUgPSAnJnF1ZXJ5PScgKyBlbmNvZGVVUkkobW92aWVuYW1lKSxcclxuICAgICAgICAgICAgICAgIGtleSA9ICcmYXBpX2tleT00NzBmZDJlYzg4NTNlMjVkMmY4ZDg2ZjY4NWQyMjcwZSc7XHJcblxyXG4gICAgICAgICAgICAkaHR0cC5nZXQodXJsICsgbW9kZSArIGtleSArIG5hbWUpLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjYWNoZWREYXRhID0gZGF0YS5yZXN1bHRzO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YS5yZXN1bHRzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBsaXN0OiBnZXREYXRhLFxyXG4gICAgICAgICAgICBmaW5kOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vdmllID0gY2FjaGVkRGF0YS5maWx0ZXIoZnVuY3Rpb24gKGVudHJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVudHJ5LmlkID09IG5hbWU7XHJcbiAgICAgICAgICAgICAgICB9KVswXTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG1vdmllKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfSk7IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwcm9kdWN0LmNvbnRyb2xsZXJcIiwgW10pXHJcbiAgICAuY29udHJvbGxlcihcIlByb2R1Y3RDb250cm9sbGVyXCIsIFsnJHNjb3BlJywgJ1Byb2R1Y3RTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsICdXaXNobGlzdFNlcnZpY2UnLCAnJGh0dHAnLCAnQ29udHJvbE1vZGFsU2VydmljZScsICckaW9uaWNTbGlkZUJveERlbGVnYXRlJywnJHRpbWVvdXQnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIFByb2R1Y3RTZXJ2aWNlLCAkc3RhdGVQYXJhbXMsIFdpc2hsaXN0U2VydmljZSwgJGh0dHAsIENvbnRyb2xNb2RhbFNlcnZpY2UsICRpb25pY1NsaWRlQm94RGVsZWdhdGUsICR0aW1lb3V0KSB7XHJcbiAgICAgICAgICAgIHZhciBsaW5rX2FqYXggPSBcImh0dHA6Ly9zaG9wMTBrLnFybWFydGRlbW8uaW5mby9hcGkvcmVzdC9wcm9kdWN0c1wiO1xyXG4gICAgICAgICAgICAkc2NvcGUucHJvZHVjdCA9IHt9O1xyXG4gICAgICAgICAgICAkaHR0cC5nZXQobGlua19hamF4ICsgXCIvXCIgKyAkc3RhdGVQYXJhbXMuaWQpLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5wcm9kdWN0LmRldGFpbCA9IHJlc3AuZGF0YTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkaHR0cC5nZXQobGlua19hamF4ICsgXCIvXCIgKyAkc3RhdGVQYXJhbXMuaWQgKyBcIi9pbWFnZXNcIikudGhlbihmdW5jdGlvbiAocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3QuaW1hZ2VzID0gcmVzcC5kYXRhO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZVNsaWRlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXggKyBcIi9cIiArICRzdGF0ZVBhcmFtcy5pZCArIFwiL2NhdGVnb3JpZXNcIikudGhlbihmdW5jdGlvbiAoY2F0KSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUucHJvZHVjdC5jYXRlZ29yeSA9IGNhdC5kYXRhO1xyXG4gICAgICAgICAgICAgICAgJGh0dHAuZ2V0KGxpbmtfYWpheCArIFwiP2NhdGVnb3J5X2lkPVwiICsgJHNjb3BlLnByb2R1Y3QuY2F0ZWdvcnlbMF0uY2F0ZWdvcnlfaWQpLnRoZW4oZnVuY3Rpb24gKHJlbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9kdWN0LnJlbGF0ZWQgPSByZWxhdGUuZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVTbGlkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNTbGlkZUJveERlbGVnYXRlLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkVG9XaXNobGlzdCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBXaXNobGlzdFNlcnZpY2UuYWRkV2lzaGxpc3QoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jaG9vc2VQcm9kdWN0T3B0aW9uID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIENvbnRyb2xNb2RhbFNlcnZpY2Uuc2hvdygnanMvbW9kdWxlcy9jYXJ0L2NhcnQuaHRtbCcsICdDYXJ0Q29udHJvbGxlcicsIDEsIGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfV0pO1xyXG5cclxuIiwiXCJ1c2Ugc3RyaWN0XCJcclxucmVxdWlyZShcIi4vcHJvZHVjdHNfZmFjdG9yeS5qc1wiKTtcclxucmVxdWlyZShcIi4vcHJvZHVjdHNfY29udHJvbGxlci5qc1wiKTtcclxucmVxdWlyZShcIi4vcHJvZHVjdF9jb250cm9sbGVyLmpzXCIpO1xyXG5yZXF1aXJlKCcuLi8uL3dpc2hsaXN0L3dpc2hsaXN0X3NlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcInByb2R1Y3RzXCIsIFsnYXBwLnNlcnZpY2UnLCAnd2lzaGxpc3Quc2VydmljZScsIFwicHJvZHVjdHMuZmFjdG9yeVwiLCBcInByb2R1Y3RzLmNvbnRyb2xsZXJcIiwgXCJwcm9kdWN0LmNvbnRyb2xsZXJcIl0pXHJcbiAgICAuY29uZmlnKGZ1bmN0aW9uICgkaW9uaWNDb25maWdQcm92aWRlcikge1xyXG4gICAgICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLmJhY2tCdXR0b24ucHJldmlvdXNUaXRsZVRleHQoZmFsc2UpLnRleHQoJycpO1xyXG4gICAgfSk7IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJwcm9kdWN0cy5jb250cm9sbGVyXCIsIFtdKVxyXG4gICAgLmNvbnRyb2xsZXIoXCJQcm9kdWN0c0NvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZScsJ1Byb2R1Y3RTZXJ2aWNlJywgJ0NvbnRyb2xNb2RhbFNlcnZpY2UnLCdXaXNobGlzdFNlcnZpY2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsIFByb2R1Y3RTZXJ2aWNlLCBDb250cm9sTW9kYWxTZXJ2aWNlLCBXaXNobGlzdFNlcnZpY2UpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3RzID0gUHJvZHVjdFNlcnZpY2UucHJvZHVjdEN1cnJlbnQ7XHJcbiAgICAgICAgICAgICRzY29wZS5wYWdlID0gUHJvZHVjdFNlcnZpY2UucGFnZTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5vcGVuTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUudG9nZ2xlTGVmdCgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmxvYWRNb3JlRGF0YSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0eXBlID0gJHNjb3BlLmN1cnJlbnRjaGVja0N0cmw7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRlbXBwYWdlID0gJHNjb3BlLnBhZ2UubnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgdGVtcHBhZ2UrKztcclxuXHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0U2VydmljZS5maWx0ZXJQcm9kdWN0KHR5cGUsIDEsIHRlbXBwYWdlKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gJHNjb3BlLnByb2R1Y3RzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wID0gdGVtcC5jb25jYXQoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuY29weSh0ZW1wLCAkc2NvcGUucHJvZHVjdHMpOy8vbXVzdCB1c2UgYW5ndWxhci5jb3B5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kYnJvYWRjYXN0KCdzY3JvbGwuaW5maW5pdGVTY3JvbGxDb21wbGV0ZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5jb3B5KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bWJlciA6IHRlbXBwYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sICRzY29wZS5wYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmNob29zZVByb2R1Y3RPcHRpb24gPSBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgIENvbnRyb2xNb2RhbFNlcnZpY2Uuc2hvdygnanMvbW9kdWxlcy9jYXJ0L2NhcnQuaHRtbCcsICdDYXJ0Q29udHJvbGxlcicsIDEsIGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYWRkVG9XaXNobGlzdCA9IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgV2lzaGxpc3RTZXJ2aWNlLmFkZFdpc2hsaXN0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXSk7XHJcbiIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFwicHJvZHVjdHMuZmFjdG9yeVwiLCBbXSlcclxuICAgIC5mYWN0b3J5KCdQcm9kdWN0U2VydmljZScsIGZ1bmN0aW9uICgkcSwgJGh0dHAsICRsb2NhbHN0b3JhZ2UpIHtcclxuICAgICAgICB2YXIgcHJvZHVjdHMgPSBbXTtcclxuICAgICAgICB2YXIgcGFnZSA9IHtcclxuICAgICAgICAgICAgbnVtYmVyIDogMVxyXG4gICAgICAgIH07Ly9zaG91bGQgdXNlIG9iamVjdCBvciBhcnJheSwgZG9uJ3QgdXNlIGEgc2luZ2xlIHZhcmlhYmxlXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGVkaXRfb2JqZWN0X3JldHVybihwcm9kdWN0cyl7XHJcbiAgICAgICAgICAgIHZhciB0ZW1wID0gW107XHJcbiAgICAgICAgICAgICQuZWFjaCggcHJvZHVjdHMsIGZ1bmN0aW9uKCBrZXksIHZhbHVlICkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUuaW1nID0gdmFsdWUuaW1hZ2VfdXJsO1xyXG4gICAgICAgICAgICAgICAgdmFsdWUuaWQgPSB2YWx1ZS5lbnRpdHlfaWQ7XHJcbiAgICAgICAgICAgICAgICB0ZW1wLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gdGVtcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybntcclxuICAgICAgICAgICAgZmlsdGVyUHJvZHVjdDogZnVuY3Rpb24gKGZpbHRlclR5cGUsIGFqYXgsIHBhZ2VfbmV4dCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuLy8gICAgICAgICAgICAgICAgdmFyIGxpbmtfYWpheCA9IFwiaHR0cDovL2xpcXVvcmRlbGl2ZXJ5LmNvbS5zZy93cC1hZG1pbi9hZG1pbi1hamF4LnBocFwiO1xyXG4vLyAgICAgICAgICAgICAgICAkaHR0cC5nZXQobGlua19hamF4ICsgXCI/YWN0aW9uPWxhdGVzdF9wcm9kdWN0c19hcHAmZmlsdGVyPVwiICsgZmlsdGVyVHlwZSArIFwiJnBhZ2U9XCIgKyBwYWdlX25leHQpLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbGlua19hamF4ID0gXCJodHRwOi8vc2hvcDEway5xcm1hcnRkZW1vLmluZm8vYXBpL3Jlc3QvcHJvZHVjdHNcIjtcclxuICAgICAgICAgICAgICAgICRodHRwLmdldChsaW5rX2FqYXggKyBcIj9wYWdlPVwiKyBwYWdlX25leHQgKyBcIiZsaW1pdD0yMCZvcmRlcj1lbnRpdHlfaWQmZGlyPWRzY1wiKS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhamF4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3RzID0gcHJvZHVjdHMuY29uY2F0KHJlc3AuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0cyA9IHJlc3AuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIUFycmF5LmlzQXJyYXkocHJvZHVjdHMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0cyA9IGVkaXRfb2JqZWN0X3JldHVybihwcm9kdWN0cyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHByb2R1Y3RzID0gJGxvY2Fsc3RvcmFnZS51cGRhdGVBcnJheShwcm9kdWN0cywgJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJ3aXNobGlzdFwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHMgPSAkbG9jYWxzdG9yYWdlLnVwZGF0ZUFycmF5KHByb2R1Y3RzLCAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcImNhcnRcIikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHByb2R1Y3RzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBGb3IgSlNPTiByZXNwb25zZXMsIHJlc3AuZGF0YSBjb250YWlucyB0aGUgcmVzdWx0XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRVJSJywgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0VSUiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBlcnIuc3RhdHVzIHdpbGwgY29udGFpbiB0aGUgc3RhdHVzIGNvZGVcclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBwcm9kdWN0Q3VycmVudCA6IHByb2R1Y3RzLFxyXG5cclxuICAgICAgICAgICAgcGFnZSA6IHBhZ2VcclxuICAgICAgICB9XHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCcuL3dpc2hsaXN0X2NvbnRyb2xsZXIuanMnKTtcclxucmVxdWlyZSgnLi93aXNobGlzdF9zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJ3aXNobGlzdFwiLCBbJ2FwcC5zZXJ2aWNlJywgJ3dpc2hsaXN0LnNlcnZpY2UnLCAnd2lzaGxpc3QuY29udHJvbGxlciddKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCd3aXNobGlzdC5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIldpc2hsaXN0Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckbG9jYWxzdG9yYWdlJywnV2lzaGxpc3RTZXJ2aWNlJywnJHN0YXRlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYWxzdG9yYWdlLCBXaXNobGlzdFNlcnZpY2UsICRzdGF0ZSkge1xyXG4vLyAgICAgICAgICAgICRsb2NhbHN0b3JhZ2Uuc2V0TnVsbChcIndpc2hsaXN0XCIpO1xyXG4gICAgICAgICAgICAkc2NvcGUud2lzaGxpc3QgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdChcIndpc2hsaXN0XCIpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnJlbW92ZUZyb21XaXNobGlzdCA9IGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgV2lzaGxpc3RTZXJ2aWNlLnJlbW92ZVdpc2hsaXN0KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLndpc2hsaXN0ID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoXCJ3aXNobGlzdFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCd3aXNobGlzdC5zZXJ2aWNlJywgW10pXHJcbiAgICAuc2VydmljZSgnV2lzaGxpc3RTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkbG9jYWxzdG9yYWdlKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYWRkV2lzaGxpc3QgOiBmdW5jdGlvbihpdGVtKXsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZighaXRlbS5saWtlKXtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmxpa2UgPSAhaXRlbS5saWtlO1xyXG4gICAgICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UuYWRkT2JqZWN0KFwid2lzaGxpc3RcIiwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlV2lzaGxpc3QoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlbW92ZVdpc2hsaXN0IDogZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmxpa2UgPSAhaXRlbS5saWtlO1xyXG4gICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5yZW1vdmVPYmplY3QoXCJ3aXNobGlzdFwiLCBpdGVtLCBcImNhcnRcIik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGlzSW5XaXNobGlzdCA6IGZ1bmN0aW9uKG9iail7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9jYXJ0X3NlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi9jYXJ0X2NvbnRyb2xsZXIuanMnKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcImNhcnRcIiwgWydhcHAuc2VydmljZScsICdjYXJ0LnNlcnZpY2VzJywgJ2NhcnQuY29udHJvbGxlciddKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjYXJ0LmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiQ2FydENvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAncGFyYW1ldGVycycsICdDYXJ0U2VydmljZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgcGFyYW1ldGVycywgQ2FydFNlcnZpY2UpIHtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5vcHRQcm9kID0ge1xyXG4gICAgICAgICAgICAgICAgY29sb3I6W1wieWVsbG93XCIsIFwicmVkXCIsIFwib3JhbmdlXCIsIFwiYmx1ZVwiXSxcclxuICAgICAgICAgICAgICAgIHNpemU6W1wiU1wiLCBcIk1cIiwgXCJMXCIsIFwiWExcIl1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jaG9pY2UgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hZGRfdG9fY2FydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtZXRlcnMuY29sb3IgPSAkc2NvcGUuY2hvaWNlLmNvbG9yO1xyXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVycy5zaXplID0gJHNjb3BlLmNob2ljZS5zaXplO1xyXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVycy5xdWFudGl0eSA9ICRzY29wZS5jaG9pY2UucXVhbnRpdHk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIENhcnRTZXJ2aWNlLmFkZENhcnQocGFyYW1ldGVycyk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VNb2RhbCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjYXJ0LnNlcnZpY2VzJywgW10pXHJcbiAgICAuc2VydmljZSgnQ2FydFNlcnZpY2UnLCBmdW5jdGlvbiAoJHEsICRsb2NhbHN0b3JhZ2UpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhZGRDYXJ0IDogZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmFkZGVkID0gIWl0ZW0uYWRkZWQ7XHJcbiAgICAgICAgICAgICAgICAkbG9jYWxzdG9yYWdlLmFkZE9iamVjdChcImNhcnRcIiwgaXRlbSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlbW92ZUNhcnQgOiBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgIGl0ZW0uYWRkZWQgPSAhaXRlbS5hZGRlZDtcclxuICAgICAgICAgICAgICAgICRsb2NhbHN0b3JhZ2UucmVtb3ZlT2JqZWN0KFwiY2FydFwiLCBpdGVtLCBcIndpc2hsaXN0XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9jb250YWN0X3NlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi9jb250YWN0X2NvbnRyb2xsZXIuanMnKTtcclxucmVxdWlyZSgnLi4vLi4vLi9hcHBfc2VydmljZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcImNvbnRhY3RcIiwgWydhcHAuc2VydmljZScsICdjb250YWN0LnNlcnZpY2VzJywgJ2NvbnRhY3QuY29udHJvbGxlciddKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdjb250YWN0LmNvbnRyb2xsZXInLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiQ29udGFjdENvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAncGFyYW1ldGVycycsICckbG9jYWxzdG9yYWdlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBwYXJhbWV0ZXJzLCAkbG9jYWxzdG9yYWdlKSB7XHJcbiAgICAgICAgfV0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3Quc2VydmljZXMnLCBbXSlcclxuICAgIC5zZXJ2aWNlKCdDb250YWN0U2VydmljZScsIGZ1bmN0aW9uICgkcSkge1xyXG5cclxuXHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdyZWdpc3RlckxvZ2luLnNlcnZpY2VzJywgW10pXHJcbiAgICAuc2VydmljZSgnTG9naW5TZXJ2aWNlJywgZnVuY3Rpb24gKCRxKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbG9naW5Vc2VyOiBsb2dpblVzZXJcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gbG9naW5Vc2VyKG5hbWUsIHB3KSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChuYW1lID09ICcxMjM0NScgJiYgcHcgPT0gJzEyMzQ1Jykge1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgnV2VsY29tZSAnICsgbmFtZSArICchJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ1dyb25nIGNyZWRlbnRpYWxzLicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb21pc2Uuc3VjY2VzcyA9IGZ1bmN0aW9uIChmbikge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKGZuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb21pc2UuZXJyb3IgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihudWxsLCBmbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9XHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCcuL2xvZ2luX3NlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi9yZWdpc3Rlcl9sb2dpbl9jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4uLy4uLy4vYXBwX3NlcnZpY2UnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJyZWdpc3RlckxvZ2luXCIsIFsnYXBwLnNlcnZpY2UnLCAncmVnaXN0ZXJMb2dpbi5zZXJ2aWNlcycsICdyZWdpc3RlckxvZ2luLmNvbnRyb2xsZXInXSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgncmVnaXN0ZXJMb2dpbi5jb250cm9sbGVyJywgW10pXHJcbiAgICAuY29udHJvbGxlcihcIlJlZ2lzdGVyTG9naW5Db250cm9sbGVyXCIsIFsnJHNjb3BlJywgJ0xvZ2luU2VydmljZScsICckc3RhdGUnLCAnJGlvbmljUG9wdXAnLCAnJGxvY2Fsc3RvcmFnZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgTG9naW5TZXJ2aWNlLCAkc3RhdGUsICRpb25pY1BvcHVwLCAkbG9jYWxzdG9yYWdlKSB7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUucmVzdWx0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coTG9naW5TZXJ2aWNlLnJlYyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kb24oJ21vZGFsLmhpZGRlbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdtZW51LnByb2R1Y3RzJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmxvZ2luRGF0YSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wZW5Mb2dpbk1vZGFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm9wZW5Nb2RhbCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY2xvc2VMb2dpbk1vZGFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5wcm9kdWN0cycpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2xvZ2luIHNlY3Rpb25cclxuICAgICAgICAgICAgJHNjb3BlLmRvUmVnaXN0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRG9pbmcgcmVnaXN0ZXInLCAkc2NvcGUubG9naW5EYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTaW11bGF0ZSBhIGxvZ2luIGRlbGF5LiBSZW1vdmUgdGhpcyBhbmQgcmVwbGFjZSB3aXRoIHlvdXIgbG9naW5cclxuICAgICAgICAgICAgICAgIC8vIGNvZGUgaWYgdXNpbmcgYSBsb2dpbiBzeXN0ZW1cclxuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VMb2dpblJlZ2lzdGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgICAgICAvL3JlZ2lzdGVyIHNlY3Rpb25cclxuICAgICAgICAgICAgJHNjb3BlLmRvTG9naW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBMb2dpblNlcnZpY2UubG9naW5Vc2VyKCRzY29wZS5sb2dpbkRhdGEudXNlcm5hbWUsICRzY29wZS5sb2dpbkRhdGEucGFzc3dvcmQpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygndGFiLmRhc2gnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2Fsc3RvcmFnZS5zZXRPYmplY3QoXCJjdXJyZW50X3VzZXJcIiwgJHNjb3BlLmxvZ2luRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbWVudS5wcm9kdWN0cycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZG8gbm90IExvZ2luXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTG9naW4gZmFpbGVkIScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ1BsZWFzZSBjaGVjayB5b3VyIGNyZWRlbnRpYWxzISdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU2ltdWxhdGUgYSBsb2dpbiBkZWxheS4gUmVtb3ZlIHRoaXMgYW5kIHJlcGxhY2Ugd2l0aCB5b3VyIGxvZ2luXHJcbiAgICAgICAgICAgICAgICAvLyBjb2RlIGlmIHVzaW5nIGEgbG9naW4gc3lzdGVtXHJcbi8vICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgICAgJHNjb3BlLmNsb3NlTG9naW5SZWdpc3RlcigpO1xyXG4vLyAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXHJcbiAgICBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xyXG4gICAgICAgIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXHJcbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvXCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvaG9tZS9ob21lLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnY2FydCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvY2FydFwiLFxyXG4gICAgICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9tb2R1bGVzL2NhcnQvY2FydC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ2FydENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG5cclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbnRhY3QnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2NvbnRhXCIsXHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL21vZHVsZXMvY2FydC9jYXJ0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDYXJ0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbG9naW4nLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2xvZ2luXCIsXHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL21vZHVsZXMvcmVnaXN0ZXJMb2dpbi9yZWdpc3RlckxvZ2luLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZWdpc3RlckxvZ2luQ29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbmV3TWVudScsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvbmV3TWVudVwiLFxyXG4gICAgICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvbmV3TWVudS9uZXdNZW51Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOZXdtZW51Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCduZXdNZW51LmhvbWUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2hvbWVcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9uZXdNZW51L2hvbWUuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ05ld21lbnVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9tZW51XCIsXHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9tZW51L21lbnUuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01lbnVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LnByb2R1Y3RzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9kdWN0c1wiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L3Byb2R1Y3RzL3Byb2R1Y3RzLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0c0NvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudS5wcm9kdWN0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9kdWN0LzppZFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwianMvbGF5b3V0L3Byb2R1Y3RzL3Byb2R1Y3QuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2R1Y3RDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUuY2FydF9wYWdlJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jYXJ0X3BhZ2VcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9jYXJ0X3BhZ2UvY2FydF9wYWdlLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDYXJ0UGFnZUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVudS53aXNobGlzdCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvd2lzaGxpc3RcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC93aXNobGlzdC93aXNobGlzdC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnV2lzaGxpc3RDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ21lbnUuY2hlY2tvdXQnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2NoZWNrb3V0XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJqcy9sYXlvdXQvY2hlY2tvdXQvY2hlY2tvdXQuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NoZWNrb3V0Q29udHJvbGxlcidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICA7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdtZW51LmNoZWNrb3V0X2VkaXQnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2NoZWNrb3V0X2VkaXRcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImpzL2xheW91dC9jaGVja291dF9lZGl0L2NoZWNrb3V0X2VkaXQuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NoZWNrb3V0RWRpdENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgO1xyXG5cclxuICAgIH1cclxuXVxyXG47Il19
