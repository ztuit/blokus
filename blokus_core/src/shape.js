var Coordinate = require('./coordinate.js');
/**
 * Shape implementation
 **/
var Shape = function(colour, shapeMap, position){
	this.position = position || new Coordinate(0,0);
	this.colour = colour;
	this.shapeMap=shapeMap;
	this.width=0;
	this.height=0;
	this.getCoordinates().forEach(function(el){
		this.width=Math.max(el.x+1,this.width);
		this.height=Math.max(el.y+1, this.height);
	}.bind(this));
};

Shape.prototype = {

	rePosition : function(newPos){
		return new Shape(this.colour, this.shapeMap, newPos);
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
		return new Shape(this.colour, newShapeMap, this.postion);
	},
	rotateRight90 : function(){
		var newShapeMap = this.shapeMap.map(function(v){
				return v.rotate90Right();
		});
		return new Shape(this.colour, newShapeMap, this.position);
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
		var coords = this.shapeMap;
		var lastCoord = coords.get(coords.length-1);
		var offSet = new Coordinate(-parseInt(lastCoord.x), -parseInt(lastCoord.y));
		var newShapeMap = coords.map(function(el){
				return el.add(offSet);
		}.bind(this));
		return new Shape(this.colour, newShapeMap);
	}
};

if(typeof window !== 'undefined'){
	window.Shape = Shape;
}
module.exports = Shape;
