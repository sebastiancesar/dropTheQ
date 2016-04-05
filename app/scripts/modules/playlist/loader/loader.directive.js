(function () {
  'use strict';

  var playlistSearchBoxDirective = function () {
    return {
      restrict: 'E',
      controller: 'PlaylistSearchBoxController as vm',
      scope: {},
      templateUrl: 'scripts/modules/playlist/loader/loader.html'
    };
  };

  var searchBoxController = function ($log, playlistService) {
    var controller = this;
    angular.extend(controller, {
      loadingPlaylists: true,
      listName: '',
      playlistSelected: false,
      selectPlaylist: selectPlaylist
    });

    function selectPlaylist ($item) {
      playlistService.loadPlaylist($item)
        .then(function() {
          $log.debug('searchBoxController > selectPlaylist selected', JSON.stringify($item));
          controller.playlistLoaded = true;
        });
      }

      (function initialize () {
        playlistService.getPlaylists()
          .then(function (results) {
            controller.playlists = results;
            controller.loadingPlaylists = false;
          });
       })();

    };
    
    angular.module('altoPlaylist')
      .directive('playlistSearchBox', playlistSearchBoxDirective)
      .controller('PlaylistSearchBoxController', searchBoxController);
}());