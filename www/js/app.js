require('./modules/playlists/playlists');
require('./modules/login/login');
require('./modules/menu/menu');
require('./layout/home/home');
require('./layout/products/products');

module.export = angular.module('starter', ['ionic',
    'menu',
    'login',
    'playlists',
    'home',
    'products'])
.config(require('./router'))
.run(require('./app-main'));