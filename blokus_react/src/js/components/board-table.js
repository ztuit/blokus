
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
      console.log("shape dragged 2");
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
        <RBoard  session={this.props.session} shapeDropped={this.props.shapePlayed} playedShape={this.state.playedShape}/>
        <PlayerTray shapeDragged={this._shapeDragged}   currentTurn={this.props.session.currentTurn} playerData={this.props.session.getPlayer("blue")} endTurnHandler={this.props.endTurnHandler}/>
        <PlayerTray  shapeDragged={this._shapeDragged}   currentTurn={this.props.session.currentTurn} playerData={this.props.session.getPlayer("green")}  endTurnHandler={this.props.endTurnHandler}/>
        <PlayerTray shapeDragged={this._shapeDragged}   currentTurn={this.props.session.currentTurn} playerData={this.props.session.getPlayer("red")}  endTurnHandler={this.props.endTurnHandler}/>

        <PlayerTray  shapeDragged={this._shapeDragged}   currentTurn={this.props.session.currentTurn} playerData={this.props.session.getPlayer("yellow")}  endTurnHandler={this.props.endTurnHandler}/>

      </div>
      );
    }
});


window.BoardTable = BoardTable;
