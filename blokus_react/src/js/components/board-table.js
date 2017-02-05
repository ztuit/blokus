
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
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h3 className="panel-title">
              Game id:<span className="badge">{this.props.session.game.id}</span> You are:<span className="badge">{this.props.session.colour}</span> Current Turn is with: <span className="badge">{this.props.session.game.currentTurn}</span>
            </h3>
            </div>
              <div className="panel-body text-center">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-5">
                      <PlayerTray shapeDragged={this._shapeDragged}   currentTurn={this.props.session.colour} playerData={this.props.session.game.currentPlayer} endTurnHandler={this.props.endTurnHandler}/>
                    </div>
                      <div className="col-md-7">
                        <RBoard  session={this.props.session} shapeDropped={this.props.shapePlayed} playedShape={this.state.playedShape}/>
                      </div>
                  </div>
              </div>
            </div>
          </div>



      </div>
      );
    }
});


window.BoardTable = BoardTable;
