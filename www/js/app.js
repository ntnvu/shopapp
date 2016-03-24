//module node
require("angular");
require("angular-masonry");

//module functions
require('./modules/playlists/playlists');
require('./modules/login/login');
require('./modules/menu/menu');
require('./modules/products/products');

//module layout
require('./layout/home/home');




module.export = angular.module('starter', ['ionic','wu.masonry',
        //functions
        'menu',
        'login',
        'playlists',
        'products',
        //layout
        'home'
        ])
    .config(require('./router'))
    .run(require('./app-main'));