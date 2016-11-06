var React = require('react');
var ReactDOM = require('react-dom');
require('babel-core');
require('./player');
require('./board-table');
require('../services/SessionProvider');

var dt = new  Date();

var BlokusApp = React.createClass({
    getInitialState: function() {
      return {session:SessionProvider.createNewSession()};
    },
    endCurrentTurn : function(){
      this.setState({session:this.state.session.nextTurn()});
    },
    shapePlayed : function(s){
      var player = this.state.session.getPlayer(s.colour);
      this.setState({session:this.state.session.updatePlayer(player.shapePlayed(s))});
    },
    render: function() {
      return (
      <div>
        <div>
          Blockus Main
          <PlayerView key="blue" currentTurn={this.state.session.currentTurn} playerData={this.state.session.getPlayer('blue')}/>
          <PlayerView key="red" currentTurn={this.state.session.currentTurn} playerData={this.state.session.getPlayer('red')}/>
          <PlayerView key="yellow" currentTurn={this.state.session.currentTurn} playerData={this.state.session.getPlayer('yellow')}/>
          <PlayerView key="green" currentTurn={this.state.session.currentTurn} playerData={this.state.session.getPlayer('green')}/>
        </div>
        <BoardTable session={this.state.session} shapePlayed={this.shapePlayed} endTurnHandler={this.endCurrentTurn}/>
      </div>
      );
    }
});



window.BlokusApp = BlokusApp;
