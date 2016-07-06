'use strict';

module.exports = angular.module('registerLogin.services', [])
    .service('LoginService', function ($q, $http, $localstorage, $ionicHistory) {
        return {
            loginUser: loginUser,
            registerUser: registerUser,
            getInfo: getInfo,
            splitUsername : splitUsername
        }
        function splitUsername(user){
            var name_obj = user.name.split(" ");
            user.firstname = name_obj[0];
            user.lastname = "";
            var last_name_arr = name_obj.slice(1);
            for (var i = 0; i < last_name_arr.length; i++) {
                user.lastname += last_name_arr[i] + " ";
            }
        }

        function getInfo(obj) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $localstorage.getKeyTime().then(
                function (md5key) {
                    $http.get("http://shop10k.vn/web_api.php?r=user&check=" + obj.email + "&password=" + obj.password + "&detail=true" + "&key=" + md5key)
                        .then(function (resp) {
                            if (!resp.data.error) {
                                deferred.resolve(resp.data);
                            }
                            else {
                                deferred.reject(resp.data.error);
                            }
                        }, function (err) {
                            deferred.reject('ERR ' + err);
                        })
                },
                function () {
                    deferred.reject("wrong key");
                }
            );

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }

            return promise;
        }

        function registerUser(obj) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            this.splitUsername(obj);

            $localstorage.getKeyTime().then(
                function (md5key) {
                    $http.get("http://shop10k.vn/web_api.php?r=user&register=true&firstname=" + obj.firstname + "&lastname=" + obj.lastname + "&password=" + obj.password + "&email=" + obj.email + "&key=" + md5key)
                        .then(function (resp) {
                            if (!resp.data.error) {
                                deferred.resolve();
                            }
                            else {
                                console.log(resp.data.error);
                                deferred.reject(resp.data.error);
                            }
                        }, function (err) {
                            // err.status will contain the status code
                            console.error('ERR', err);
                            deferred.reject('ERR ' + err);
                        })
                },
                function () {
                    deferred.reject("wrong key");
                }
            )

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }

            return promise;
        }

        function loginUser(obj) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $localstorage.getKeyTime().then(
                function (md5key) {
                    $http.get("http://shop10k.vn/web_api.php?r=user&login=" + obj.email + "&password=" + obj.password + "&key=" + md5key)
                        .then(function (resp) {
                            $ionicHistory.clearHistory();
                            $ionicHistory.clearCache();
                            if (!resp.data.EXCEPTION_INVALID_EMAIL_OR_PASSWORD) {
                                deferred.resolve('Welcome ' + name + '!');
                            }
                            else {
                                deferred.reject(resp.data.error);
                            }
                        }, function (err) {
                            deferred.reject('ERR ' + err);
                        })
                },
                function () {
                    deferred.reject("wrong key");
                }
            )
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    });