(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Shape implementation
 **/
var Shape = function(position, colour, shapeMap){
	this.position = position;
	this.colour = colour;
	this.shapeMap=shapeMap;
};

Shape.prototype = {

	getCoordinates : function(){
		return this.shapeMap.map(function(v){
			return v.add(this.position);
		}.bind(this));
	},
	rotateLeft90 : function(){
		var newShapeMap = this.shapeMap.map(function(v){
				return v.rotate90Left();
		});
		return new Shape(this.position, this.colour, newShapeMap);
	},
	rotateRight90 : function(){
		var newShapeMap = this.shapeMap.map(function(v){
				return v.rotate90Right();
		});
		return new Shape(this.position, this.colour, newShapeMap);
	},
	intersects : function(other){
		var otherCoords = other.getCoordinates();
		var doesIntersects=false;
		this.getCoordinates().forEach(function(c){
				if(otherCoords.find(function(e){
					return c.equals(e);
				})){
					doesIntersects=true;
					return true;
				}
		});
		return doesIntersects;
	},
	containsPoint : function(coord){

		return this.getCoordinates().find(function(c){
			return c.equals(coord);
		}.bind(this)) ? true : false;
	}
};


module.exports = Shape;
},{}],2:[function(require,module,exports){
var List = require('./cons.js');
var Coordinate = require('./coordinate.js');

var Board = function(width, height){

	this.width = width;
	this.height = height;
	this.list = new List.list(List.nil, List.nil);
}

Board.prototype = {

	draw : function(){

		var lines = "\n";
		for(var i=this.height; i>=0; i--){
			for(var j=0;j<this.width;j++) {
				if(this._containsPoint(new Coordinate(j,i),this.list)){
					lines += " X ";
				} else {
					lines += " 0 ";
				}
			}
			lines += "\n";
		}
		return lines;
	},

	addShape : function(shape){
		var rVal = false;
		if(this._canPlace(shape)){
			this.list = this.list.Cons(shape);
			rVal = true;
		} 
		return rVal;
	},

	_canPlace : function(shape){
		var canPlace = true;
		shape.getCoordinates().forEach(function(e){
			if(e.x<0 || e.x >= this.width || e.y < 0 || e.y > this.height){
				canPlace = false;
				return;
			} 
		}.bind(this));

		if(!canPlace){
			canPlace = this._checkShapeIntersects(shape, this.list);
		}

		return canPlace;
	},

	_checkShapeIntersects : function(s,l) {
		var rVal = false;
		if(l.head!==List.nil){
			rVal = l.head.intersects(s) ? true : this._checkShapeIntersects(s, l.tail);
		}
		return rVal;
	},
	_containsPoint : function(p,l){
		var rVal = false;
		if(l.head!==List.nil){
			rVal = l.head.containsPoint(p) ? true : this._containsPoint(p, l.tail);
		}
		return rVal;
	}


}


module.exports = Board;
},{"./cons.js":3,"./coordinate.js":4}],3:[function(require,module,exports){
/**
 List impl
**/
var List = function(head, tail) {
  this.head = head;
  this.tail = tail;
};
 
List.prototype = {
  isEmpty : false,

  Cons : function(other){
    return new List(other, this);
  }

};


var Nil = {
  isEmpty: true,
 
  get head() {
    throw new Error('Accessing head on empty list.');
  },
 
  get tail() {
    throw new Error('Accessing tail on empty list.');
  }
};


var cons = function(head, tail) {
  return new List(head, tail);
};
 
var vlist = cons(1, cons(3, cons(42, cons(28, Nil))));


function printList(list){
	return list.isEmpty ? null : list.head + " , " + printList(list.tail);
} 


module.exports = {list: List, nil: Nil};
},{}],4:[function(require,module,exports){
/**
  * cordinate implementaiton
  **/
  var Coordinate = function(x,y) {
  	this.x=x;
  	this.y=y;
    this.z=0;
  };

  Coordinate.prototype = {
  	add : function(other){
      return new Coordinate(this.x+other.x, this.y+other.y);
  	},

    _rotate : function(angle){

      var rotM = [[Math.cos(angle), Math.sin(angle),0],
                  [-Math.sin(angle), Math.cos(angle), 0],
                  [0,0,0]];

      return new Coordinate(parseInt((this.x*rotM[0][0]+this.y*rotM[0][1]+this.z*rotM[0][2]).toFixed(0)), parseInt((this.x*rotM[1][0]+this.y*rotM[1][1]+this.z*rotM[1][2]).toFixed(0)));
    },

    rotate90Right : function(){
      var ninety = Math.PI/2;
      return this._rotate(ninety);
    },

    rotate90Left : function(){
      var ninety = -Math.PI/2;
      return this._rotate(ninety);
    },

    equals : function(other){
      return this.x===other.x && this.y===other.y && other.z===this.z;
    }

  };

  module.exports=Coordinate;
},{}],5:[function(require,module,exports){


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


var Coordinate = require('./coordinate.js');
var Shape = require('./Shape.js');

var Board = require('./board.js');






},{"./Shape.js":1,"./board.js":2,"./coordinate.js":4}]},{},[5]);
