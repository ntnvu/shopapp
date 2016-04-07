'use strict';

module.exports = angular.module('wishlist.service', [])
    .service('WishlistService', function ($q, $localstorage) {
        function exitsInArray(obj, array){
            var temp = 0;
            $.each(array, function(i){
                if(array[i].id === obj.id) {
                    temp = i;
                    return false;
                }
            });
            return temp;
        }

        function removeObj(obj, array){
            var temp = exitsInArray(obj, array);
            if(temp){
                array.splice(temp,1);
            }
            return temp;
        }
        return {
            addWishlist : function(item){
                item.like = !item.like;
                var wishlist_temp = $localstorage.getObject("wishlist");
                var temp = removeObj(item, wishlist_temp);
                var wishlist = [];
                if(!temp){
                    wishlist = wishlist.concat(item, wishlist_temp);
                }
                else{
                    wishlist = wishlist_temp;
                }
                $localstorage.setObject("wishlist", wishlist);
            }
        }
    });