'use strict';

require('./user_service.js');
require('./user_controller.js');
require('../.././app_service');

module.exports = angular.module("user", ['app.service', 'user.service', 'user.controller']);