'use strict';

require('./checkout_controller');
require('./checkout_edit_controller');
require('./checkout_service');
require('.././user/user');
require(".././products/products");
require('../.././app_service');

module.exports = angular.module("checkout", ['app.service', 'user', 'products', 'checkout.service', 'checkout.controller', 'checkoutEdit.controller'])