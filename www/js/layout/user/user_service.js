'use strict';

module.exports = angular.module('user.service', [])
    .service('UserService', function ($q, $localstorage, ProductService, $rootScope, $ionicHistory, $state) {
        var current_user = {
            portrait: "img/portrait.jpg"
        };

        return {
            currentUser : current_user,

            isLogin : function(){
                var user = $localstorage.getObject("user");
                if(user.login){
                    this.updateUser(user);
                    return 1;
                }
                return 0;
            },

            updateUser : function(info){
                for(var i in info){
                    this.currentUser[i] = info[i];
                }
            },

            getUser : function(){
                return this.currentUser;
            },

            signOut : function(){
                this.currentUser = {
                    login: false,
                    portrait: "img/portrait.jpg",
                    logoutCheckout: "logouted"
                };

                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();

                $localstorage.setNull("user");
                $localstorage.setNull("cart");
                $localstorage.setNull("wishlist");
                ProductService.setPage(1);
                ProductService.filterProduct();
                $rootScope.$broadcast("CartUpdate");
                $rootScope.$broadcast("WishlistUpdate");
                $rootScope.$broadcast("UserLogout");

                $state.go("menu.products");
            },

            login : function(user){
                for(var i in user){
                    this.currentUser[i] = user[i];
                }
                this.currentUser.login = true;

                $localstorage.setObject("user", this.currentUser);

                $localstorage.setNull("cart");
                $localstorage.setNull("wishlist");
                ProductService.setPage(1);
                ProductService.filterProduct();
                $rootScope.$broadcast("CartUpdate");
                $rootScope.$broadcast("WishlistUpdate");
                $rootScope.$broadcast("UserLogin");
            }
        }
    });