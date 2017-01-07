var browserHistory = require('react-router').browserHistory;

var dt = new  Date();
var i = 0;
var IntroApp = React.createClass({
    _createNewGame : function(){

      return $.getJSON(window.location.protocol + '//' + window.location.hostname + ":" + window.location.port + '/session/')
      .then(function(data) {
        browserHistory.push('/play/' + data.playerId);
      });
    },
    _joinGame : function(){
      return $.getJSON(window.location.protocol + '//' + window.location.hostname + ":" + window.location.port + '/session/' + this.state.joinId + '/join')
      .then(function(data) {
        browserHistory.push('/play/' + data.playerId);
      });
    },
    _retrieveGame : function(){

    },
    updateInputValue: function(evt) {
      this.setState({
        joinId: evt.target.value
      });
    },
    render: function() {
      return (
      <div>
        <div>
          <button onClick={this._createNewGame}>Create New Game</button>
          <br/>
          <br/>
          <button onClick={this._joinGame}>Join a game</button><input placeholder="gameid" type="text" onChange={this.updateInputValue}/>
        </div>
      </div>
      );
    }
});



window.IntroApp = IntroApp;
