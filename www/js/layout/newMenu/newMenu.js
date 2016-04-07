"use strict"
require("./newMenu_controller.js");
require("./newMenu_factory.js");

module.exports = angular.module("newMenu", ["newMenu.factory", "newMenu.controller"]);