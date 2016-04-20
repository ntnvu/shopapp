'use strict';

module.exports = angular.module('user.service', [])
    .service('UserService', function ($q, $localstorage) {
        var current_user = {
            name : "Linh Đỗ",
            username: "test@advn.vn",
            email : "vilma.kilback@larkin.name",
            pass : "123456",
            phone : "335-104-2542",
            address : "800, Lạc Long Quân",
            district : "Quận Tân Bình",
            ward : "Phường 10",
            city : "Hồ Chí Minh"
        };

        return {
            currentUser : current_user,

            isLogin : function(){
                var user = $localstorage.getObject("user");
                if(user.login){
                    return 1;
                }
                return 0;
            }
        }
    });