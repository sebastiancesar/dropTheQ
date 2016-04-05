(function() {

  'use strict';

  function Item(youtubeItem) {
    this.item = youtubeItem;
  }

  Item.prototype.getTitle = function() {
    return this.item.snippet.title;
  };

  var youtubePlayer = function($log, streamsService, $window) {
    var service = {};
    service.initialize = initialize;
    service.currentPlaying = {};
    service.onPlayerStateChange = onPlayerStateChange;

    var playlistStream = streamsService.getStream('playlist');

    function onPlayerStateChange(event) {
      $log.debug('youtubePlayer > onStateChange', event.data);
      switch (event.data) {
        case YT.PlayerState.PLAYING:
          playlistStream.onNext({
            event: 'playing',
            data: service.currentPlaying
          });
          break;
        case YT.PlayerState.ENDED:
          playlistStream.onNext({
            event: 'ended'
          });
          break;
      }
    }

    function play(item) {
      service.player.loadVideoById(item.id.videoId);
      service.currentPlaying = new Item(item);
    }

    function stop() {
      service.player.stopVideo();
      service.currentPlaying = {};
    }

    playlistStream.subscribe(function(stream) {
      switch (stream.event) {
        case 'play':
          play(stream.item);
          break;
        case 'stop':
          stop();
          break;
      }
    });

    function initialize() {
      var tag = document.createElement('script');

      tag.src = 'https://www.youtube.com/iframe_api';
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      $window.onYouTubeIframeAPIReady = onload;
    }

    return service;
  };

  var youtubeService = function($log, $http) {
    var service = {},
      urlBase = 'https://www.googleapis.com/youtube/v3/search?',
      apiKey = 'AIzaSyB2zrG1ygu5J4_aXx9KAqbeTIFI0vsrdE0',
      searchVideoData = {
        part: 'snippet',
        type: 'video',
        maxResults: 20,
        key: apiKey
      };

    function encodeQueryData(data) {
      var ret = [];
      for (var d in data) {
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
      }
      return ret.join('&');
    }

    service.search = function(query, callback) {
      var queryData = {
        q: query
      };
      angular.extend(queryData, searchVideoData);
      var data = encodeQueryData(queryData);
      var url = urlBase + data;
      return service.sendRequest(url, callback);
    };

    service.sendRequest = function(url, callback) {
  
      return $http.get(url)
        .success(function(data) {
          callback(data);
        })
        .error(function(error) {
          console.error(error);
        });
    };
    return service;
  };

  angular.module('youtube', [])
    .factory('youtubePlayer', youtubePlayer)
    .factory('youtubeService', youtubeService);
}());