var React = require('react');
var ReactDOM = require('react-dom');
require('babel-core');
require('./board');
require('./player-tray');

var BoardTable = React.createClass({
    getInitialState: function() {
      return {playedShape:undefined, trays:[]};
    },
    _shapeDragged : function(shape){
      this.setState({playedShape: shape});
    },
    _shapeDragEnd : function(shape){
      this.setState({playedShape: undefined});
    },
    _shapeDropped : function(s){
      this.state.trays.forEach(function(el){
        el.shapePlayed(s);
      }.bind(this));
    },
    _trayMounted : function(tray){
      this.state.trays.push(tray);
    },
    _keyDown : function(){
      console.log("key down board table");
    },
    render: function() {
      return (
      <div className="gameTable">
        <RBoard shapeDropped={this._shapeDropped} playedShape={this.state.playedShape} width="10" height="10"/>
        <PlayerTray ref={this._trayMounted} shapeDragged={this._shapeDragged} shapeDragEnd={this._shapeDragEnd} pid="0" currentTurn={this.props.currentTurn} colour="blue" endTurnHandler={this.props.endTurnHandler}/>
        <PlayerTray ref={this._trayMounted} shapeDragged={this._shapeDragged} shapeDragEnd={this._shapeDragEnd} pid="1" currentTurn={this.props.currentTurn} colour="red" endTurnHandler={this.props.endTurnHandler}/>
        <PlayerTray ref={this._trayMounted} shapeDragged={this._shapeDragged} shapeDragEnd={this._shapeDragEnd} pid="2" currentTurn={this.props.currentTurn} colour="green" endTurnHandler={this.props.endTurnHandler}/>

        <PlayerTray ref={this._trayMounted} shapeDragged={this._shapeDragged} shapeDragEnd={this._shapeDragEnd} pid="3" currentTurn={this.props.currentTurn} colour="yellow" endTurnHandler={this.props.endTurnHandler}/>

      </div>
      );
    }
});


window.BoardTable = BoardTable;
