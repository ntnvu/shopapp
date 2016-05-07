'use strict';

module.exports = angular.module('registerLogin.services', [])
    .service('LoginService', function ($q, $http) {
        return {
            loginUser: loginUser,
            registerUser: registerUser,
            getInfo: getInfo
        }
        function getInfo(obj){
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get("http://shop10k.qrmartdemo.info/web_api.php?r=user&check=" + obj.email + "&password=" + obj.password + "&detail=true")
                .then(function (resp) {
                    if (!resp.data.error) {
                        deferred.resolve(resp.data);
                    }
                    else {
                        deferred.reject(resp.data.error);
                    }
                }, function (err) {
                    // err.status will contain the status code
                    console.error('ERR', err);
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
        }

        function registerUser(obj) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.get("http://shop10k.qrmartdemo.info/web_api.php?r=user&register=true&firstname=" + obj.name + "&lastname=" + obj.name + "&password=" + obj.password + "&email=" + obj.email)
                .then(function (resp) {
                    console.log(resp.data.error);
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

            $http.get("http://shop10k.qrmartdemo.info/web_api.php?r=user&login=" + obj.email + "&password=" + obj.password)
                .then(function (resp) {
                    if (!resp.data.EXCEPTION_INVALID_EMAIL_OR_PASSWORD) {
                        deferred.resolve('Welcome ' + name + '!');
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
        }
    });