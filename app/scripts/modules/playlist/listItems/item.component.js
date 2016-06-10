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

  angular.module('altoPlaylist').value('PlaylistItemComponent', PlaylistItemComponent);
})();
//# sourceMappingURL=item.component.js.map
