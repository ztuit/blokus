'use strict'

var path = require('path');
var uuid = require('uuid');
var fs = require('fs');
var colours = ['blue', 'red', 'green', 'yellow'];
var turnMap = {'blue':'red', 'red':'green', 'green':'yellow', 'yellow':'blue'};

var GameModel = require('./blokus-model.js').GameModel;
var DTO = require('./blokus-model.js').DTO;
var Player = require('./blokus-model.js').Player;
var Turn = require('./blokus-model.js').Turn;

var strmgr = require('./storagemgr');


class SessionMgr{

  static createNewGame(){
    var game = new GameModel();
    var gId = game.id;

    var playerId = uuid.v1();
    //var gmpth = path.join(__dirname + '/data/game/' + gId);
    //var gamefd = fs.openSync(gmpth, 'w');
    //console.log(BlokusModel);
    var newPlayer =  strmgr.createPlayerInCloud(playerId,gId, "blue");
    game = game.updatePlayer(newPlayer);
    //fs.writeFile(gmpth, JSON.stringify(game.internal));
    //fs.closeSync(gamefd);
    strmgr.writeGameToCloud(game);
    var turn = new Turn();
    turn = turn.setPlayerId(playerId);
    turn = turn.setGameId(gId);
    turn = turn.setGame(game);
    return turn.internal;
  }



  static joinGame(id){
    var playerId = uuid.v1();
    var game = this.readGame(id);
    //console.log(game);
    //Find next available player slot
    var noPlyrs = Object.keys(game.players).length;
    if(noPlyrs==4){
      throw 'already have 4 players';
    }
    var newPlayer = strmgr.createPlayerInCloud(playerId, id, colours[noPlyrs]);

    game = game.updatePlayer(newPlayer);

    strmgr.writeGameToCloud(game);
    var turn = new Turn();
    turn = turn.setPlayerId(playerId);
    turn = turn.setGameId(game.id);
    turn = turn.setGame(game);
    return turn.internal;
  }

  static retrieveForPlayer(id){
    var promise = new Promise(function(resolve, reject){

          strmgr.readPlayerFromCloud(id).then(function(plyer){

             strmgr.readGameFromCloud(plyer.gameId).then(function(g){

               var turn = new Turn();
               turn = turn.setPlayerId(plyer.id);
               turn = turn.setGameId(g.id);
               turn = turn.setGame(g);

               turn = turn.setColour(plyer.colour);
                
                resolve(turn);
             });
         });

    });



    return promise;
  }


  static playerGameUpdate(id, state){
    var plyr = strmgr.readPlayerFromCloud(id);
    var game = strmgr.readGameFromCloud(plyr.gameId);
    var rVal = {};
    if(game.currentTurn!==plyr.colour){
      return {'error':'not this players turn'};
    }
    //extract only the details of the player
    //saving

    var turn = new Turn(state);

    var newPlayerState = turn.game.getPlayer(plyr.colour);

    game = game.nextTurn();
    game = game.updatePlayer(newPlayerState);
    newPlayerState = turn.game.getPlayer(plyr.colour);
    console.log(newPlayerState.shapesPlayed());
    console.log(JSON.stringify(newPlayerState));
    strmgr.writeGameToCloud(game);
    var turn = new Turn();
    turn = turn.setColour(plyr.colour);
    turn = turn.setPlayerId(id);
    turn = turn.setGameId(game.id);
    turn = turn.setGame(game);
    return turn.internal;
  }

}

module.exports=SessionMgr;
