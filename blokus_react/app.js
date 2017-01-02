//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// [START app]
'use strict';

var express = require('express');
var sm = require('./sessionmgr');


var app = express();

var bodyParser = require('body-parser');

// Add this line below
app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json());

var path = require('path');
app.use("/", express.static(__dirname));
app.use("/", express.static(__dirname + "/dist"));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/view/main.html'));
});



app.get('/join/:gameId', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/view/main.html'));
});

app.get('/play/:playerId', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/view/main.html'));
});



//Session management
//Creation of a new game creates two files with the numbers player1 and Game
//Ucontents of player1 -> Game
//There are two ids

//New game session
//Initial structures created
app.get('/session', function (req, res, next) {
   var ng = sm.createNewGame();
  
  res.send(ng);
  next();
});

//Join a game session
//Creates a new user in the next available player slot
app.get('/session/:gameid/join', function (req, res, next) {
  res.send(sm.joinGame(req.params.gameid));
  next();
});

//Retrieve a game session
app.get('/session/:playerid', function (req, res, next) {
  res.send(sm.retrieveForPlayer(req.params.playerid));
  next();
});

//Up date the game session
app.post('/session/:playerid', function (req, res, next) {
  res.send(sm.playerGameUpdate(req.params.playerid, req.body));
  next();
});

// Start the server
var server = app.listen(process.env.PORT || '8080', function () {
  console.log('App listening on port %s', server.address().port);
  console.log('Press Ctrl+C to quit.');
});
// [END app]
