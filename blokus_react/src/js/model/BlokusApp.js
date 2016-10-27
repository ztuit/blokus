var React = require('react');
var ReactDOM = require('react-dom');
require('babel-core');
require('./player');
require('./board-table');

var dt = new  Date();

var BlokusApp = React.createClass({
    getInitialState: function() {
      return {currentTurn:0};
    },
    endCurrentTurn : function(){
      this.setState({currentTurn: ((this.state.currentTurn+1) % 4)});
    },
    render: function() {
      return (
      <div>
        <div>
          Blockus Main
          <Player pid="blue" hasCurrentTurn={this.state.currentTurn===0}/>
          <Player pid="red" hasCurrentTurn={this.state.currentTurn===1}/>
          <Player pid="yellow" hasCurrentTurn={this.state.currentTurn===2}/>
          <Player pid="green" hasCurrentTurn={this.state.currentTurn===3}/>
        </div>
        <BoardTable currentTurn={this.state.currentTurn} endTurnHandler={this.endCurrentTurn}/>
      </div>
      );
    }
});



window.BlokusApp = BlokusApp;
