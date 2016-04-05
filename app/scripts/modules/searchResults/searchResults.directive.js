(function () {
	'use strict';

	var SearchResultsController = function ($log, streamsService, playlistService) {
		var controller = this;
		controller.updateResults = updateResults;
		controller.addItem = addItem;
    controller.results = [];

		function addItem (item) {
      $log.debug('SearchResultsController > addItem');
      playlistService.addItem(item);
		}

		function updateResults (items) {
			controller.results = items;
		}

    streamsService.getStream('searchResults')
      .subscribe(function (results) {
        updateResults(results);
      });
	};

	angular.module('searchResultsModule', [])
		.controller('SearchResultsController', SearchResultsController)
		.directive('searchResults', function () {
			return {
				restrict: 'E',
        scope: {},
				templateUrl: 'scripts/modules/searchResults/searchResults.html',
				controller: 'SearchResultsController as vm'
			};
		});

}());
