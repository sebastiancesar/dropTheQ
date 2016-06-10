(function () {
  'use strict';

  var PlaylistComponent = function ($log, streamsService, playlistService, PlaylistItemComponent) {
    var playlistStream = streamsService.getStream('playlist');

    return React.createClass({
      playlistHandle: function (stream) {
        function updatedPlaylistState (stream) {
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
          this.setState({currentPlaying: playlistService.getCurrentPlaying()});
        }
      },
      componentWillMount: function () {
        $log.debug('PlaylistComponent > subscribing to playlistStream');
        playlistStream.subscribe(this.playlistHandle);
      },
      getInitialState: function () {
        return {playlistLoaded: false, items: [], currentPlaying: -1};
      },
      getPlaylistItems: function () {
        var currentPlaying = this.state.currentPlaying,
          items = this.state.items.map(function (item) {
            return (
              <PlaylistItemComponent 
                key={item.$id} 
                item={item}
                removeItem={playlistService.removeItem}
                selectItem={playlistService.playItem}
                currentPlaying={currentPlaying} />
            );
          });
        return items;
      },
      render: function () {
        var clasess = 'playlist items_container';
        clasess = this.state.playlistLoaded ? clasess: clasess + ' hide';

        return (
          <div className={clasess}> 
            <div className="row">
              <ul className="list-group">
                <li key="-1" className="list-group-item text-center">
                  <span className="text-medium">{this.state.playlistName}</span>
                </li>
                {this.getPlaylistItems()}
              </ul>
            </div>
          </div>);
      }
    });
  };

  PlaylistComponent.$inect = ['$log', 'streamsService', 'PlaylistItemComponent'];

  var playlistComponentDirective = function (reactDirective, PlaylistComponent) {
    return reactDirective(PlaylistComponent);
  };

  angular.module('altoPlaylist')
    .factory('PlaylistComponent', PlaylistComponent)
    .directive('playlistComponentDirective', playlistComponentDirective);
    
}());