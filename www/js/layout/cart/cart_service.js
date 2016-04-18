'use strict';

module.exports = angular.module('cart.services', [])
    .service('CartService', function ($q, $localstorage, $rootScope) {
        return {
            addCart : function(item){
                if(!item.added){
                    item.added = !item.added;
                    $localstorage.addObject("cart", item);
                    $rootScope.$broadcast("CartUpdate");
                }
                else{
                    this.removeCart(item);
                }
            },
            removeCart : function(item){
                item.added = !item.added;
                $localstorage.removeObject("cart", item, "wishlist");
                $rootScope.$broadcast("CartUpdate");
            }
        }
    });