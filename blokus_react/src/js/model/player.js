var React = require('react');
var ReactDOM = require('react-dom');
require('babel-core');

var Player = React.createClass({
    getInitialState: function() {
      return {
        playerName:'',
        lastTurnTime: null
      };
    },
    render: function() {
      return (
      <p>
       {this.props.pid} Last Turn at {this.state.lastTurnTime  && this.state.lastTurnTime.toTimeString() || 'none' } Current Turn {this.props.hasCurrentTurn===true ? "true" : "false"}
      </p>
      );
    }
});


window.Player = Player;
