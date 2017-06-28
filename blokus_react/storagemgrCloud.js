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
  keyFilename: '',
  // Or the contents of the key file:
  credentials: require('')
});


class StorageMgr{

  /**
   * Cloud implementations
   **/

   static readGame(id){
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

   static writeGame(g){
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


   static readPlayer(id){
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

   static createPlayer(playerId, gameId, c){
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



}

module.exports=StorageMgr;
