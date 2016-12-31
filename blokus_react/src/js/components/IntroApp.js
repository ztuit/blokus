var browserHistory = require('react-router').browserHistory;

var dt = new  Date();
var i = 0;
var IntroApp = React.createClass({
    _createNewGame : function(){

      return $.getJSON('http://localhost:8080/session')
      .then(function(data) {
        browserHistory.push('/play/' + data.gameId + "/" + data.playerId);
      });
    },
    render: function() {
      return (
      <div>
        <div>
          <button onClick={this._createNewGame}>Create New Game</button>
          <br/>
          <br/>
          <button>Join a game</button><input placeholder="gameid" type="text"/>
        </div>
      </div>
      );
    }
});



window.IntroApp = IntroApp;
