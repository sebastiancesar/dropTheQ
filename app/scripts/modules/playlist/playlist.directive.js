(function() {
  'use strict';

  var playlistDirective = function() {
    return {
      restrict: 'E',
      controller: 'PlaylistController as vm',
      scope: {},
      templateUrl: 'scripts/modules/playlist/playlist.html'
    };
  };

  var playlistController =
    function($log, $scope, playlistService, streamsService) {
      var controller = this;
      angular.extend(controller, {
        playlistLoaded: false,
        currentPlaying: '',
        removeItem: playlistService.removeItem,
        selectItem: selectItem,
        items: []
      });

      function selectItem (item) {
        playlistService.playItem(item);
      }

      function updateItems(items) {
        $log.debug('PlalistController > updateItem ', JSON.stringify(items));
        controller.items = items;
      }

      function playing() {
        $scope.$apply(function() {
          $log.debug('playing now ', playlistService.getCurrentPlaying());
          controller.currentPlaying = playlistService.getCurrentPlaying();
        });
      }

      streamsService.getStream('playlist')
        .subscribe(function(stream) {
          switch (stream.event) {
          case 'update':
            $log.debug('playlistController > playlist updated');
            updateItems(stream.items);
            controller.playlistLoaded = true;
            controller.playlistName = playlistService.playlist.getName();
            break;
          case 'playing':
            $log.debug('playlistController > playing');
            playing(stream.data);
            break;
          }
        });
    };

  angular.module('altoPlaylist')
    .directive('playlist', playlistDirective)
    .controller('PlaylistController', playlistController);
}());