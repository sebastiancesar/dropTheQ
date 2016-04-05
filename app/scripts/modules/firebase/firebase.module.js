(function() {

  'use strict';

  var firebaseService = function($q, fireRefUrl, $firebaseArray, $firebaseObject) {
    var service = {
      getArray: getArray,
      getObject: getObject,
      getRefFor: getRefFor,
      exists: exists,
      search: search
    };

    function getArray(path) {
      var fullPath = fireRefUrl;
      if (path) {
        fullPath = fullPath + path;
      }
      return $firebaseArray(new Firebase(fullPath));
    }

    function getObject() {
      return $firebaseObject(new Firebase(fireRefUrl));
    }

    function getRefFor(path, entity) {
      return new Firebase(fireRefUrl + path + '/' + entity);
    }

    function search(path, query) {
      var fb = new Firebase(fireRefUrl);
      return fb.child(path)
        .startAt(query)
        .limit(20);
    }

    function exists(path, entity) {
      var deferred = $q.defer();
      var usersRef = getRefFor(path, '');

      usersRef.once('value', function(snapshot) {
        deferred.resolve(snapshot.hasChild(entity));
      });

      return deferred.promise;
    }

    return service;
  };

  angular.module('firebaseUtils', [])
    .factory('firebaseService', firebaseService);

}());