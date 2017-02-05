'use strict'

var path = require('path');
var uuid = require('uuid');
var fs = require('fs');
var GameModel = require('./blokus-model.js').GameModel;
var DTO = require('./blokus-model.js').DTO;
var Player = require('./blokus-model.js').Player;



var projectId = 'blokus2-147816';//process.env.blokus2-148816;

var datastore = require('@google-cloud/datastore')({
  projectId: projectId,
  // The path to your key file:
  keyFilename: './blokus2-435b3ab7ada1.json',
  // Or the contents of the key file:
  credentials: require('./blokus2-435b3ab7ada1.json')
});


class StorageMgr{

  /**
   * Cloud implementations
   **/

   static readGameFromCloud(id){
    var promise = new Promise(function(resolve, reject){
        var key = datastore.key(['Game', id]);
         datastore.get(key)
           .then((results) => {
             // Task found.
             const entity = results[0];

             resolve(new GameModel(entity));
           });
       });

       return promise;
   }

   static writeGameToCloud(g){
     var promise = new Promise(function(resolve, reject){
       var key = datastore.key(['Game', g.id]);
       datastore.save({
          key: key,
          data: g.internal
        }, function(err) {
            if(err){
              console.log("Game faile to save " + err);
            } else{
              resolve("saved");
            }
        });
      });
      return promise;
   }


   static readPlayerFromCloud(id){
     var key = datastore.key(['Player', id]);
     var p = new Promise(function(resolve, reject) {
       datastore.get(key)
          .then((results) => {
            // Task found.
            const entity = results[0];

            resolve(entity);
          });
     });
     return p;
   }

   static createPlayerInCloud(playerId, gameId, c){
     var promise = new Promise(function(resolve, reject){

         var key = datastore.key(['Player', playerId]);
         var playerGame = {id:playerId, colour:c, gameId:gameId}
         datastore.save({
            key: key,
            data: playerGame
          }, function(err) {
              if(err){
                console.log("player faile to create " + err);
              }else{
                resolve(new Player(c));
              }
          });
      });

      return promise;
   }

  /**
   * File implementations
   **/
  static readGameFromFile(id){
    var gmpth = path.join(__dirname + '/data/game/' + id);
    var gamefd = fs.openSync(gmpth, 'r+');
    var rVal = JSON.parse(fs.readFileSync(gmpth));
    fs.closeSync(gamefd);
    return new GameModel(rVal);
  }

  static writeGameToFile(g){
    var gmpth = path.join(__dirname + '/data/game/' + g.id);
    var gamefd = fs.openSync(gmpth, 'r+');
    fs.writeFile(gmpth, JSON.stringify(g.internal));
    fs.closeSync(gamefd);
  }

  static readPlayerFromFile(id){
    var plyrpth = path.join(__dirname + '/data/player/' + id);
    var plyrfd = fs.openSync(plyrpth, 'r+');
    return JSON.parse(fs.readFileSync(plyrpth));
  }

  static createPlayerInFile(playerId, gameId, c){
    var plpth = path.join(__dirname + '/data/player/' + playerId);
    var playerfd = fs.openSync(plpth, 'w');
    var playerGame = {id:playerId, colour:c, gameId:gameId}
    fs.writeFile(plpth, JSON.stringify(playerGame));
    fs.closeSync(playerfd);
    return new Player(c);
  }

}

module.exports=StorageMgr;
