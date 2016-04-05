'use strict';

/**
 * @ngdoc overview
 * @name droptheQApp
 * @description
 * # droptheQApp
 *
 * Main module of the application.
 */
angular
    .module('droptheQApp', [
          'ui.router',
          'ui.bootstrap',
          'firebaseUtils',
          'layout',
          'searchResultsModule',
          'searchBox',
          'youtube',
          'firebase',
          'rx',
          'streams',
          'altoPlaylist'
    ])
    .constant('fireRefUrl', 'https://blistering-inferno-2503.firebaseio.com/');