'use strict';

module.exports = angular.module('registerLogin.services', [])
    .service('LoginService', function ($q) {
        return {
            loginUser: loginUser,
            registerUser : registerUser
        }

        function registerUser(){
            var deferred = $q.defer();
            var promise = deferred.promise;

            var a = 0;
            if(a){
                deferred.resolve("hihi");
            }
            else{
                deferred.reject("huhu");
            }
            promise.success = function(fn){
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn){
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }

        function loginUser(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            if (name == 'test@advn.vn' && pw == '123456') {
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
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