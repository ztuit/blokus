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

var GameModel = require('./js/model/GameModel.js');
var playerModel = require('./js/model/Player.js');
var DTO = require('./js/dto/dto.js');
var Turn = require('./js/model/Turn.js');



module.exports = {GameModel:GameModel, Player:playerModel, DTO: DTO, Turn:Turn};
