(function () {
  'use strict';

  var playlistService = 
    function($q, $log, streamsService, firebaseService, PlaylistFactory,
      playlistControlsService, playlistItemsService) {
    
    var service = {
        loaded: false,
        finished: false,
        getPlaylists: getPlaylists,
        loadPlaylist: loadPlaylist,
        getCurrentPlaying: getCurrentPlaying,
        setCurrentPlaying: setCurrentPlaying,
        currentPlaying: '',
        streamMode: false
      },
      playlistStream = streamsService.getStream('playlist');

    angular.extend(service, playlistControlsService(service));
    angular.extend(service, playlistItemsService(service)); 

    playlistStream.subscribe(function(stream) {
      switch (stream.event) {
        case 'playing':
          service.playing = true;
          break;
        case 'addItem':
          itemAdded();
          break;
        case 'ended':
          // If the player emit 'ended' event, the show must go on, pick up the next track
          $log.debug('ended');
          service.play();
          break;
      }
    });

    function loadPlaylist(listName) {
      return PlaylistFactory.getPlaylist(listName)
        .then(function(playlist) {
          service.playlist = playlist;
          return service.playlist.getItems()
            .then(function(items) {
              playlistLoaded(items);
            });
        });
    }

    function playlistLoaded (items) {
      $log.debug('playlistService > loadPlaylist > initialized');
      items.$watch(function() {
        update(items);
      });
      update(items);
      playlistStream.onNext({
        event: 'loaded',
        playlist: service.playlist
      });
    }

    function update(items) {
      $log.debug('playlistService > $on-value new value in playlist');
      playlistStream.onNext({
        event: 'update',
        items: items
      });
    }

    function setCurrentPlaying(item) {
        if (service.streamMode) {
          service.playlist.currentPlaying = item.$id;
          service.playlist.$save();
        } else {
          service.currentPlaying = item.$id;
        }
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

    function itemAdded () {
      // when an item is added to the playlist, and the playlist is no currently been playing, 
      // start playing from the last non-played item;
      $log.debug('item added');
      if (!service.playing) {
        service.play();
      }
    }

    return service;
  };

  angular.module('altoPlaylist')
    .factory('playlistService', playlistService);

}());