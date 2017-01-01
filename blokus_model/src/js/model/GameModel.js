'use strict'
var DTO = require('../dto/dto');
var Player = require('./Player');
var BoardModel = require('./BoardModel');
var uuid = require('uuid');

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
    dto = dto.setNode('id', uuid.v1());
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

  get players(){
    return this._dto.getNode('players').buffer;
  }

  get currentPlayer(){
    return this.getPlayer(this.currentTurn);
  }

  updatePlayer(p){
    var plrs = this._dto.getNode('players').value;
    plrs[p.colour] = p.internal;
    var gme = this._dto.setNode('players', plrs).buffer;
    return new GameModel(gme);
  }


  nextTurn(){
    return new GameModel(this._dto.setNode('currentTurn',
                this._turnMap[this._dto.getNode('currentTurn').value]).buffer);
  }

  get currentTurn(){
    return this._dto.getNode('currentTurn').value;
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
    return this._dto.getNode('id').buffer;
  }


  get internal(){
    return this._dto.buffer;
  }

}



module.exports = GameModel;
