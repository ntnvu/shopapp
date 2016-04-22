'use strict';

require('./cart_service.js');
require('./cart_controller.js');
require('.././products/products');
require('../.././app_service');

module.exports = angular.module("cart", ['app.service', 'products', 'cart.services', 'cart.controller']);





