'use strict';

module.exports = angular.module('checkout.service', [])
    .factory('CheckoutService', function ($q, $localstorage, CartService) {
        var checkout_info = {
            total: 0,
            grandTotal: 0,
            methodShipText: 0,
            methodShip: {}
        };

        var shipping_method = {
            "A": {
                text: "Tự lấy hàng tại cửa hàng 164 Trần Bình Trọng Q5 - HCM 0₫",
                value: 0
            },
            "B": {
                text: "Quận 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, Tân Bình, Tân Phú, Phú Nhuận, Bình Thạnh, Gò Vấp 10.000 ₫",
                value: 10000
            },
            "C": {
                text: "Quận Bình Tân, 9, 12, Thủ Đức 20.000 ₫",
                value: 20000
            },
            "D": {
                text: "Hóc Môn, Bình Chánh, Nhà Bè, Củ Chi 30.000 ₫",
                value: 30000
            },
            "E": {
                text: "Ship hàng đi các tỉnh trong nước 35.000 ₫",
                value: 35000
            }
        };

        var payment_method = {
            "A": "Cash On Delivery (thanh toán khi nhận hàng)",
            "B": "Bank Transfer Payment (chuyển qua ngân hàng)"
        };

        return {
            updateCheckoutInfo: function (info) {
                for (var i in info) {
                    checkout_info[i] = info[i];
                }
            },

            sumTotal: function () {
                checkout_info.total = CartService.sumCart();
                checkout_info.totalText = CartService.convertMoney(0, ",", ".", checkout_info.total);
                if(checkout_info.methodShip.value)
                    checkout_info.grandTotal = CartService.convertMoney(0, ",", ".",(checkout_info.total + checkout_info.methodShip.value));
                else
                    checkout_info.grandTotal = CartService.convertMoney(0, ",", ".",checkout_info.total);
            },

            addShipping: function(methodShip){
                checkout_info.methodShip = methodShip;
                checkout_info.methodShipText = CartService.convertMoney(0, ",", ".", checkout_info.methodShip.value);
                checkout_info.grandTotal = CartService.convertMoney(0, ",", ".",(checkout_info.total + checkout_info.methodShip.value));
            },

            checkoutInfo: checkout_info,

            shippingInfo: shipping_method,

            paymentInfo: payment_method
        }
    });