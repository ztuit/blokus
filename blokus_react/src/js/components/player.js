var React = require('react');
var ReactDOM = require('react-dom');
require('babel-core');

var PlayerView = React.createClass({
    getInitialState: function() {
      return {
      };
    },
    render: function() {
      return (
      <p>
       {this.props.playerData.name} is {this.props.playerData.colour} Last Turn at {this.props.playerData.lastTurnTime} Current Turn {this.props.currentTurn===this.props.playerData.colour ? "true" : "false"}
      </p>
      );
    }
});


window.PlayerView = PlayerView;
