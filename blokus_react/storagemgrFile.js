'use strict'

var path = require('path');
var uuid = require('uuid');
var fs = require('fs');
var GameModel = require('./blokus-model.js').GameModel;
var DTO = require('./blokus-model.js').DTO;
var Player = require('./blokus-model.js').Player;






class StorageMgr{



  /**
   * File implementations
   **/
  static readGame(id){
    var promise = new Promise(function(resolve, reject){
        var gmpth = path.join(__dirname + '/data/game/' + id);
        var gamefd = fs.openSync(gmpth, 'r+');
        var rVal = JSON.parse(fs.readFileSync(gmpth));
        fs.closeSync(gamefd);
        resolve(new GameModel(rVal));
      });
      return promise;
  }

  static writeGame(g){
    var promise = new Promise(function(resolve, reject){

        var gmpth = path.join(__dirname + '/data/game/' + g.id);
        var gamefd = fs.openSync(gmpth, 'a+');
        fs.writeFile(gmpth, JSON.stringify(g.internal));
        fs.closeSync(gamefd);
        resolve(true);
    });
    return promise;
  }

  static readPlayer(id){
    var promise = new Promise(function(resolve, reject){
      var plyrpth = path.join(__dirname + '/data/player/' + id);
      var plyrfd = fs.openSync(plyrpth, 'r+');
      resolve(JSON.parse(fs.readFileSync(plyrpth)));
    });

    return promise;
  }

  static createPlayer(playerId, gameId, c){

    var promise = new Promise(function(resolve, reject){
        var plpth = path.join(__dirname + '/data/player/' + playerId);
        var playerfd = fs.openSync(plpth, 'w');
        var playerGame = {id:playerId, colour:c, gameId:gameId}
        fs.writeFile(plpth, JSON.stringify(playerGame));
        fs.closeSync(playerfd);
        resolve(new Player(c));
     });

     return promise;

  }

}

module.exports=StorageMgr;
