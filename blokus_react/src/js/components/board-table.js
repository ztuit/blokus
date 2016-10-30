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
        <RBoard shapeDropped={this._shapeDropped} playedShape={this.state.playedShape} width="20" height="20"/>
        <PlayerTray ref={this._trayMounted} shapeDragged={this._shapeDragged} shapeDragEnd={this._shapeDragEnd}  currentTurn={this.props.session.currentTurn} playerData={this.props.session.getPlayer("blue")} endTurnHandler={this.props.endTurnHandler}/>
        <PlayerTray ref={this._trayMounted} shapeDragged={this._shapeDragged} shapeDragEnd={this._shapeDragEnd}  currentTurn={this.props.session.currentTurn} playerData={this.props.session.getPlayer("green")}  endTurnHandler={this.props.endTurnHandler}/>
        <PlayerTray ref={this._trayMounted} shapeDragged={this._shapeDragged} shapeDragEnd={this._shapeDragEnd}  currentTurn={this.props.session.currentTurn} playerData={this.props.session.getPlayer("red")}  endTurnHandler={this.props.endTurnHandler}/>

        <PlayerTray ref={this._trayMounted} shapeDragged={this._shapeDragged} shapeDragEnd={this._shapeDragEnd}  currentTurn={this.props.session.currentTurn} playerData={this.props.session.getPlayer("yellow")}  endTurnHandler={this.props.endTurnHandler}/>

      </div>
      );
    }
});


window.BoardTable = BoardTable;
