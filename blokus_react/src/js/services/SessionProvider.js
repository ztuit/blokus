var React = require('react');
var ReactDOM = require('react-dom');
require('babel-core');
require('../model/Session');

var tmpSession = "{\"id\":\"2016-11-10T18:32:08.165Z\",\"players\":{\"blue\":{\"colour\":\"blue\",\"name\":\"blue player\",\"turnsTaken\":0,\"turnsPassed\":1,\"lastTurnAt\":\"\",\"shapesPlayed\":{\"20\":{\"id\":20,\"colour\":\"blue\",\"position\":{\"x\":0,\"y\":0,\"z\":0},\"map\":[{\"x\":0,\"y\":0,\"z\":0}]}}},\"red\":{\"colour\":\"red\",\"name\":\"red player\",\"turnsTaken\":0,\"turnsPassed\":1,\"lastTurnAt\":\"\",\"shapesPlayed\":{\"20\":{\"id\":20,\"colour\":\"red\",\"position\":{\"x\":19,\"y\":0,\"z\":0},\"map\":[{\"x\":0,\"y\":0,\"z\":0}]}}},\"yellow\":{\"colour\":\"yellow\",\"name\":\"yellow player\",\"turnsTaken\":0,\"turnsPassed\":1,\"lastTurnAt\":\"\",\"shapesPlayed\":{}},\"green\":{\"colour\":\"green\",\"name\":\"green player\",\"turnsTaken\":0,\"turnsPassed\":1,\"lastTurnAt\":\"\",\"shapesPlayed\":{}}},\"currentTurn\":\"green\",\"board\":{\"dimensions\":{\"height\":20,\"width\":20}}}";

class SessionProvider{
    constructor(){

    }
    /**
     * Creates a new session, initial game state.
     **/
    static createNewSession(){
        return new Session();
    }

    static saveSession(s){
      console.log(s.value);
    }

    static loadSession(id){
      return new Session(JSON.parse(tmpSession));
    }

};


window.SessionProvider = SessionProvider;
