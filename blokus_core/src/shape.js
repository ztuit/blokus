var Coordinate = require('./coordinate.js');
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
