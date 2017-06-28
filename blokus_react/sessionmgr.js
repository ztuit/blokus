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

var strmgr = require('./storagemgrFile');


class SessionMgr{

  static createNewGame(){
    var promise = new Promise(function(resolve, reject){
      var game = new GameModel();
      var gId = game.id;

      var playerId = uuid.v1();

      strmgr.createPlayer(playerId,gId, "blue").then((newPlayer)=>{

          game = game.updatePlayer(newPlayer);

          strmgr.writeGame(game).then((g)=>{
            
            var turn = new Turn();
            turn = turn.setPlayerId(playerId);
            turn = turn.setGameId(gId);
            turn = turn.setGame(game);
            resolve(turn);
        });
      });
    });
    return promise;
  }



  static joinGame(id){

    var promise = new Promise(function(resolve, reject){

      var playerId = uuid.v1();
      var gamePromise = strmgr.readGame(id);

      gamePromise.then((game)=>{
        //console.log(game);
        //Find next available player slot
        var noPlyrs = Object.keys(game.players).length;
        if(noPlyrs==4){
          throw 'already have 4 players';
        }

        strmgr.createPlayer(playerId, id, colours[noPlyrs]).then((newPlayer)=>{

        game = game.updatePlayer(newPlayer);

          strmgr.writeGame(game).then((gameSaved)=>{
            var turn = new Turn();
            turn = turn.setPlayerId(playerId);
            turn = turn.setGameId(game.id);
            turn = turn.setGame(game);
            resolve(turn);
          });
        });
      });
    });
    return promise;
  }

  static retrieveForPlayer(id){
    var promise = new Promise(function(resolve, reject){

          strmgr.readPlayer(id).then(function(plyer){

             strmgr.readGame(plyer.gameId).then(function(g){

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

    var promise = new Promise(function(resolve, reject){

    strmgr.readPlayer(id).then((plyr)=>{

        strmgr.readGame(plyr.gameId).then((game)=>{

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

          strmgr.writeGame(game).then((g)=>{
            var turn = new Turn();
            turn = turn.setColour(plyr.colour);
            turn = turn.setPlayerId(id);
            turn = turn.setGameId(game.id);
            turn = turn.setGame(game);
            return resolve(turn);
          });
        });
      });
    });

    return promise;
  }

}

module.exports=SessionMgr;
