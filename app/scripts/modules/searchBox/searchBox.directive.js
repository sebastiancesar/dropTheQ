(function() {
  'use strict';

  var SearchBoxController = function($scope, $q, $log, youtubeService, rx, streamsService) {
    var controller = this;
    controller.playlistLoaded = false;
    controller.query = '';
    controller.items = ['a', 'b'];

    // function searchTerm(term) {
    //   return rx.Observable.fromCallback(youtubeService.search)(term);
    // }

    // var searchObservable = $scope.$createObservableFunction('search')
    //   .map(function() {
    //     return controller.query;
    //   })
    //   .flatMapLatest(searchTerm)
    //   .map(function (results) {
    //     return _.map(results.items, function (item) {
    //       return item.snippet.title;
    //     });
    //   });
    
    controller.selectSearch = function (item) {
      youtubeService.search(item, function (results) {
        streamsService.getStream('searchResults')
          .onNext(results.items);        
      });
    };

    controller.searchMock = function (query) {
      var deferred = $q.defer();
      youtubeService.search(query, function (results) {
        var suggestions = results.items.map(function (item) {
          return item.snippet.title;
        });
        deferred.resolve(suggestions);
      });
      // $scope.search(query);
      // searchObservable.subscribe(function(results) {
      //   $log.debug('results', JSON.stringify(results));
      // });
      return deferred.promise;
    };
      
    streamsService.getStream('playlist')
      .subscribe(function(stream) {
        if (stream.event === 'loaded') {
          controller.playlistLoaded = true;
        }
      });

  };

  angular.module('searchBox', [])
    .controller('SearchBoxController', SearchBoxController)
    .directive('searchBox', function() {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'scripts/modules/searchBox/searchBox.html',
        controller: 'SearchBoxController as vm'
      };
    });
}());