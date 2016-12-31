'use strict'

var path = require('path');
var uuid = require('uuid');
var fs = require('fs');
var colours = ['blue', 'red', 'green', 'yellow'];
var turnMap = {'blue':'red', 'red':'green', 'green':'yellow', 'yellow':'blue'};

var GameModel = require('./node_modules/blokus-model/blokus-model.js').GameModel;
var DTO = require('./node_modules/blokus-model/blokus-model.js').DTO;
var Player = require('./node_modules/blokus-model/blokus-model.js').Player;
var Turn = require('./node_modules/blokus-model/blokus-model.js').Turn;

class SessionMgr{

  static createNewGame(){
    var gId = uuid.v1();
    var playerId = uuid.v1();
    var gmpth = path.join(__dirname + '/data/game/' + gId);
    var gamefd = fs.openSync(gmpth, 'w');
    //console.log(BlokusModel);
    var game = new GameModel();
    var newPlayer =  SessionMgr.createPlayer(playerId,gId, "blue");
    game = game.updatePlayer(newPlayer);
    fs.writeFile(gmpth, JSON.stringify(game.internal));
    fs.closeSync(gamefd);
    var turn = new Turn();
    turn = turn.setPlayerId(playerId);
    turn = turn.setGameId(gId);
    turn = turn.setGame(game);
    return turn.internal;
  }

  static createPlayer(playerId, gameId, c){
    var plpth = path.join(__dirname + '/data/player/' + playerId);
    var playerfd = fs.openSync(plpth, 'w');

    var playerGame = {id:playerId, colour:c, gameId:gameId}
    fs.writeFile(plpth, JSON.stringify(playerGame));
    fs.closeSync(playerfd);
    return new Player(c);
  }

  static joinGame(id){
    var playerId = uuid.v1();
    var game = this.readGame(id);
    //Find next available player slot
    var noPlyrs = Object.keys(game.players).length;
    if(noPlyrs==4){
      throw 'already have 4 players';
    }
    game.players[colours[noPlyrs]] = playerId;
    SessionMgr.writeGame(game);
    return SessionMgr.createPlayer(playerId, id, colours[noPlyrs]);
  }

  static retrieveForPlayer(id){
    var plyer = SessionMgr.readPlayer(id);
    var g = SessionMgr.readGame(plyer.gameId);
    var turn = new Turn();
    turn = turn.setPlayerId(id);
    turn = turn.setGameId(g.id);
    turn = turn.setGame(g);
    console.log(g.internal);
    turn = turn.setColour(plyer.colour);
    return turn.internal;
  }

  static readGame(id){
    var gmpth = path.join(__dirname + '/data/game/' + id);
    var gamefd = fs.openSync(gmpth, 'r+');
    var rVal = JSON.parse(fs.readFileSync(gmpth));
    fs.closeSync(gamefd);
    return new GameModel(rVal);
  }

  static writeGame(g){
    var gmpth = path.join(__dirname + '/data/game/' + g.id);
    var gamefd = fs.openSync(gmpth, 'r+');
    fs.writeFile(gmpth, JSON.stringify(g));
    fs.closeSync(gamefd);
  }

  static readPlayer(id){
    var plyrpth = path.join(__dirname + '/data/player/' + id);
    var plyrfd = fs.openSync(plyrpth, 'r+');
    return JSON.parse(fs.readFileSync(plyrpth));
  }

  static playerGameUpdate(id, state){
    var plyr = SessionMgr.readPlayer(id);
    var gm = SessionMgr.readGame(plyr.gameId);
    var rVal = {};
    if(gm.nextTurn!==plyr.colour){
      rVal = {'error':'not this players turn'};
    }
    gm.gameState = JSON.parse(state);
    gm.nextTurn = turnMap[gm.nextTurn];
    SessionMgr.writeGame(gm);
    return rVal;
  }

}

module.exports=SessionMgr;
