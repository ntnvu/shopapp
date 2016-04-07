"use strict"
require("./menu_controller.js");
require(".././products/products_factory.js");
require('../.././app_service');

module.exports = angular.module("menu", ['app.service', "products.factory", "menu.controller"])
    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.backButton.previousTitleText(false).text('');
    });