'use strict';


module.exports = ['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('app/products');
        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "js/modules/menu/menu.html",
                controller: 'LoginController as loginController'
            })

            .state('app.products', {
                url: "/products",
                views: {
                    'menuContent': {
                        templateUrl: "js/modules/products/products.html",
                        controller: 'ProductsController as productsController'
                    }
                }
            })

            .state('app.product', {
                url: "/products/:productId",
                views: {
                    'menuContent': {
                        templateUrl: "js/modules/products/product.html",
                        controller: 'ProductsController as productsController'
                    }
                }
            })

            .state('app.home', {
                url: "/home",
                views: {
                    'menuContent': {
                        templateUrl: "js/layout/home/home.html",
                        controller: 'HomeController as homeController'
                    }
                }
            })

            .state('app.search', {
                url: "/search",
                views: {
                    'menuContent': {
                        templateUrl: "js/modules/search/search.html"
                    }
                }
            })

            .state('app.browse', {
                url: "/browse",
                views: {
                    'menuContent': {
                        templateUrl: "js/modules/browse/browse.html"
                    }
                }
            })
            .state('app.playlists', {
                url: "/playlists",
                views: {
                    'menuContent': {
                        templateUrl: "js/modules/playlists/playlists.html",
                        controller: 'PlaylistsController as playlistsController'
                    }
                }
            })

            .state('app.single', {
                url: "/playlists/:playlistId",
                views: {
                    'menuContent': {
                        templateUrl: "js/modules/playlists/playlist.html",
                        controller: 'PlaylistController as playlistController'
                    }
                }
            })

        ;
    }
];