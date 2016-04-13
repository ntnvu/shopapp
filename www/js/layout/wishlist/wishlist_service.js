'use strict';

module.exports = angular.module('wishlist.service', [])
    .service('WishlistService', function ($q, $localstorage) {
        return {
            addWishlist : function(item){                
                if(!item.like){
                    item.like = !item.like;
                    $localstorage.addObject("wishlist", item);
                }
                else{
                    this.removeWishlist(item);
                }
            },
            removeWishlist : function(item){
                item.like = !item.like;
                $localstorage.removeObject("wishlist", item, "cart");
            }
        }
    });