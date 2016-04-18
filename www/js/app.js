//module node
//require("angular");

//module functions
require("./modules/registerLogin/registerLogin");
require("./modules/contact/contact");
//module layout
require("./layout/home/home");
require("./layout/newMenu/newMenu");
require("./layout/products/products");
require("./layout/menu/menu");
require("./layout/cart/cart");
require("./layout/checkout/checkout");
require("./layout/checkout_edit/checkout_edit");
require("./layout/wishlist/wishlist");

module.export = angular.module('starter', ['ionic', 'slick', 'akoenig.deckgrid', 'ng-mfb', 'ionicLazyLoad',
        //functions
        'registerLogin',
        'contact',

        //layout
        'home',
        'menu',
        'newMenu',
        'products',
        'cart',
        'checkout',
        'checkoutEdit',
        'wishlist',

    ])
    .config(require('./router'))
    .run(require('./app-main'));



