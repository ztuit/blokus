require('../dto/dto');

class ShapeModel{

  constructor(buf){
    this._internal=buf;
  }

  dtoToShape(){
    return new Shape(colour, shapeMap, id, position);
  }

  get toShape(){
    var coordMap = [];
    this._internal.map.forEach(function(c){
        coordMap.push(new Coordinate(c.x,c.y));
    }.bind(this));
    return new Shape(this._internal.colour, arrayToCons(coordMap), this._internal.id, new Coordinate(this._internal.position.x,this._internal.position.y));
  }

}



window.ShapeModel = ShapeModel;
