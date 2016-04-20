'use strict';

require('./checkout_controller.js');
require('./checkout_edit_controller.js');
require('./checkout_service.js');
require('.././user/user.js');
require('../.././app_service');

module.exports = angular.module("checkout", ['app.service', 'checkout.service', 'user.service', 'checkout.controller', 'checkoutEdit.controller']);