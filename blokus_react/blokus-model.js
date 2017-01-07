(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.blokus = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){

var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
  // Moderately fast, high quality
  var _rnds8 = new Uint8Array(16);
  rng = function whatwgRNG() {
    crypto.getRandomValues(_rnds8);
    return _rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var  _rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return _rnds;
  };
}

module.exports = rng;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(_dereq_,module,exports){
//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

// Unique ID creation requires a high quality random # generator.  We feature
// detect to determine the best RNG source, normalizing to a function that
// returns 128-bits of randomness, since that's what's usually required
var _rng = _dereq_('./rng');

// Maps for number <-> hex string conversion
var _byteToHex = [];
var _hexToByte = {};
for (var i = 0; i < 256; i++) {
  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
  _hexToByte[_byteToHex[i]] = i;
}

// **`parse()` - Parse a UUID into it's component bytes**
function parse(s, buf, offset) {
  var i = (buf && offset) || 0, ii = 0;

  buf = buf || [];
  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
    if (ii < 16) { // Don't overflow!
      buf[i + ii++] = _hexToByte[oct];
    }
  });

  // Zero out remaining bytes if string was short
  while (ii < 16) {
    buf[i + ii++] = 0;
  }

  return buf;
}

// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
function unparse(buf, offset) {
  var i = offset || 0, bth = _byteToHex;
  return  bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = _rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0, _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; n++) {
    b[i + n] = node[n];
  }

  return buf ? buf : unparse(b);
}

// **`v4()` - Generate random UUID**

// See https://github.com/broofa/node-uuid for API details
function v4(options, buf, offset) {
  // Deprecated - 'format' argument, as supported in v1.2
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || _rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ii++) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || unparse(rnds);
}

// Export public API
var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;
uuid.parse = parse;
uuid.unparse = unparse;

module.exports = uuid;

},{"./rng":1}],3:[function(_dereq_,module,exports){
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

var GameModel = _dereq_('./js/model/GameModel.js');
var playerModel = _dereq_('./js/model/Player.js');
var DTO = _dereq_('./js/dto/dto.js');
var Turn = _dereq_('./js/model/Turn.js');



module.exports = {GameModel:GameModel, Player:playerModel, DTO: DTO, Turn:Turn};

},{"./js/dto/dto.js":4,"./js/model/GameModel.js":6,"./js/model/Player.js":7,"./js/model/Turn.js":9}],4:[function(_dereq_,module,exports){
'use strict'

class DTO{

  constructor(buffer){
      this._buffer=buffer || {};
  }

  getNode(name){
    var node = typeof(this._buffer[name])==='object' ? JSON.parse(JSON.stringify(this._buffer[name])) : this._buffer[name];
    return new DTO(node, name);
  }



  setNode(name, value){
    var newBuffer = this.buffer;
    newBuffer[name]=value;
    return new DTO(newBuffer);
  }

  /**
   * Returns the raw buffer. Used for simple value types
   */
  get value(){
    return this.buffer;
  }

  /**
   * Returns a copy of the internal buffer as an object.
   **/
  get buffer(){
    return typeof(this._buffer)==='object' ? JSON.parse(JSON.stringify(this._buffer)) : this._buffer;
  }


}


module.exports = DTO;

},{}],5:[function(_dereq_,module,exports){
'use strict'
var DTO = _dereq_('../dto/dto');
var ShapeModel = _dereq_('./ShapeModel')

class BoardModel{
  constructor(buffer){
    this._dto = new DTO(buffer || Board.boardDefaults());
  }


  static boardDefaults(){
    return (new DTO()).setNode('dimensions',{height:20, width:20}).buffer;
  }

  get height(){
    return this._dto.getNode('dimensions').value.height;
  }

  get width(){
    return this._dto.getNode('dimensions').value.width;
  }

  get shapesPlayed(){
    return this._dto.getNode('shapesPlayed').value.map(function(e){
        return (new ShapeModel(e)).toShape;
    }.bind(this));
  }

  get internal(){
    return this._dto.buffer;
  }

}



module.exports = BoardModel;

},{"../dto/dto":4,"./ShapeModel":8}],6:[function(_dereq_,module,exports){
'use strict'
var DTO = _dereq_('../dto/dto');
var Player = _dereq_('./Player');
var BoardModel = _dereq_('./BoardModel');
var uuid = _dereq_('uuid');

class GameModel{

  constructor(buffer){
      this._dto = new DTO(buffer || GameModel.defaults());
      this._turnMap = {
          'blue':'red',
          'red':'green',
          'green':'yellow',
          'yellow':'blue'
      };
  }

  static defaults(){
    var dto = new DTO();
    dto = dto.setNode('id', uuid.v1());
    dto = dto.setNode('players',
      {
      //  'blue':Player.playerDefaults('blue'),
      //  'red':Player.playerDefaults('red'),
      //  'yellow':Player.playerDefaults('yellow'),
      //  'green':Player.playerDefaults('green')
      });
    dto = dto.setNode('currentTurn', 'blue');
    dto = dto.setNode('board', BoardModel.boardDefaults());
    return dto.buffer;
  }




  getPlayer(colour){
    return new Player('na', this._dto.getNode('players').getNode(colour).value);
  }

  get players(){
    return this._dto.getNode('players').buffer;
  }

  get currentPlayer(){
    return this.getPlayer(this.currentTurn);
  }

  updatePlayer(p){
    var plrs = this._dto.getNode('players').value;
    plrs[p.colour] = p.internal;
    var gme = this._dto.setNode('players', plrs).buffer;
    return new GameModel(gme);
  }


  nextTurn(){
    return new GameModel(this._dto.setNode('currentTurn',
                this._turnMap[this._dto.getNode('currentTurn').value]).buffer);
  }

  get currentTurn(){
    return this._dto.getNode('currentTurn').value;
  }

  get board(){
    var ary = [];
    ['blue','green','yellow','red'].forEach(function(c){
      ary = ary.concat(this.getPlayer(c).shapesPlayed());
    }.bind(this));
    var brd = this._dto.getNode('board').setNode('shapesPlayed', ary);
    return new BoardModel(brd.buffer);
  }



  get id(){
    return this._dto.getNode('id').buffer;
  }


  get internal(){
    return this._dto.buffer;
  }

}



module.exports = GameModel;

},{"../dto/dto":4,"./BoardModel":5,"./Player":7,"uuid":2}],7:[function(_dereq_,module,exports){
'use strict'
var DTO = _dereq_('../dto/dto');

class Player{
  constructor(colour, buffer){
    this._dto = new DTO(buffer || Player.playerDefaults(colour));
  }


  static playerDefaults(colour){
    return (new DTO()).setNode('colour',colour)
    .setNode('name', colour + " player")
    .setNode('turnsTaken', 0)
    .setNode('turnsPassed', 1)
    .setNode('lastTurnAt',"")
    .setNode('shapesPlayed',{}).buffer;
  }


  get lastTurnTime(){
    return this._dto.getNode('lastTurnAt').value;
  }

  get turnsTaken(){

  }

  get name(){
    return this._dto.getNode('name').value;
  }

  get passes(){

  }

  get colour(){
    return this._dto.getNode('colour').value;
  }

 set colour(c){
   return new Player(1,this._dto.setNode('colour', c).buffer);
 }

  /**
   * Set a shape as played.
   * @returns new player
   **/
  shapePlayed(s){
    var ob = this._dto.getNode('shapesPlayed').value;
    ob["s" + s.id]= s.value();
    return new Player(1,this._dto.setNode('shapesPlayed', ob).value);
  }

  /**
   * Identify if the shape has been added to the played set.
   **/
  hasPlayedShape(s){
    var obj = this._dto.getNode('shapesPlayed').value;
    return obj["s"+s.id]!==undefined;
  }

  shapesPlayed(){
    var ary = [];
    var spsp = this._dto.getNode('shapesPlayed').value;
    for(var k in spsp){
      if(spsp.hasOwnProperty(k)){
        ary.push(spsp[k]);
      }
    }
    return ary;
  }

  get internal(){
    return this._dto.buffer;
  }

}



module.exports = Player;

},{"../dto/dto":4}],8:[function(_dereq_,module,exports){
'use strict'
_dereq_('../dto/dto');

class ShapeModel{

  constructor(buf){
    this._internal=buf;
  }

  dtoToShape(){
    return new Shape(colour, shapeMap, id, position);
  }

  get toShape(){
    var coordMap = [];
    this._internal.map.forEach(function(c){
        coordMap.push(new Coordinate(c.x,c.y));
    }.bind(this));
    return new Shape(this._internal.colour, arrayToCons(coordMap), this._internal.id, new Coordinate(this._internal.position.x,this._internal.position.y));
  }

}



module.exports = ShapeModel;

},{"../dto/dto":4}],9:[function(_dereq_,module,exports){
'use strict'
var DTO = _dereq_('../dto/dto');
var GameModel = _dereq_('./GameModel')

class TurnModel{
  constructor(buffer){
    this._dto = new DTO(buffer || TurnModel.turnDefaults());
  }


  static turnDefaults(){
    return (new DTO()).setNode('colour','blue').setNode('gameId', 'na').
    setNode('playerId', 'na').setNode('game', GameModel.defaults()).buffer;
  }

  get game(){
    return new GameModel(this._dto.getNode('game').buffer);
  }

  setGame(g){
    return new TurnModel(this._dto.setNode('game', g.internal).buffer);
  }

  setPlayerId(id){
    return new TurnModel(this._dto.setNode('playerId', id).buffer);
  }

  get playerId(){
    return this._dto.getNode('playerId').value;
  }

  setGameId(id){
    return new TurnModel(this._dto.setNode('gameId', id).buffer);
  }

  setColour(c){
    return new TurnModel(this._dto.setNode('colour', c).buffer);
  }

  get colour(){
    return this._dto.getNode('colour').value;
  }

  get internal(){
    return this._dto.buffer;
  }

}



module.exports = TurnModel;

},{"../dto/dto":4,"./GameModel":6}]},{},[3])(3)
});