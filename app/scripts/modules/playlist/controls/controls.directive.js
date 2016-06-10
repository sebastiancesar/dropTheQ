(function () {
  'use strict';

  var controlsDirective = function () {
    return {
      restrict: 'E',
      controller: 'ControlsController as vm',
      scope: {},
      templateUrl: 'scripts/modules/playlist/controls.html'
    };
  };

  var controlsController = function ($log, playlistService, streamsService) {
    var controller = this;
    angular.extend(controller, {
      showControls: false,
      play: playlistService.play,
      stop: playlistService.stop,
      next: playlistService.next
    });

    streamsService.getStream('playlist')
      .subscribe(function (stream) {
        switch (stream.event) {
        case 'update':
          controller.showControls = stream.items.length > 0;
          break;
        }
      });
  };

  angular.module('altoPlaylist')
    .directive('playlistControls', controlsDirective)
    .controller('ControlsController', controlsController);

}());