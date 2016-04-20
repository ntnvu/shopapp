'use strict';

module.exports = angular.module('checkout.service', [])
    .factory('CheckoutService', function ($q) {
        var checkout_info = {};
        var shipping_method = {
            "A" : "Tự lấy hàng tại cửa hàng 164 Trần Bình Trọng Q5 - HCM 0₫",
            "B" : "Quận 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, Tân Bình, Tân Phú, Phú Nhuận, Bình Thạnh, Gò Vấp 10.000 ₫",
            "C" : "Quận Bình Tân, 9, 12, Thủ Đức 20.000 ₫",
            "D" : "Hóc Môn, Bình Chánh, Nhà Bè, Củ Chi 30.000 ₫",
            "E" : "Ship hàng đi các tỉnh trong nước 35.000 ₫"
        };

        return {
            updateCheckoutInfo : function(info){

                for(var i in info){
                    checkout_info[i] = info[i];
                }

                console.log(checkout_info);
            },

            checkoutInfo : checkout_info,

            shippingInfo : shipping_method
        }
    });