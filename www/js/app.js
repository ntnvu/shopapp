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



