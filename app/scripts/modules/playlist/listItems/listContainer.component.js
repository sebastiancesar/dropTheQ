'use strict';

(function () {
  'use strict';

  var PlaylistComponent = function PlaylistComponent($log, streamsService, playlistService, PlaylistItemComponent) {
    var playlistStream = streamsService.getStream('playlist');

    return React.createClass({
      playlistHandle: function playlistHandle(stream) {
        function updatedPlaylistState(stream) {
          return {
            items: stream.items,
            playlistLoaded: true,
            playlistName: playlistService.playlist.getName(),
            currentPlaying: playlistService.getCurrentPlaying()
          };
        }
        switch (stream.event) {
          case 'update':
            $log.debug('PlaylistComponent > playlist updated');
            this.setState(updatedPlaylistState(stream));
            break;
          case 'playing':
            $log.debug('PlaylistComponent > playing updated');
            this.setState({ currentPlaying: playlistService.getCurrentPlaying() });
        }
      },
      componentWillMount: function componentWillMount() {
        $log.debug('PlaylistComponent > subscribing to playlistStream');
        playlistStream.subscribe(this.playlistHandle);
      },
      getInitialState: function getInitialState() {
        return { playlistLoaded: false, items: [], currentPlaying: -1 };
      },
      getPlaylistItems: function getPlaylistItems() {
        var currentPlaying = this.state.currentPlaying,
            items = this.state.items.map(function (item) {
          return React.createElement(PlaylistItemComponent, {
            key: item.$id,
            item: item,
            removeItem: playlistService.removeItem,
            selectItem: playlistService.playItem,
            currentPlaying: currentPlaying });
        });
        return items;
      },
      render: function render() {
        var clasess = 'playlist items_container';
        clasess = this.state.playlistLoaded ? clasess : clasess + ' hide';

        return React.createElement(
          'div',
          { className: clasess },
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'ul',
              { className: 'list-group' },
              React.createElement(
                'li',
                { key: '-1', className: 'list-group-item text-center' },
                React.createElement(
                  'span',
                  { className: 'text-medium' },
                  this.state.playlistName
                )
              ),
              this.getPlaylistItems()
            )
          )
        );
      }
    });
  };

  PlaylistComponent.$inect = ['$log', 'streamsService', 'PlaylistItemComponent'];

  var playlistComponentDirective = function playlistComponentDirective(reactDirective, PlaylistComponent) {
    return reactDirective(PlaylistComponent);
  };

  angular.module('altoPlaylist').factory('PlaylistComponent', PlaylistComponent).directive('playlistComponentDirective', playlistComponentDirective);
})();
//# sourceMappingURL=listContainer.component.js.map
