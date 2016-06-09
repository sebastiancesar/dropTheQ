(function () {
    
  'use strict';

  var PlaylistItemComponent = React.createClass({
    removeItem: function () {
      this.props.removeItem(this.props.item);
    },
    selectItem: function () {
      this.props.selectItem(this.props.item);
    },
    render: function () {
      var liClassNames = 'list-group-item',
        item = this.props.item;
      liClassNames = this.props.currentPlaying === item.$id ? liClassNames + ' playing': liClassNames;
      return (
        <li className={liClassNames}>
          <a className="btn btn-warning btn-xs pull-right"
            role="button"
            onClick={this.removeItem}>
              x
          </a>
          <a className="pull-left thumb-sm margin-right">
            <img src={item.snippet.thumbnails.medium.url}/>    
          </a>
          <a href="" onClick={this.selectItem}>
              <span class="text-ellipsis small item-title"> {item.snippet.title}</span>
          </a>
        </li>);
    }
  });

  var PlaylistComponent = function ($log, streamsService, playlistService) {
    var playlistStream = streamsService.getStream('playlist');

    return React.createClass({
      playlistHandle: function (stream) {
        function updatedPlaylistState (stream) {
          return {
            items: stream.items,
            playlistLoaded: true,
            playlistName: playlistService.playlist.getName()
          };
        }
        switch (stream.event) {
        case 'update':
          $log.debug('playlistController > playlist updated');
          this.setState(updatedPlaylistState(stream));
          break;
        }
      },
      componentWillMount: function () {
        $log.debug('PlaylistComponent > subscribing to playlistStream');
        playlistStream.subscribe(this.playlistHandle);
      },
      getInitialState: function () {
        return {playlistLoaded: false, items: []};
      },
      getPlaylistItems: function () {
        var items = this.state.items.map(function (item) {
          return (
            <PlaylistItemComponent 
              key={item.$id} 
              item={item}
              removeItem={playlistService.removeItem}
              selectItem={playlistService.playItem} />
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

  PlaylistComponent.$inect = ['$log', 'streamsService'];

  var playlistComponentDirective = function (reactDirective, PlaylistComponent) {
    return reactDirective(PlaylistComponent);
  };

  angular.module('altoPlaylist')
    .factory('PlaylistComponent', PlaylistComponent)
    .directive('playlistComponentDirective', playlistComponentDirective);
}());