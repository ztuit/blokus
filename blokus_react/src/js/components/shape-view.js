var React = require('react');
var ReactDOM = require('react-dom');
require('babel-core');
var blokus = require('../../../node_modules/blokus/blokus.js');
var cx = require('classnames');


var ShapeView = React.createClass({
    getInitialState: function() {
      return null;
    },
    componentDidMount: function() {
    },
    _dragStarted: function(e){
      var key = document.elementFromPoint(e.clientX, e.clientY).id.split(",");
      //var newShape = this.state.shape.rePosition();
      var newMap = this.props.shape.shapeMap.map(function(el){
        return el.add(new Coordinate(-parseInt(key[0]), -parseInt(key[1])));
      }.bind(this));
      var newShape = new Shape(this.props.shape.colour, newMap, this.props.shape.id, this.props.shape.position);
      console.log("drag started");
      this.props.shapeDragged(newShape);
    },
    _dragEnd: function(){
      this.props.shapeDragEnd(this.props.shape);
    },
    _onClick: function(e){
      this.props.shapeSelected(this.props.shapeId);
    },
    _keyPress : function(e){
      e.preventDefault();
      e.stopPropagation();
    },
    _rotate : function(e){
      if(e.shiftKey){
        this.props.rotateRight(this.props.shape);
      }
    },
    render: function() {
      var rows= [];
      var width = this.props.shape.width;
      var height = this.props.shape.height;

      for (var i = height; i >=0 ; i--) {
        var cols = [];
        for (var j = 0; j < width ; j++) {
          var shp = this.props.shape.containsPoint(new Coordinate(j,i));
          var fillVal = shp ? this.props.shape.colour : 'transparent';
          var cellClassNames = cx("col-sm-4", "board__cell", "board__cell--" + fillVal);

          cols.push(<div  onClick={this._onClick} className={cellClassNames} id={j+","+i} key={j+","+i}>&nbsp;</div>);
        }
        rows.push(<div className="srow" key={i}>{cols}</div>);
      }
      var compClassNames = cx("placeable", {"selectedShape":this.props.currentSelected===this.props.shapeId});
      var divStyle = {width: (this.props.shape.width*32)+5};
      return (
        <div onKeyPress={this._keyPress} onClick={this._rotate} tabindex="0" style={divStyle} draggable="true"  onDragStart={this._dragStarted} onDragEnd={this._dragEnd} className={compClassNames}>
          {rows}

        </div>
      );
    }
});


window.ShapeView = ShapeView;
