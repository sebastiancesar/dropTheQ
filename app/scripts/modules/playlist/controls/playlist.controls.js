(function() {
  'use strict';
  
  var playlistControlsService = function ($log, streamsService) {
    return function (playlistService) {
      var service = {
          play: play,
          playItem: playItem,
          stop: stop,
          next: next },
        playlistStream = streamsService.getStream('playlist');

      function updatePlaying (item) {
        playlistStream.onNext({
          event: 'play',
          item: item
        });
        playlistService.setCurrentPlaying(item);
      }

      function playItem (selectedItem) {
        updatePlaying(selectedItem);
      }

      function play() {
        playlistService.getNext()
          .then(function(nextItem) {
            updatePlaying(nextItem);
          })
          .catch(function (reason) {
            if (reason.finished) {
              $log.debug('playlistControls > play > No more items on playlist.');
              playlistService.playing = false;
            }
          });
      }

      function stop() {
        playlistStream.onNext({
          event: 'stop',
          item: {}
        });
      }

      function next() {
        play();
      }
      
      return service;
    };
  };

  angular.module('altoPlaylist')
    .factory('playlistControlsService', playlistControlsService);
  
}());