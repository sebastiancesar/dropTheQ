(function() {

  'use strict';

  var LayoutController = function LayoutController($log, streamsService) {
    var controller = this;
    controller.playlistLoaded = false;
    streamsService.getStream('playlist')
      .subscribe(function(stream) {
        if (stream.event === 'loaded') {
          controller.playlistLoaded = true;
        }
      });
  };

  angular.module('layout', [])
    .controller('LayoutController', LayoutController)
    .config(function($urlRouterProvider, $stateProvider) {
      $urlRouterProvider.otherwise('/');

      $stateProvider.state('layout', {
        url: '/:playlistID',
        templateUrl: 'scripts/modules/layout/layout.html',
        controller: 'LayoutController as vm'
      });
    });

}());