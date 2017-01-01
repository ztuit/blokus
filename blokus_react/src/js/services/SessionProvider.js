var React = require('react');
var ReactDOM = require('react-dom');
require('babel-core');
var blokus = require('../../../node_modules/blokus/blokus.js');
var Turn = require('../../../node_modules/blokus-model/blokus-model.js').Turn;

var tmpSession = "{\"id\":\"2016-11-10T18:32:08.165Z\",\"players\":{\"blue\":{\"colour\":\"blue\",\"name\":\"blue player\",\"turnsTaken\":0,\"turnsPassed\":1,\"lastTurnAt\":\"\",\"shapesPlayed\":{\"20\":{\"id\":20,\"colour\":\"blue\",\"position\":{\"x\":0,\"y\":0,\"z\":0},\"map\":[{\"x\":0,\"y\":0,\"z\":0}]}}},\"red\":{\"colour\":\"red\",\"name\":\"red player\",\"turnsTaken\":0,\"turnsPassed\":1,\"lastTurnAt\":\"\",\"shapesPlayed\":{\"20\":{\"id\":20,\"colour\":\"red\",\"position\":{\"x\":19,\"y\":0,\"z\":0},\"map\":[{\"x\":0,\"y\":0,\"z\":0}]}}},\"yellow\":{\"colour\":\"yellow\",\"name\":\"yellow player\",\"turnsTaken\":0,\"turnsPassed\":1,\"lastTurnAt\":\"\",\"shapesPlayed\":{}},\"green\":{\"colour\":\"green\",\"name\":\"green player\",\"turnsTaken\":0,\"turnsPassed\":1,\"lastTurnAt\":\"\",\"shapesPlayed\":{}}},\"currentTurn\":\"green\",\"board\":{\"dimensions\":{\"height\":20,\"width\":20}}}";



class SessionProvider{
    constructor(){
    }


    static saveSession(s){
      return $.post('http://localhost:8080/session/' + s.playerId,s.internal);
    }

    static createNewSession(){
      return new Turn();
    }

    static loadSession(id){

    return $.getJSON('http://localhost:8080/session/' + id);
            //.then(function(data) {
              //browserHistory.push('/play/' + data.gameId + "/" + data.id);
            //  return new Session(data);
            //});
      //return new Session(JSON.parse(tmpSession));
    }

    static parseTurn(t){
      return new Turn(t);
    }

};


window.SessionProvider = SessionProvider;
