'use strict';

module.exports = angular.module('user.service', [])
    .service('UserService', function ($q, $localstorage, ProductService, $rootScope, $ionicHistory, $state, $ionicLoading, $ionicPopup, $http, LoginService) {
        var current_user = {
            portrait: "img/icon.png"
        };

        return {
            currentUser: current_user,

            isLogin: function () {
                var user = $localstorage.getObject("user");
                if (user.login) {
                    for (var i in user) {
                        this.currentUser[i] = user[i];
                    }
                    return 1;
                }
                return 0;
            },

            updateUser: function (info) {
                var temp = this;
                var deferred = $q.defer();
                var promise = deferred.promise;

                for (var i in info) {
                    this.currentUser[i] = info[i];
                }

                LoginService.splitUsername(this.currentUser);

                var api_url = "http://shop10k.vn/web_api.php?r=user";

                $http.get(api_url + "&updateinfo=" + encodeURIComponent(JSON.stringify(this.currentUser)))
                    .then(function (resp) {
                        if (resp.data.changed) {
                            deferred.resolve(resp.data);
                            $localstorage.setObject("user", temp.currentUser);
                        }
                        else {
                            deferred.reject(resp.data.error);
                        }
                    }, function (err) {
                        deferred.reject('ERR ' + err);
                    })

                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }

                return promise;
            },

            getUser: function () {
                return this.currentUser;
            },

            signOut: function () {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var api_url = "http://shop10k.vn/web_api.php?r=logout";
                $http.get(api_url)
                    .then(function (resp) {
                        if (resp.data.logout) {
                            deferred.resolve(resp.data);
                        }
                        else {
                            deferred.reject(resp.data.error);
                        }
                    }, function (err) {
                        deferred.reject('ERR ' + err);
                    })


                this.currentUser = {
                    login: false,
                    portrait: "img/icon.png",
                    logoutCheckout: "logouted"
                };


                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();

                $localstorage.setNull("user");
                $localstorage.setNull("cart");
                $localstorage.setNull("wishlist");

                ProductService.setPage(1);
                ProductService.filterProduct().then(function () {
                    console.log("success")
                }, function () {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Lỗi',
                        template: 'Bạn vui lòng thử chọn lại sản phẩm'
                    });
                });

                $rootScope.$broadcast("CartUpdate");
                $rootScope.$broadcast("WishlistUpdate");
                $rootScope.$broadcast("UserLogout");

                $state.go("menu.products");
            },

            login: function (user) {
                for (var i in user) {
                    this.currentUser[i] = user[i];
                }
                this.currentUser.login = true;

                $localstorage.setObject("user", this.currentUser);

                $localstorage.setNull("cart");
                $localstorage.setNull("wishlist");

                ProductService.setPage(1);
                ProductService.filterProduct().then(function () {
                    console.log("success")
                }, function () {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Lỗi',
                        template: 'Bạn vui lòng thử chọn lại sản phẩm'
                    });
                });

                $rootScope.$broadcast("CartUpdate");
                $rootScope.$broadcast("WishlistUpdate");
                $rootScope.$broadcast("UserLogin");
            }
        }
    });