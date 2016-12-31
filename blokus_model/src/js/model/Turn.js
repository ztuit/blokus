'use strict'
var DTO = require('../dto/dto');
var GameModel = require('./GameModel')

class TurnModel{
  constructor(buffer){
    this._dto = new DTO(buffer || TurnModel.turnDefaults());
  }


  static turnDefaults(){
    return (new DTO()).setNode('colour','blue').setNode('gameId', 'na').
    setNode('playerId', 'na').setNode('game', GameModel.defaults()).buffer;
  }

  get game(){
    return new GameModel(this._dto.getNode('game').buffer);
  }

  setGame(g){
    return new TurnModel(this._dto.setNode('game', g.internal).buffer);
  }

  setPlayerId(id){
    return new TurnModel(this._dto.setNode('playerId', id).buffer);
  }

  setGameId(id){
    return new TurnModel(this._dto.setNode('gameId', id).buffer);
  }

  setColour(c){
    return new TurnModel(this._dto.setNode('colour', c).buffer);
  }

  get colour(){
    return this._dto.getNode('colour').value;
  }

  get internal(){
    return this._dto.buffer;
  }

}



module.exports = TurnModel;
