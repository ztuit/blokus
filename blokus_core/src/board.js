var List = require('./cons.js');
var Coordinate = require('./coordinate.js');

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
