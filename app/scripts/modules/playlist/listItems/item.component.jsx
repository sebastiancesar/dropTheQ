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

  angular.module('altoPlaylist')
    .value('PlaylistItemComponent', PlaylistItemComponent);

}());
  