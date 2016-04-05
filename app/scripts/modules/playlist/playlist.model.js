(function () {
    'use strict';

    var PlaylistModel = function ($q, $log, $firebaseObject, $firebaseArray) {

        return $firebaseObject.$extend({
            getItems: function () {
                // return firebaseArray each time is requested. In theory, is cheap to create a ref in firebase.
                // The array behavior is desired to manage the playlist items, because the order. 
                // If we don't create a firebaseArray each time, we will get an play javascript array 
                // because once the Playlist model is saved, it will see the firebaseArray like an array and 
                // it will persisted like a plain array.

                var deferred = $q.defer();
                $firebaseArray(this.$ref().child('items')).$loaded(function (items) {
                    deferred.resolve(items);
                });
    
                return deferred.promise;
            },
            addItem: function (item) {
                return this.getItems()
                    .then(function (items) {
                        return items.$add(angular.copy(item));
                    });
            },
            removeItem: function (item) {
                this.getItems().then(function (items) {
                    var index = items.$indexFor(item.$id);
                    if (index >= 0) {
                        items.$remove(index);
                    }
                });
            },
            getName: function () {
                return this.$id;
            },
            getIndexByItem: function (itemId) {
                return this.getItems().then(function (items) {
                    if (!itemId) { return -1; }
                    return items.$indexFor(itemId);    
                });
            },
            getItemByIndex: function (index) {
                return this.getItems()
                    .then(function (items) {
                        var key = items.$keyAt(index);
                        return items.$getRecord(key);
                    });
            },
            getItemsLength: function () {
                return this.getItems()
                    .then(function (items){
                        return items.length;
                    });
            }
        });
    };

    var PlaylistFactory = function ($q, PlaylistModel, firebaseService) {
        var service = {};
        service.getPlaylist = getPlaylist;

        function initializeModel (model) {
            model.currentIndex = -1;
        }

        function getPlaylist (playlistName) {
            var deferred = $q.defer();
            var ref = firebaseService.getRefFor('playlist', playlistName);
            var model = new PlaylistModel(ref);

            firebaseService.exists('playlist', playlistName)
                .then(function (exists) {
                    if (!exists) {
                        initializeModel(model);
                        model.$save()
                            .then(function () {
                                deferred.resolve(model);
                            });
                    } else {
                        deferred.resolve(model);
                    }
                });
            return deferred.promise;
        }

        return service;
    };

    angular.module('altoPlaylist')
        .factory('PlaylistModel', PlaylistModel)
        .factory('PlaylistFactory', PlaylistFactory);

}());
