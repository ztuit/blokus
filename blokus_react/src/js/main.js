require('./components/BlokusApp');
require('./components/IntroApp');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Redirect = require('react-router').Redirect;
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link;

$(document).ready(function(){

       ReactDOM.render((
         <Router history={browserHistory}>

          <Route name="/" path="/" component={IntroApp} />
          <Route path="/play/:gameId/:playerId" component={BlokusApp} />
          <Redirect path="*" to="/"/>
        </Router>),
       document.getElementById('example')
       );
 });
