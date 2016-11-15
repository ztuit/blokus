require('./components/BlokusApp');
require('./components/IntroApp');
require('./components/NewGameApp');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link;

$(document).ready(function(){

       ReactDOM.render((
         <Router history={browserHistory}>
          <Route path="/" component={IntroApp} />
          <Route path="/join/:gameId" component={NewGameApp} />
          <Route path="/:playerId" component={BlokusApp} />
        </Router>),
       document.getElementById('example')
       );
 });
