'use strict';

require('./cart_page_controller.js');
require('../.././app_service');

module.exports = angular.module("CartPage", ['app.service', 'CartPage.controller']);