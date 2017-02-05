(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.blokus = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var List = _dereq_('./cons.js');
var Coordinate = _dereq_('./coordinate.js');

var Board = function(width, height){

	this.width = width;
	this.height = height;
	this.list = List.nil;
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

	/**
	 * Adds a shape if it able to place it
	 **/
	addShape : function(shape){
		var rVal = false;
		if(this._canPlace(shape)){
			this.list = this.list.Cons(shape);
			rVal = true;
		}
		return rVal;
	},
	/**
	 * Find a place for the shape if possible, and assign coordinates.
	 **/
	assignPlace : function(shape){
		//Try to place as is, and with all rotations
		return this._assignPlace(shape) || this._assignPlace(shape.rotateRight90()) ||
						this._assignPlace(shape.rotateRight90().rotateRight90()) ||
						this._assignPlace(shape.rotateLeft90());

	},
	_assignPlace : function(shape){
		var placed = false;
		for(var i=this.height; i>=0 && !placed; i--){
			for(var j=0;j<this.width && !placed;j++) {
				if(this.addShape(shape.rePosition(new Coordinate(j,i)))){
					placed = true;
				}
			}
		}
		return placed;
	},
	/**
	 * Assign whole shape set regardless of constraints.
	 **/
	setShapes : function(shapes){
		this.list = shapes;
	},
	/**
	 * Private
	 **/
	_canPlace : function(shape){
		var canPlace = true;
		shape.getCoordinates().forEach(function(e){
			if(e.x<0 || e.x >= this.width || e.y < 0 || e.y > this.height){
				canPlace = false;
			}
			return e;
		}.bind(this));

		if(canPlace){
			var csi = this._checkShapeIntersects(shape, this.list);
			var tc = this._touchesCorner(shape, this.list);
			var tb = this._touchesOwnBorders(shape, this.list);
			canPlace = (csi===false &&
									tc===true && tb===false) || (csi==false && this._isStartingPiece(shape));


		}

		return canPlace;
	},

	/**
	 * See if the piece it about to be dropped in it's
	 * starting corner.
	 **/
	 _isStartingPiece : function(shape){
		 var point;
		 if(shape.colour==='blue'){
			 point = new Coordinate(0,0);
		 } else if(shape.colour==='red'){
			 point = new Coordinate(this.width-1,0);
		 } else if(shape.colour==='green'){
			 point = new Coordinate(0,this.height);
		 } else if(shape.colour==='yellow'){
			 point = new Coordinate(this.width-1,this.height);
		 }
		 return shape.containsPoint(point);
	 },

	/**
	 * See if there is an intersection in the shape set on the board
	 **/
	_checkShapeIntersects : function(s,l) {
		var rVal = false;
		if(l!==List.nil){
			rVal = l.head.intersects(s) ? true : this._checkShapeIntersects(s, l.tail);
		}
		return rVal;
	},

	/**
	 * Check borders.
	 * Must be of it's own colour.
	 **/
	_touchesOwnBorders : function(s,l){
		var rVal = false;
		if(l!==List.nil){
			rVal = (s.colour===l.head.colour && l.head.borders(s)) ? true : this._touchesOwnBorders(s, l.tail);
		}
		return rVal;
	},
	/**
	 * See if corners touch with a shape on the board.
	 * Must be of it's own colour
	 **/
	 _touchesCorner : function(s,l){
		 	var rVal = false;
	 		if(l!==List.nil){
	 			rVal = (s.colour===l.head.colour && l.head.touchesCorner(s)) ? true : this._touchesCorner(s, l.tail);
	 		}
	 		return rVal;
	 },

	_containsPoint : function(p,l){
		var rVal = false;
		if(l!==List.nil){
			rVal = l.head.containsPoint(p) ? true : this._containsPoint(p, l.tail);
		}
		return rVal;
	},

	findShapeAt : function(p){
		return this._findShapeAt(p, this.list);
	},
	_findShapeAt : function(p, l){
		var rVal = undefined;
		if(l!==List.nil && l.head!==List.nil){
			rVal = l.head.containsPoint(p) ? l.head : this._findShapeAt(p, l.tail);
		}
		return rVal;
	}


}


module.exports = Board;
if(typeof window !== 'undefined'){
	window.Board = Board;
}

},{"./cons.js":2,"./coordinate.js":3}],2:[function(_dereq_,module,exports){
/**
 List impl
**/
var ConsList = function(head, tail) {
  tail = tail || Nil;
  this.head = head;
  this.tail = tail;
  this.length = 1 + tail.length;
};

ConsList.prototype = {
  isEmpty : false,

  Cons : function(other){
    return new ConsList(other, this);
  },
  /**
   * Random access
   **/
  get : function(i) {
    return this._get(this, i, 0);
  },
  _get : function(item, index, currentIndex){
    return index===currentIndex ? item.head : this._get(item.tail, index, currentIndex+1);
  },


  /**
   * higher order map function
   **/
   reverseMap : function(mapF) {
     return this._reverseMap(mapF, this.tail, new ConsList(mapF(this.head)));
   },
   _reverseMap : function(mapF, elem, newList){
     var rVal = newList;
     if(elem!==Nil) {
       rVal = this._reverseMap(mapF, elem.tail, newList.Cons(mapF(elem.head)));
     }
     return rVal;
   },
   map : function(mapF){
     return this.reverseMap(mapF).reverseMap(function(m){return m;}.bind(this));
   },
   /**
    * Find an item
    * @return the item if found
    **/
   find : function(compF){
     return this._find(compF, this)
   },
   _find(compF, list, newList){
     var rVal = newList;
     if(list!==Nil && compF(list.head)){
          if(newList){
            rVal = newList.Cons(list.head);
          } else {
            rVal = new ConsList(list.head);
          }
     } else if(list!==Nil){
       rVal = this._find(compF, list.tail, rVal);
     }
     return rVal;
   },
   /**
    * See if this list contains an item
    * @return boolean
    **/
    contains : function(compF){
      return !!this.find(compF);
    },
   /**
    * Apply to each, defer to
    **/
   forEach : function(eachF){
     return this.map(function(el){
       eachF(el);
       return el;
     }.bind(this));
   },
   /**
    * Filter the list, preserving the order
    **/
   filter : function(filterF){
     return this._filter(this.head, this.tail, filterF, Nil).reverseMap(function(e){return e;});
   },
   _filter : function(ele, list, filterF, newList){

     if(list===Nil){
        return filterF(ele) ? newList.Cons(ele) : newList;
     } else {
       return filterF(ele) ? this._filter(list.head, list.tail, filterF, newList.Cons(ele)) :
                              this._filter(list.head, list.tail, filterF, newList);
     }

   },

   /**
    * subtract, the paramter from this list
    * @return a new list
    **/
    subtract : function(other){
      return this.filter(function(o){
        return !other.contains(o);
      }.bind(this));
    },



   /**
    * Replace an item.
    **/
    replace : function(cmpF, n){
      return this._replace(cmpF,n,this);
    },
    _replace : function(cmpF,n,l){
      return l===Nil ? l : (cmpF(l.head)===true) ? l.tail.Cons(n) : this._replace(cmpF,n,l.tail).Cons(l.head);
    },

   /**
    * Equals
   **/
   equals : function(other){
     var rVal = this.length === other.length;

     this.forEach(function(el){
       if(rVal===true && undefined===other.find(function(oel){
         return oel.equals(el);
       }.bind(this))){
         rVal = false;
       }
     }.bind(this));
     return rVal;
   },

   /**
    * To array
    **/
   toArray : function(){
     var rval = [];
     this.forEach(function(e){
       rval.push(rval);
     }.bind(this));
     return rval;
   }
};


/**
 * Nil or empty list.
 **/
var Nil = {
  isEmpty: true,
  length: 0,

  get head() {
    throw new Error('Accessing head on empty list.');
  },

  get tail() {
    throw new Error('Accessing tail on empty list.');
  },

  forEach : function(){

  },

  contains : function(){
    return false;
  },

  filter : function(){
    return Nil;
  },

  toArray : function(){
    return [];
  },

  Cons : function(other){
    return new ConsList(other, Nil);
  }

};

/**
 * Create a cons list from an Array
 * returns cons list.
 **/
function fromArray(array){
  var consList = Nil;
  array.forEach(function(e){
    consList = consList.Cons(e);
  }.bind(this));
  return consList;
}



module.exports = {list: ConsList, nil:Nil, arrayToCons:fromArray};

if(typeof window !== 'undefined'){
	window.ConsList = ConsList;
  window.NilCons = Nil;
  window.arrayToCons = fromArray;
}

},{}],3:[function(_dereq_,module,exports){
/**
  * cordinate implementaiton
  **/

  var ZROTM = [[1,1,0],[-1,1,0],[0,0,1]];
  var XROTM = [[1,0,0],[0,1,1],[0,-1,1]];
  var YROTM = [[1,0,-1],[0,1,0],[1,0,1]];

  var setIdX = function(mx){
    mx[0]=[1,0,0];
  }

  var setIdY = function(mx){
    mx[1]=[0,1,0];
  }

  var setIdZ = function(mx){
    mx[2]=[0,0,1];
  }

  var Coordinate = function(x,y) {
  	this.x=parseInt(x);
  	this.y=parseInt(y);
    this.z=0;
  };

  Coordinate.prototype = {
  	add : function(other){
      return new Coordinate(this.x+other.x, this.y+other.y);
  	},

    _rotate : function(angle, MX, setId){

    //  var rotM = [[Math.cos(angle), Math.sin(angle),0],
        //          [-Math.sin(angle), Math.cos(angle), 0],
      //            [0,0,0]];


var rotM = [[0,0,0],[0,0,0],[0,0,0]];
      rotM[0][0]=MX[0][0]*Math.cos(angle);
      rotM[0][1]=MX[0][1]*Math.sin(angle);
      rotM[0][2]=MX[0][2]*Math.sin(angle);

      rotM[1][0]=MX[1][0]*Math.sin(angle);
      rotM[1][1]=MX[1][1]*Math.cos(angle);
      rotM[1][2]=MX[1][2]*Math.sin(angle);

      rotM[2][0]=MX[2][0]*Math.sin(angle);
      rotM[2][1]=MX[2][1]*Math.sin(angle);
      rotM[2][2]=MX[2][2]*Math.cos(angle);

      setId(rotM);

      return new Coordinate(parseInt((this.x*rotM[0][0]+this.y*rotM[0][1]+this.z*rotM[0][2]).toFixed(0)), parseInt((this.x*rotM[1][0]+this.y*rotM[1][1]+this.z*rotM[1][2]).toFixed(0)));
    },

    rotate90Right : function(){
      var ninety = Math.PI/2;
      return this._rotate(ninety,ZROTM, setIdZ);
    },

    rotate90Left : function(){
      var ninety = -Math.PI/2;
      return this._rotate(ninety,ZROTM, setIdZ);
    },

    flipOverX : function(){
      var oneeighty = Math.PI;
      return this._rotate(oneeighty,XROTM, setIdX);
    },

    flipAroundY : function(){
      var ninety = Math.PI;
      return this._rotate(ninety,YROTM, setIdY);
    },



    equals : function(other){
      return this.x===other.x && this.y===other.y && other.z===this.z;
    },
    /**
     * Return true if the coordinates share
     * a value on any axis.
     **/
    borders : function(other){
      //TODO: Add Z check
      return (Math.abs(this.x-other.x)===1 && (this.y===other.y)) ||
             (Math.abs(this.y-other.y)===1 && (this.x===other.x));
    },
    /**
     * Returns true if the coordinates are offSet
     * by 1 in any dimension.
     **/
     corners : function(other){
       return Math.abs(this.x-other.x)===1 && Math.abs(this.y-other.y)===1;
     },

     /**
      * Get a dto version of this
      **/
      value : function(){
        return {x:this.x, y:this.y, z:this.z};
      }

  };

if(typeof window !== 'undefined'){
  window.Coordinate=Coordinate;
}

  module.exports=Coordinate;

},{}],4:[function(_dereq_,module,exports){
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

var ConsList = _dereq_('./cons.js');
var Coordinate = _dereq_('./coordinate.js');
var Shape = _dereq_('./shape.js');
var ShapeFactory = _dereq_('../src/shape-factory.js');
var Board = _dereq_('./board.js');


module.exports = {board:Board, coordinate:Coordinate, shape: Shape, shapeFactory:ShapeFactory};

},{"../src/shape-factory.js":5,"./board.js":1,"./cons.js":2,"./coordinate.js":3,"./shape.js":6}],5:[function(_dereq_,module,exports){

var Shape = _dereq_('./shape.js');
var Coordinate = _dereq_('./coordinate.js');
var ConsList = _dereq_('./cons.js');



var ShapeFactory = function(){
  this.tileIndex = {one:0, two:1, three:2, ltile:3, ttile:4, corner:5,
    foursq:6, snake:7, four:8, longL:9, bigT:10, bigCorner:11, longSnake:12,
    eygptian:13, five:14, bshape:15, mshape:16, chape:17, snakewithfoot:18, cross:19, lounge:20};
}


ShapeFactory.prototype = {

  /**
   * Build the full set of playing shapes for a given colour.
  **/
  buildShapeSet : function(colour){
    var id=0
    return this._shapeMaps().reverseMap(function(m){
      return new Shape(colour, m, id++).normalise();
    }.bind(this));

  },
  _shapeMaps : function(){
    var shapes = new ConsList.list(
                  new ConsList.list(new Coordinate(0,0))
                );
    //Two tiles
    shapes = shapes.Cons(this._growTile(shapes.head, new Coordinate(1,0)));
    //Three tiles
    shapes = shapes.Cons(this._growTile(shapes.head, new Coordinate(1,0)));
    //L shape tile
    shapes = shapes.Cons(this._growTile(shapes.head, new Coordinate(0,1)));
    //T shape tile
    shapes = shapes.Cons(this._growTile(shapes.get(1), new Coordinate(0,1), 1));
    //corner shape tile
    shapes = shapes.Cons(this._growTile(shapes.get(3), new Coordinate(0,1)));
    //Four Shape
    shapes = shapes.Cons(this._growTile(shapes.head, new Coordinate(-1,0)));
    //snake
    shapes = shapes.Cons(this._growTile(shapes.get(1), new Coordinate(1,0)));
    //four
    shapes = shapes.Cons(this._growTile(shapes.get(5), new Coordinate(1,0)));
    //long l
    shapes = shapes.Cons(this._growTile(shapes.head, new Coordinate(0,1)));
    //big t
    shapes = shapes.Cons(this._growTile(shapes.get(5), new Coordinate(0,1)));
    //big corner
    shapes = shapes.Cons(this._growTile(shapes.get(7), new Coordinate(0,1)));
    //long snake
    shapes = shapes.Cons(this._growTile(shapes.get(4), new Coordinate(1,0)));
    //eygptyion
    shapes = shapes.Cons(this._growTile(shapes.get(9), new Coordinate(0,-1),3));
    //five line
    shapes = shapes.Cons(this._growTile(shapes.get(5), new Coordinate(1,0)));
    //bshape
    shapes = shapes.Cons(this._growTile(shapes.get(8), new Coordinate(0,1)));
    //mshape
    shapes = shapes.Cons(this._growTile(shapes.get(8), new Coordinate(0,-1),3));
    //cshape
    var cshape = this._growTile(shapes.get(11), new Coordinate(0,1));
    shapes = shapes.Cons(this._growTile(cshape, new Coordinate(-1,0)));
    //snakewithfoot
    shapes = shapes.Cons(this._growTile(shapes.get(10), new Coordinate(0,-1),2));
    //cross
    shapes = shapes.Cons(this._growTile(shapes.get(14), new Coordinate(0,-1),2));
    //lounge
    shapes = shapes.Cons(this._growTile(shapes.get(15), new Coordinate(1,0),1));


    return shapes;
  },
  /**
   Push a new tile onto the tile map as
   an extension from an exisitng tile.
   **/
  _growTile(tilemap, offset, pos){
    pos = pos || 0;
    return tilemap.Cons(tilemap.get(pos).add(offset));
  }
};

if(typeof window !== 'undefined'){
  window.ShapeFactory = ShapeFactory;
}

module.exports = ShapeFactory;

},{"./cons.js":2,"./coordinate.js":3,"./shape.js":6}],6:[function(_dereq_,module,exports){
var Coordinate = _dereq_('./coordinate.js');
/**
 * Shape implementation
 **/
var Shape = function(colour, shapeMap, id, position){
	this.position = position || new Coordinate(0,0);
	this.colour = colour;
	this.shapeMap=shapeMap;
	this.id=id;
	this.width=0;
	this.height=0;
	this.getCoordinates().forEach(function(el){
		this.width=Math.max(Math.abs(el.x)+1,this.width);
		this.height=Math.max(Math.abs(el.y)+1, this.height);
	}.bind(this));
};

Shape.prototype = {

	rePosition : function(newPos){
		return new Shape(this.colour, this.shapeMap, this.id, newPos);
	},

	getCoordinates : function(){
		return this.shapeMap.map(function(v){
			return v.add(this.position);
		}.bind(this));
	},
	rotateLeft90 : function(){
		var newShapeMap = this.shapeMap.map(function(v){
				return v.rotate90Left();
		});
		return new Shape(this.colour, newShapeMap, this.id, this.postion);
	},
	rotateRight90 : function(){
		var newShapeMap = this.shapeMap.map(function(v){
				return v.rotate90Right();
		});
		return new Shape(this.colour, newShapeMap, this.id, this.position);
	},
	/**
	 * roatate the shape 180 defgrees
	 * around the X axis
	 **/
	flipOverX:function(){
		var newShapeMap = this.shapeMap.map(function(v){
				return v.flipOverX();
		});
		
		return new Shape(this.colour, newShapeMap, this.id, this.position);
	},
	/**
	 * Rotate the shape 180 degrees around the
	 * Y axis
	 **/
	flipAroundY:function(){
		var newShapeMap = this.shapeMap.map(function(v){
				return v.flipAroundY();
		});
		return new Shape(this.colour, newShapeMap, this.id, this.position);
	},
	/**
	 * This is more than just intersects, it
	 * also checks if the shape borders.
	 **/
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
	/**
	 * Sees if this shape shares a border with the other shape.
	 **/
	borders : function(other){
		var otherCoords = other.getCoordinates();
		var doesIntersects=false;
		this.getCoordinates().forEach(function(c){
				if(otherCoords.find(function(e){
					return c.borders(e);
				})){
					doesIntersects=true;
					return true;
				}
		});
		return doesIntersects;
	},
	/**
	 * Returns true if the given
	 * coordinate touches a corner.
	 **/
	 touchesCorner : function(otherShape){
		 var otherCoords = otherShape.getCoordinates();
 		var doesIntersects=false;
 		this.getCoordinates().forEach(function(c){
 				if(otherCoords.find(function(e){
 					return c.corners(e);
 				})){
 					doesIntersects=true;
 					return true;
 				}
 		});
 		return doesIntersects;
	 },
	/**
	 * Return true if the coordinate
	 * is contained within the shape.
	 **/
	containsPoint : function(coord){

		return this.getCoordinates().find(function(c){
			return c.equals(coord);
		}.bind(this)) ? true : false;
	},
	equals : function(other){
		return other instanceof Shape && this.colour===other.colour
							&& other.getCoordinates().equals(this.getCoordinates());
	},
	toString : function(){
		var coords = this.getCoordinates();
		var shapeStr = "";
		for(var height = coords.length; height >= -coords.length ; height--){
				var line = "";
				for(var width = -coords.length; width < coords.length; width++){
					if(this.containsPoint(new Coordinate(width, height))){
						line += 'X';
						//blankLine = false;
					} else {
						line += ' ';
					}
				}
				if(line.indexOf('X')!=-1){
					shapeStr += line + '\n';
				}
		}
		return shapeStr;
	},
	/**
	 * Move the shape to the origin
	 **/
	normalise : function(){
		//Find the point furthest from the origin
		var distanceTallyX = 1000;
		var distanceTallyY = 1000;
		var coords = this.shapeMap;
		coords.forEach(function(c){
			distanceTallyY = Math.min(distanceTallyY, c.y);
			distanceTallyX = Math.min(distanceTallyX, c.x);
		}.bind(this));
		var offSet = new Coordinate(-parseInt(distanceTallyX), -parseInt(distanceTallyY));
		var newShapeMap = coords.map(function(el){
				return el.add(offSet);
		}.bind(this));
		return new Shape(this.colour, newShapeMap, this.id);
	},

	value : function(){
		var smarray = [];
		this.shapeMap.forEach(function(c){
			smarray.push(c.value());
		}.bind(this));
		return {id:this.id, colour:this.colour, position: this.position.value(), map:smarray};
	}



};

if(typeof window !== 'undefined'){
	window.Shape = Shape;
}
module.exports = Shape;

},{"./coordinate.js":3}]},{},[4])(4)
});