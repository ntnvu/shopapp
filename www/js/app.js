//module node
require("angular");
require("angular-masonry");

//module functions
require('./modules/playlists/playlists');
require('./modules/registerLogin/registerLogin');
require('./modules/menu/menu');
require('./modules/products/products');

//module layout
require('./layout/home/home');
require('./layout/player/player');
require('./layout/newMenu/newMenu');

module.export = angular.module('starter', ['ionic', 'wu.masonry',
        //functions
        'menu',
        'registerLogin',
        'playlists',
        'products',
        //layout
        'home',
        'player',
        'newMenu'
    ])
    .config(require('./router'))
    .run(require('./app-main'));



