'use strict';

(function () {

  'use strict';

  var PlaylistItemComponent = React.createClass({
    displayName: 'PlaylistItemComponent',

    removeItem: function removeItem() {
      this.props.removeItem(this.props.item);
    },
    selectItem: function selectItem() {
      this.props.selectItem(this.props.item);
    },
    render: function render() {
      var liClassNames = 'list-group-item',
          item = this.props.item;
      liClassNames = this.props.currentPlaying === item.$id ? liClassNames + ' playing' : liClassNames;
      return React.createElement(
        'li',
        { className: liClassNames },
        React.createElement(
          'a',
          { className: 'btn btn-warning btn-xs pull-right',
            role: 'button',
            onClick: this.removeItem },
          'x'
        ),
        React.createElement(
          'a',
          { className: 'pull-left thumb-sm margin-right' },
          React.createElement('img', { src: item.snippet.thumbnails.medium.url })
        ),
        React.createElement(
          'a',
          { href: '', onClick: this.selectItem },
          React.createElement(
            'span',
            { 'class': 'text-ellipsis small item-title' },
            ' ',
            item.snippet.title
          )
        )
      );
    }
  });

  var PlaylistComponent = function PlaylistComponent($log, streamsService, playlistService) {
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

  PlaylistComponent.$inect = ['$log', 'streamsService'];

  var playlistComponentDirective = function playlistComponentDirective(reactDirective, PlaylistComponent) {
    return reactDirective(PlaylistComponent);
  };

  angular.module('altoPlaylist').factory('PlaylistComponent', PlaylistComponent).directive('playlistComponentDirective', playlistComponentDirective);
})();
//# sourceMappingURL=playlist.component.js.map
