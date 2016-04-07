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