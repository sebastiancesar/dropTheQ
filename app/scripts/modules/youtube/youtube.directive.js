(function() {
  'use strict';

  var youtubePlayerDirective = function($window, youtubePlayer, playlistService, streamsService) {
    function youtubePlayerLink(scope) {
      scope.loaded = false;
      scope.playing = false;

      streamsService.getStream('playlist')
        .subscribe(function(stream) {
          if (stream.event === 'loaded') {
            scope.loaded = true;
          }
          if (stream.event === 'playing') {
            scope.playing = true;
          }
        });

      function onload() {
        youtubePlayer.player = new YT.Player('player', {
          height: '200',
          width: '200',
          events: {
            'onReady': youtubePlayer.onPlayerReady,
            'onStateChange': youtubePlayer.onPlayerStateChange
          }
        });
      }

      var tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      $window.onYouTubeIframeAPIReady = onload;
    }

    return {
      restrict: 'E',
      scope: {},
      link: youtubePlayerLink,
      templateUrl: 'scripts/modules/youtube/youtube.directive.html'
    };
  };

  angular.module('youtube')
    .directive('youtubePlayer', youtubePlayerDirective);
}());