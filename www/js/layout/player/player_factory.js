"use strict"

module.exports = angular.module("player.factory", [])
    .factory("DribbblePlayer", function ($http) {
        // Define the DribbblePlayer function
        var DribbblePlayer = function (player) {
            this.initialize = function(){
                var url = 'http://api.dribbble.com/players/' + player + '?callback=JSON_CALLBACK';
                var playerData = $http.jsonp(url);
                var self = this;

                // When our $http promise resolves
                // Use angular.extend to extend 'this'
                // with the properties of the response
                playerData.then(function(response) {
                    angular.extend(self, response.data);
                });
            }
            this.initialize();
            this.likeScore = function (player) {
                return this.likes_received_count - this.likes_count;
            };

            this.commentScore = function (player) {
                return this.comments_received_count - this.comments_count;
            };
        };

        // Return a reference to the function
        return (DribbblePlayer);
    });