'use strict'

var path = require('path');
var uuid = require('uuid');
var fs = require('fs');
var colours = ['blue', 'red', 'green', 'yellow'];
var turnMap = {'blue':'red', 'red':'green', 'green':'yellow', 'yellow':'blue'};

class SessionMgr{

  static createNewGame(){
    var gId = uuid.v1();
    var playerId = uuid.v1();
    var gmpth = path.join(__dirname + '/data/game/' + gId);
    var gamefd = fs.openSync(gmpth, 'w');
    var game = {id:gId, nextTurn: 'blue', players:{'blue':playerId}, gameState:{}};
    fs.writeFile(gmpth, JSON.stringify(game));
    fs.closeSync(gamefd);

    return SessionMgr.createPlayer(playerId,gId, "blue");
  }

  static createPlayer(playerId, gameId, c){
    var plpth = path.join(__dirname + '/data/player/' + playerId);
    var playerfd = fs.openSync(plpth, 'w');

    var playerGame = {id:playerId, colour:c, gameId:gameId};
    fs.writeFile(plpth, JSON.stringify(playerGame));
    fs.closeSync(playerfd);
    return playerGame;
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
    return {colour: plyer.colour, game:g.gameState};
  }

  static readGame(id){
    var gmpth = path.join(__dirname + '/data/game/' + id);
    var gamefd = fs.openSync(gmpth, 'r+');
    var rVal = JSON.parse(fs.readFileSync(gmpth));
    fs.closeSync(gamefd);
    return rVal;
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
