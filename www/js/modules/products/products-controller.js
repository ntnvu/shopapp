'use strict';

function ProductsController($scope, $http, $ionicModal) {
    var link_ajax = "http://liquordelivery.com.sg/wp-admin/admin-ajax.php";
//    $http.get(link_ajax + "?action=latest_products_app").then(function (resp) {
//        console.log('Success', resp);
//        $scope.products = resp.data;
//        // For JSON responses, resp.data contains the result
//    }, function (err) {
//        console.error('ERR', err);
//        // err.status will contain the status code
//    })

    $scope.products = [
        {"id": 725, "img": "http://liquordelivery.com.sg/wp-content/uploads/2016/03/BN-001724-Blue-Nun-Merlot-0 .75L-13Alc.jpg"},
        {"id": 724, "img": "http://liquordelivery.com.sg/wp-content/uploads/2016/03/BN-000001-Blue-Nun-Riesling-Wine-0 .75L-Copy.jpg"},
        {"id": 723, "img": "http://liquordelivery.com.sg/wp-content/uploads/2016/03/BN-000009-Medinet-Rouge-Sauvignon-Blanc-White-Wine-1L-1 .jpg"},
        {"id": 721, "img": "http://liquordelivery.com.sg/wp-content/uploads/2016/03/BN-000009-Medinet-Rouge-Sauvignon-Blanc-White-Wine-0 .25L-Copy.jpg"},
        {"id": 720, "img": "http://liquordelivery.com.sg/wp-content/uploads/2016/03/BN-000006-Medinet-Rouge-Cabernet-Sauvignon-Red-Wine-0 .25L-Copy.jpg"},
        {"id": 719, "img": "http://liquordelivery.com.sg/wp-content/uploads/2016/03/BN-Medinet-Rose-Wine-0 .25L-11.5Alc.jpg"}
    ]

    $ionicModal.fromTemplateUrl('js/modules/products/productOptionPopup.html', {
        scope: $scope
    }).then(function(modal) {
            $scope.modalProductOpt = modal;
        });

    $scope.chooseProductOption = function(item){
        $scope.modalProductOpt.show();
    }

    $scope.closeProductOptionPopup = function(){
        console.log("bbbbbbbbbb");
        $scope.modalProductOpt.hide();
    }
    $scope.addToCart = function(){
        console.log("aaaa");
    }
}

module.exports = ['$scope', '$http', '$ionicModal', ProductsController];