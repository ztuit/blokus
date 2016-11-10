require('../dto/dto');
require('./ShapeModel')

class BoardModel{
  constructor(buffer){
    this._dto = new DTO(buffer || Board.boardDefaults());
  }


  static boardDefaults(){
    return (new DTO()).setNode('dimensions',{height:20, width:20}).buffer;
  }

  get height(){
    return this._dto.getNode('dimensions').value.height;
  }

  get width(){
    return this._dto.getNode('dimensions').value.width;
  }

  get shapesPlayed(){
    return this._dto.getNode('shapesPlayed').value.map(function(e){
        return (new ShapeModel(e)).toShape;
    }.bind(this));
  }



}



window.BoardModel = BoardModel;
