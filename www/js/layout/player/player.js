"use strict"

require("./player_controller");
require("./player_factory");

module.exports = angular.module("player",["player.factory", "player.controller"]);
