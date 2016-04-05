(function() {
  'use strict';

  var playlistItemsService = function ($log, $q, streamsService) {
    return function (playlistService) {
      var service = {
        removeItem: removeItem,
        addItem: addItem,
        getNext: getNext
      };
      var playlistStream = streamsService.getStream('playlist');

      function removeItem(item) {
        $log.debug('playlistService > removeItem', JSON.stringify(item));
        playlistService.playlist.removeItem(item);
      }

      function addItem(item) {
        $log.debug('playlistService > addItem');
        playlistService.playlist.addItem(item)
          .then(function () {
            playlistStream.onNext({
              event: 'addItem',
              item: item
            });    
          });
      }

      function getNext() {
        // return next item in the playlist
        return playlistService.playlist.getItemsLength()
          .then(function(size) {
            var nextIndex = 0;
            return playlistService.playlist.getIndexByItem(playlistService.getCurrentPlaying())
              .then(function(index) {
                nextIndex = index + 1;
                if (nextIndex === size) {
                  playlistService.stop();
                  return $q.reject({finished: true});
                } else {
                  return playlistService.playlist.getItemByIndex(nextIndex);
                }
              });
          });
      }
      return service;
    };
  };
  
  angular.module('altoPlaylist')
    .factory('playlistItemsService', playlistItemsService);

}());