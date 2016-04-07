'use strict';

require('./checkout_controller.js');
require('../.././app_service');

module.exports = angular.module("checkout", ['app.service', 'checkout.controller']);