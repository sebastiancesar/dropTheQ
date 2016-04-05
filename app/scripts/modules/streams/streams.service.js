(function() {
  'use strict';

  var streamsService = function($log, rx) {
    var service = {};
    service.streams = {};
    service.getStream = getStream;

    function getStream(streamId) {
      if (!service.streams[streamId]) {
        $log.debug('streamService > getStream > creating new Stream: ', streamId);
        service.streams[streamId] = new rx.Subject();
      }
      return service.streams[streamId];
    }

    return service;
  };

  angular.module('streams', [])
    .factory('streamsService', streamsService);

}());