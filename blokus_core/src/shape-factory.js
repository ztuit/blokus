
var Shape = require('./shape.js');
var Coordinate = require('./coordinate.js');
var ConsList = require('./cons.js');



var ShapeFactory = function(){
  this.tileIndex = {one:0, two:1, three:2, ltile:3, ttile:4, corner:5,
    foursq:6, snake:7, four:8, longL:9, bigT:10, bigCorner:11, longSnake:12,
    eygptian:13, five:14, bshape:15, mshape:16, chape:17, snakewithfoot:18, cross:19, lounge:20};
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
    //corner shape tile
    shapes = shapes.Cons(this._growTile(shapes.get(3), new Coordinate(0,1)));
    //Four Shape
    shapes = shapes.Cons(this._growTile(shapes.head, new Coordinate(-1,0)));
    //snake
    shapes = shapes.Cons(this._growTile(shapes.get(1), new Coordinate(1,0)));
    //four
    shapes = shapes.Cons(this._growTile(shapes.get(5), new Coordinate(1,0)));
    //long l
    shapes = shapes.Cons(this._growTile(shapes.head, new Coordinate(0,1)));
    //big t
    shapes = shapes.Cons(this._growTile(shapes.get(5), new Coordinate(0,1)));
    //big corner
    shapes = shapes.Cons(this._growTile(shapes.get(7), new Coordinate(0,1)));
    //long snake
    shapes = shapes.Cons(this._growTile(shapes.get(4), new Coordinate(1,0)));
    //eygptyion
    shapes = shapes.Cons(this._growTile(shapes.get(9), new Coordinate(0,-1),3));
    //five line
    shapes = shapes.Cons(this._growTile(shapes.get(5), new Coordinate(1,0)));
    //bshape
    shapes = shapes.Cons(this._growTile(shapes.get(8), new Coordinate(0,1)));
    //mshape
    shapes = shapes.Cons(this._growTile(shapes.get(8), new Coordinate(0,-1),3));
    //cshape
    var cshape = this._growTile(shapes.get(11), new Coordinate(0,1));
    shapes = shapes.Cons(this._growTile(cshape, new Coordinate(-1,0)));
    //snakewithfoot
    shapes = shapes.Cons(this._growTile(shapes.get(10), new Coordinate(0,-1),2));
    //cross
    shapes = shapes.Cons(this._growTile(shapes.get(14), new Coordinate(0,-1),2));
    //lounge
    shapes = shapes.Cons(this._growTile(shapes.get(15), new Coordinate(1,0),1));


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
