"use strict"
require("./products_controller.js");
require("./products_list_controller.js");
require("./products_single_controller.js");
require("./products_factory.js");
require('.././wishlist/wishlist_service.js');
require('../.././app_service');

module.exports = angular.module("products", ['app.service', 'wishlist.service', "products.factory", "products.controller", "menu.products.controller", "products.single.controller"])
    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.backButton.previousTitleText(false).text('');
    });