
var React = require('react');
var ReactDOM = require('react-dom');
require('babel-core');
require('./board');
require('./player-tray');

var BoardTable = React.createClass({
    getInitialState: function() {
      return {playedShape:undefined};
    },
    _shapeDragged : function(shape){
      this.setState({playedShape: shape});
    },
    _shapeDragEnd : function(shape){
      this.setState({playedShape: undefined});
    },
    _keyDown : function(){
      console.log("key down board table");
    },
    render: function() {
      return (
      <div className="gameTable">
        <div>Current Turn is with: {this.props.session.game.currentTurn}</div>
        <RBoard  session={this.props.session} shapeDropped={this.props.shapePlayed} playedShape={this.state.playedShape}/>
        <PlayerTray shapeDragged={this._shapeDragged}   currentTurn={this.props.session.colour} playerData={this.props.session.game.currentPlayer} endTurnHandler={this.props.endTurnHandler}/>

      </div>
      );
    }
});


window.BoardTable = BoardTable;
