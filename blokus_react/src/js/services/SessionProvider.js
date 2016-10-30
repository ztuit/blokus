var React = require('react');
var ReactDOM = require('react-dom');
require('babel-core');
require('../model/Session');

class SessionProvider{
    constructor(){

    }
    /**
     * Creates a new session, initial game state.
     **/
    static createNewSession(){
        return new Session();
    }
};


window.SessionProvider = SessionProvider;
