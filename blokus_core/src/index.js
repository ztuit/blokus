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

var ConsList = require('./cons.js');
var Coordinate = require('./coordinate.js');
var Shape = require('./shape.js');
var ShapeFactory = require('../src/shape-factory.js');
var Board = require('./board.js');


module.exports = {board:Board, coordinate:Coordinate, shape: Shape, shapeFactory:ShapeFactory};
