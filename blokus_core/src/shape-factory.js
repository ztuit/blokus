
var Shape = require('./shape.js');
var Coordinate = require('./coordinate.js');
var ConsList = require('./cons.js');



var ShapeFactory = function(){
  this.tileIndex = {one:0, two:1, three:2, ltile:3, ttile:4};
}


ShapeFactory.prototype = {

  /**
   * Build the full set of playing shapes for a given colour.
  **/
  buildShapeSet : function(colour){

    return this._shapeMaps().reverseMap(function(m){
      return new Shape(colour, m);
    }.bind(this));

  },
  _shapeMaps : function(){
    var shapes = new ConsList.list(
                  new ConsList.list(new Coordinate(0,0))
                );
    //Two tiles
    shapes = shapes.Cons(this._growTile(shapes.head, new Coordinate(1,0)));
    //Three tiles
    shapes = shapes.Cons(this._growTile(shapes.head, new Coordinate(1,0)));
    //L shape tile
    shapes = shapes.Cons(this._growTile(shapes.head, new Coordinate(0,1)));
    //T shape tile
    shapes = shapes.Cons(this._growTile(shapes.get(1), new Coordinate(0,1), 1));

    return shapes;
  },
  /**
   Push a new tile onto the tile map as
   an extension from an exisitng tile.
   **/
  _growTile(tilemap, offset, pos){
    pos = pos || 0;
    return tilemap.Cons(tilemap.get(pos).add(offset));
  }
};

if(typeof window !== 'undefined'){
  window.ShapeFactory = ShapeFactory;
}

module.exports = ShapeFactory;
