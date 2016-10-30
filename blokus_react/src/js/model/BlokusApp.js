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
      this.setState({currentTurn: ((this.state.currentTurn+1) % 4)});
    },
    render: function() {
      return (
      <div>
        <div>
          Blockus Main
          <Player pid="blue" playerData={this.state.session.getPlayer('blue')}/>
          <Player pid="red" playerData={this.state.session.getPlayer('red')}/>
          <Player pid="yellow" playerData={this.state.session.getPlayer('yellow')}/>
          <Player pid="green" playerData={this.state.session.getPlayer('green')}/>
        </div>
        <BoardTable currentTurn={this.state.currentTurn} endTurnHandler={this.endCurrentTurn}/>
      </div>
      );
    }
});



window.BlokusApp = BlokusApp;
