var React = require('react');
var ReactDOM = require('react-dom');
require('babel-core');
require('./board');
require('./shape-view');
var cx = require("classnames");

var PlayerTray = React.createClass({
    getInitialState: function() {
      var sf = new ShapeFactory();
      var shape = sf.buildShapeSet(this.props.colour);
      return {shapes:shape, pid: parseInt(this.props.pid), selected:-1};
    },
    componentDidMount: function() {
           $('#div1').keyup(this._keyDown);
    },
    _createClickHandler : function(){
      return this.props.endTurnHandler;
    },
    shapePlayed : function(shape){

      var newShape = shape.normalise();
      var newShapes = this.state.shapes.filter(function(el){

        return !el.equals(newShape);
      }.bind(this));


      this.setState({shapes:newShapes});

    },
    _keyDown : function(){
      console.log("tray key down");
    },
    _selected : function(id){
      this.setState({selected:id});
    },

    render: function() {
      var cellClassNames = "";
      if(this.state.pid!==this.props.currentTurn){
        cellClassNames = "hide";
      }
      cellClassNames = cx(cellClassNames);
      var shapesEl = [];
      var cnter = 0;

      this.state.shapes.forEach(function(el){

        shapesEl.push(<ShapeView shapeSelected={this._selected} currentSelected={this.state.selected} shapeDragged={this.props.shapeDragged} shapeDragEnd={this.props.shapeDragEnd} shapeId={cnter} key={cnter} shape={el}/>);
        cnter+=1;
      }.bind(this));
      var key = "tray_" + this.props.colour;
      return (
      <div  tabindex="0" className={cellClassNames}  onKeyDown={this._keyDown}>
        {this.props.colour} has pieces to play:
        <div>
          {shapesEl}
        </div>
        <button value="" onClick={this._createClickHandler()}>End Turn</button>
       </div>
      );
    }
});


window.PlayerTray = PlayerTray;
