'use strict';
require('./home_controller');
require('../.././app_service');

module.exports = angular.module('home', ['app.service', "home.controller"]);

