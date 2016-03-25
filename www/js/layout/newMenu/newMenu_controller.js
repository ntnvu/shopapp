"use strict"

module.exports = angular.module("newMenu.controller", ["newMenu.factory"])
    .controller("NewmenuController", ['$scope', '$ionicSideMenuDelegate', 'Movies',
        function($scope, $ionicSideMenuDelegate, Movies) {
            $scope.sorting = [{score: 9, name : 'Score more then 9'},
                {score: 8, name : 'Score more then 8'},
                {score: 7, name : 'Score more then 7'},
                {score: 6, name : 'Score more then 6'},
                {score: 5, name : 'Score more then 5'},
                {score: 4, name : 'Score more then 4'},
                {score: 3, name : 'Score more then 3'},
                {score: 2, name : 'Score more then 2'},
                {score: 1, name : 'Score more then 1'},
                {score: 0, name : 'Show me every movie'}];

            $scope.selected = {
                score : 0,
                movieName : 'Batman'
            }

            $scope.openMenu = function () {
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.greaterThan = function(fieldName){
                return function(item){
                    return item[fieldName] > $scope.selected.score;
                }
            }

            $scope.searchMovieDB = function() {

                Movies.list($scope.selected.movieName, function(movies) {
                    $scope.movies = movies;
                });

            };

            $scope.searchMovieDB();
        }
    ]);
