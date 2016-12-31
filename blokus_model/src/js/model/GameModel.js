'use strict'
var DTO = require('../dto/dto');
var Player = require('./Player');
var BoardModel = require('./BoardModel');

class GameModel{

  constructor(buffer){
      this._dto = new DTO(buffer || GameModel.defaults());
      this._turnMap = {
          'blue':'red',
          'red':'green',
          'green':'yellow',
          'yellow':'blue'
      };
  }

  static defaults(){
    var dto = new DTO();
    dto = dto.setNode('id', new Date());//TODO: real uuid
    dto = dto.setNode('players',
      {
      //  'blue':Player.playerDefaults('blue'),
      //  'red':Player.playerDefaults('red'),
      //  'yellow':Player.playerDefaults('yellow'),
      //  'green':Player.playerDefaults('green')
      });
    dto = dto.setNode('currentTurn', 'blue');
    dto = dto.setNode('board', BoardModel.boardDefaults());
    return dto.buffer;
  }




  getPlayer(colour){

    return new Player('na', this._dto.getNode('players').getNode(colour).value);
  }

  updatePlayer(p){
    var plrs = this._dto.getNode('players').value;
    plrs[p.colour] = p.internal;
    var gme = this._dto.setNode('players', plrs);
    return new GameModel(gme.buffer);
  }


  nextTurn(){
    return new GameModel(this._dto.setNode('nextTurn',
                this._turnMap[this._dto.getNode('nextTurn').value]).buffer);
  }

  get currentTurn(){
    return this._dto.getNode('nextTurn').value;
  }

  get board(){
    var ary = [];
    ['blue','green','yellow','red'].forEach(function(c){
      ary = ary.concat(this.getPlayer(c).shapesPlayed());
    }.bind(this));
    var brd = this._dto.getNode('board').setNode('shapesPlayed', ary);
    return new BoardModel(brd.buffer);
  }



  get id(){
    return this._dto.getNode('id').value;
  }

  get internal(){
    return this._dto.buffer;
  }

}



module.exports = GameModel;
