var React = require('react');
var ReactDOM = require('react-dom');
require('babel-core');
var blokus = require('../../../node_modules/blokus/blokus.js');
var cx = require('classnames');
require('./board');

var RBoard = React.createClass({
    getInitialState: function() {
      var b = new Board(parseInt(this.props.session.board.width),parseInt(this.props.session.board.height));
        this.props.session.board.shapesPlayed.forEach(function(el){
          b.addShape(el);
        }.bind(this));
      return {board: b};
    },
    _dragEnter : function(e){
      e.preventDefault();
      e.stopPropagation();
      if(this.props.playedShape){
        var key = e.currentTarget.id.split(",");
        var newShape = this.props.playedShape.rePosition(new Coordinate(parseInt(key[0]),parseInt(key[1])));
        if(this.state.board._canPlace(newShape)){
          this.setState({highlight:e.currentTarget.id});
        }
      }
    },
    _dragLeave : function(e){
      if(this.state.highlight===e.currentTarget.id){
        this.setState({highlight:undefined});
      }
    },
    _onDrop : function() {
      var key = this.state.highlight.split(",");
     var newShape = this.props.playedShape.rePosition(new Coordinate(parseInt(key[0]),parseInt(key[1])));
     if(this.state.board.addShape(newShape)){
          this.props.shapeDropped(newShape);
        }
        this.setState({highlight:undefined});
        this.setState({board:this.state.board});
    },
    _dragOver : function(e){
      e.preventDefault();
      return false;
    },
    render: function() {

      var rows= [];
      for (var i = this.state.board.height; i >=0 ; i--) {

        var cols = [];
        for (var j = 0; j < this.state.board.width; j++) {
          var shp = this.state.board.findShapeAt(new Coordinate(j,i));
          var fillVal = shp ? shp.colour : '';
          var keyIJ = j+","+i;
          var highlight = this.state.highlight && this.state.highlight===keyIJ ? true : false;
          var cellClassNames = cx("col-sm-1", "board__cell", "board__cell--" + fillVal, {"highlightCell":highlight});

          cols.push(<div className={cellClassNames} onDragOver={this._dragOver} onDrop={this._onDrop} onDragEnter={this._dragEnter} onDragLeave={this._dragLeave} key={keyIJ} id={keyIJ}>&nbsp;</div>);
        }
        rows.push(<div className="row" key={i}>{cols}</div>);
      }

      return (
        <div className="board" >
          {rows}
        </div>
      );
    }
});


window.RBoard = RBoard;
