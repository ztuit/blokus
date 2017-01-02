'use strict'
var DTO = require('../dto/dto');

class Player{
  constructor(colour, buffer){
    this._dto = new DTO(buffer || Player.playerDefaults(colour));
  }


  static playerDefaults(colour){
    return (new DTO()).setNode('colour',colour)
    .setNode('name', colour + " player")
    .setNode('turnsTaken', 0)
    .setNode('turnsPassed', 1)
    .setNode('lastTurnAt',"")
    .setNode('shapesPlayed',{}).buffer;
  }


  get lastTurnTime(){
    return this._dto.getNode('lastTurnAt').value;
  }

  get turnsTaken(){

  }

  get name(){
    return this._dto.getNode('name').value;
  }

  get passes(){

  }

  get colour(){
    return this._dto.getNode('colour').value;
  }

 set colour(c){
   return new Player(1,this._dto.setNode('colour', c).buffer);
 }

  /**
   * Set a shape as played.
   * @returns new player
   **/
  shapePlayed(s){
    var ob = this._dto.getNode('shapesPlayed').value;
    ob["s" + s.id]= s.value();
    return new Player(1,this._dto.setNode('shapesPlayed', ob).value);
  }

  /**
   * Identify if the shape has been added to the played set.
   **/
  hasPlayedShape(s){
    var obj = this._dto.getNode('shapesPlayed').value;
    return obj["s"+s.id]!==undefined;
  }

  shapesPlayed(){
    var ary = [];
    var spsp = this._dto.getNode('shapesPlayed').value;
    for(var k in spsp){
      if(spsp.hasOwnProperty(k)){
        ary.push(spsp[k]);
      }
    }
    return ary;
  }

  get internal(){
    return this._dto.buffer;
  }

}



module.exports = Player;
