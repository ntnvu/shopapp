'use strict';

module.exports = angular.module('cart.services', [])
    .service('CartService', function ($q, $localstorage) {
        return {
            addCart : function(item){
                item.added = !item.added;
                $localstorage.addObject("cart", item);
            },
            removeCart : function(item){
                item.added = !item.added;
                $localstorage.removeObject("cart", item, "wishlist");
            }
        }
    });