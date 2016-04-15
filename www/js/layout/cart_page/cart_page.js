'use strict';

require('./cart_page_controller.js');
require('../.././modules/cart/cart_service.js');
require('../wishlist/wishlist_service.js');
require('../.././app_service');

module.exports = angular.module("CartPage", ['app.service', 'cart.services', 'wishlist.service', 'CartPage.controller']);