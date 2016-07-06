"use strict"

module.exports = angular.module("app.service", [])
    .factory('$localstorage', function ($q, $http, $window, $ionicHistory) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },

            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },

            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },

            setNull: function (key) {
                this.setObject(key, {});
            },
            setNullAll: function () {
                $window.localStorage.clear();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
            },

            addObject: function (key, value) {
                var value = new Array(value);
                var arr = this.getObject(key);
                if (arr.length > 0) {
                    var shared = false;
                    for (var i in arr) {
                        if (arr[i].entity_id == value[0].entity_id) {
                            shared = true;
                            break;
                        }
                    }
                    if (!shared) {
                        value = value.concat(arr);
                    }
                    else {
                        value = arr;
                    }
                }
                this.setObject(key, value);
            },

            /*
             * objArrNeedUpdate : is an array need update after main array is
             * */
            removeObject: function (key, item) {
                var arr = this.getObject(key);
                for (var i in arr) {
                    if (arr[i].entity_id == item.entity_id) {
                        arr.splice(i, 1);
                        break;
                    }
                }
                this.setObject(key, arr);
            },

            mergeArray: function (arr1, arr2) {
                var arr3 = [];
                for (var i in arr1) {
                    var shared = false;
                    for (var j in arr2)
                        if (arr2[j].entity_id == arr1[i].entity_id) {
                            shared = true;
                            break;
                        }
                    if (!shared) arr3.push(arr1[i])
                }
                arr3 = arr3.concat(arr2);
                return arr3;
            },
            //input 2 array
            //return array contain all elements which are in both array and update follow arr2
            updateArray: function (arr1, arr2, key) {
                for (var i in arr1) {
                    for (var j in arr2) {
                        if (arr2[j].entity_id == arr1[i].entity_id) {

                            arr1[i][key] = arr2[j][key];
                        }
                    }
                }
            },

            addAttribute: function (key, item, index) {
                var arr = this.getObject(key);
                if (arr.length > 0) {
                    for (var i in arr) {
                        if (arr[i].entity_id == item.entity_id) {
                            arr[i][index] = item[index];
                        }
                    }
                    this.setObject(key, arr);
                }
            },

            addAttributeAll: function (key, attr, value) {
                var arr = this.getObject(key);
                if (arr.length > 0) {
                    for (var i in arr) {
                        arr[i][attr] = value;
                    }
                    this.setObject(key, arr);
                }
            },

            getKeyTime: function () {
                var deferred = $q.defer();
                var promise = deferred.promise;


                var link_ajax = "http://shop10k.vn/web_api.php?r=timespam";
                $http.get(link_ajax).then(function (resp) {
                    if (!resp.data.error) {
                        var key = resp.data.timespam + 'app';
                        var md5key = md5(key);
                        deferred.resolve(md5key);
                        console.log(encodeURIComponent(JSON.stringify([{"productid":"1873","quantity":"2"},{"productid":"1871","quantity":"2"}])));
                    }
                    else {
                        deferred.reject(resp.data.error);
                    }
                }, function (err) {
                    // err.status will contain the status code
                    console.error('ERR', err);
                    deferred.reject('ERR ' + err);
                })
                return promise;
            }
        }
    })
    .service('ControlModalService', function ($q, $ionicModal, $rootScope, $timeout, $controller) {
        return {
            show: show
        }
        function show(templeteUrl, controller, autoshow, parameters, options, wrapCalss) {
            // Grab the injector and create a new scope
            var deferred = $q.defer(),
                ctrlInstance,
                modalScope = $rootScope.$new(),
                thisScopeId = modalScope.$id,
                defaultOptions = {
                    animation: 'slide-in-up',
                    focusFirstInput: false,
                    backdropClickToClose: true,
                    hardwareBackButtonClose: true,
                    modalCallback: null
                };

            options = angular.extend({}, defaultOptions, options);

            $ionicModal.fromTemplateUrl(templeteUrl, {
                scope: modalScope,
                animation: options.animation,
                focusFirstInput: options.focusFirstInput,
                backdropClickToClose: options.backdropClickToClose,
                hardwareBackButtonClose: options.hardwareBackButtonClose
            }).then(function (modal) {
                    modalScope.modal = modal;

                    modalScope.openModal = function () {
                        modalScope.modal.show();
                    };

                    modalScope.closeModal = function (result) {
                        deferred.resolve(result);
                        modalScope.modal.hide();
                    };

                    modalScope.$on('modal.hidden', function (thisModal) {
                        if (thisModal.currentScope) {
                            var modalScopeId = thisModal.currentScope.$id;
                            if (thisScopeId === modalScopeId) {
                                deferred.resolve(null);
                                _cleanup(thisModal.currentScope);
                            }
                        }
                    });

                    // Invoke the controller
                    var locals = { '$scope': modalScope, 'parameters': parameters };
                    var ctrlEval = _evalController(controller);
                    ctrlInstance = $controller(controller, locals);
                    if (ctrlEval.isControllerAs) {
                        ctrlInstance.openModal = modalScope.openModal;
                        ctrlInstance.closeModal = modalScope.closeModal;
                    }

                    if (autoshow) {
                        modalScope.modal.show()
                            .then(function () {
                                modalScope.$broadcast('modal.afterShow', modalScope.modal);
                            });
                    }

                    if (angular.isFunction(options.modalCallback)) {
                        options.modalCallback(modal);
                    }

                }, function (err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }

        function _cleanup(scope) {
            scope.$destroy();
            if (scope.modal) {
                scope.modal.remove();
            }
        }

        function _evalController(ctrlName) {
            var result = {
                isControllerAs: false,
                controllerName: '',
                propName: ''
            };
            var fragments = (ctrlName || '').trim().split(/\s+/);
            result.isControllerAs = fragments.length === 3 && (fragments[1] || '').toLowerCase() === 'as';
            if (result.isControllerAs) {
                result.controllerName = fragments[0];
                result.propName = fragments[2];
            } else {
                result.controllerName = ctrlName;
            }

            return result;
        }
    });