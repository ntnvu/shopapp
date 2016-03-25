"use strict"

module.exports = angular.module("player.controller", [])
    .controller("PlayerController", ["$scope", 'DribbblePlayer',
        function ($scope, DribbblePlayer) {
            $scope.newPlayer = null; // Our model value is null by default
            $scope.players = []; // We'll start with an empty list

            // Fetches a Dribbble player and adds them to the list
            $scope.addPlayer = function (player) {
                $scope.players.push(new DribbblePlayer(player));
                $scope.newPlayer = null;
            };

            $scope.removePlayer = function (player) {
                $scope.players.splice($scope.players.indexOf(player), 1);
            };


        }]);