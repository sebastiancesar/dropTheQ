(function() {
  'use strict';

  var playlistService = function($q, $log, streamsService, firebaseService, PlaylistFactory) {
    var service = {
      loaded: false,
      play: play,
      removeItem: removeItem,
      addItem: addItem,
      stop: stop,
      next: next,
      getPlaylists: getPlaylists,
      loadPlaylist: loadPlaylist,
      getCurrentPlaying: getCurrentPlaying,
      currentPlaying: '',
      streamMode: false
    };

    var playlistStream = streamsService.getStream('playlist');

    function update(items) {
      $log.debug('playlistService > $on-value new value in playlist');
      playlistStream.onNext({
        event: 'update',
        items: items
      });
    }

    function getCurrentPlaying() {
      // return current item playing based on if it's in stream mode. 
      // In streamMode we use the currentPlaying attribute from PlaylistModel firebaseObject
      // to keep it syncrhonized. In streamMode = false , we use a local reference for current playing attribute.
      if (service.streamMode) {
        return service.playlist.currentPlaying;
      } else {
        return service.currentPlaying;
      }

    }

    function setCurrentPlaying(item) {
      if (service.streamMode) {
        service.playlist.currentPlaying = item.$id;
        service.playlist.$save();
      } else {
        service.currentPlaying = item.$id;
      }
    }

    function getPlaylists() {
      var deferred = $q.defer();
      // get all playlist to the client for searching
      firebaseService.getRefFor('playlist', '')
        .on('value', function(dataSnapshot) {
          if (!dataSnapshot.val()) {
            deferred.resolve([]);
          } else {
            deferred.resolve(Object.keys(dataSnapshot.val()));
          }
        });

      return deferred.promise;
    }

    function loadPlaylist(listName) {
      return PlaylistFactory.getPlaylist(listName)
        .then(function(playlist) {
          service.playlist = playlist;
          return service.playlist.getItems()
            .then(function(items) {
              $log.debug('playlistService > loadPlaylist > initialized');
              items.$watch(function() {
                update(items);
              });
              update(items);
              playlistStream.onNext({
                event: 'loaded',
                playlist: service.playlist
              });
            });
        });
    }

    function removeItem(item) {
      $log.debug('playlistService > removeItem ', JSON.stringify(item));
      service.playlist.removeItem(item);
    }

    function addItem(item) {
      $log.debug('playlistService > addItem');
      service.playlist.addItem(item);
      playlistStream.onNext({
        event: 'addItem',
        item: item
      });
    }

    function getNext() {
      return service.playlist.getItemsLength()
        .then(function(size) {
          var nextIndex = 0;
          return service.playlist.getIndexByItem(getCurrentPlaying())
            .then(function(index) {
              nextIndex = index + 1;
              if (nextIndex === size) {
                stop();
                return $q.reject('reach the end of the playlist');
              } else {
                return service.playlist.getItemByIndex(nextIndex);
              }
            })
            .then(function(item) {
              setCurrentPlaying(item);
              return item;
            });
        });
    }

    function play() {
      getNext()
        .then(function(nextItem) {
          playlistStream.onNext({
            event: 'play',
            item: nextItem
          });
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

    function playLastAdded (item) {
      // check if the playlist has already finished and then play the last item added.
      
    }

    playlistStream.subscribe(function(stream) {
      switch (stream.event) {
        case 'addItem':
          $log.debug('item added');
          playLastAdded(stream.item);
          break;
        case 'ended':
          // If the player emit 'ended' event, the show must go on, pick up the next track
          $log.debug('ended');
          play();
          break;
      }
    });

    return service;
  };

  angular.module('altoPlaylist')
    .factory('playlistService', playlistService);

}());