require('./index.js');
var Coordinate = require('./coordinate.js');
var Shape = require('./shape.js');

var Board = require('./board.js');


console.log(" Coordinates ");

var coord = new Coordinate(0,1);

console.log(" Coordinate equals should be true, result: " + coord.equals(coord));

console.log("\nRotate Coordinate right, expect 1,0 ");
console.log(coord.rotate90Right());


console.log("\nRotate Coordinate left, expect -1,0 ");
console.log(coord.rotate90Left());

console.log("\nAdd 1,1 to coordinate ");
console.log(coord.add(new Coordinate(1,1)));

console.log("\nRoated Coordinate right ");
console.log(coord.rotate90Right());


console.log("\nShapes\n")

//T-Shape
var shapeMap = [new Coordinate(0,0), new Coordinate(0,1), new Coordinate(0,2), new Coordinate(1,1)]


var shape = new Shape(coord, 0, shapeMap);

console.log(" Shape 1 ");
console.log(shape);

var newShape = shape.rotateRight90();

console.log(" Shape 2 - rotated right");
console.log(newShape);

var oldShape = newShape.rotateLeft90();

console.log(" Shape 3 - roated left");
console.log(oldShape);



var positionShape = new Shape(new Coordinate(5,5), 0, shapeMap);
console.log(" Shape 4 ");



console.log(" Contains point expect result to be true, result is: " + positionShape.containsPoint(new Coordinate(5,5)));
console.log(" Contains point expect result to be false, result is: " + positionShape.containsPoint(new Coordinate(2,7)));


console.log(" Intersects test with self expect true, result is: " + positionShape.intersects(positionShape));

var otherPositionShape = new Shape(new Coordinate(10,10), 0, shapeMap);
console.log(" Intersects test with other expect false, result is: " + positionShape.intersects(otherPositionShape));

var otherPositionShapeTouch = new Shape(new Coordinate(5,3), 0, shapeMap);
console.log(" Intersects test with other touching expect true, result is: " + positionShape.intersects(otherPositionShapeTouch));


console.log("\n BOARD TESTS \n");

var board = new Board(15,15);

console.log("Can add shape expect true, result is: " + board.addShape(positionShape));

var rotatedShape = otherPositionShape.rotateLeft90();
console.log("Add shape expect true, result is: " + board.addShape(rotatedShape));

console.log(" Board \n " + board.draw());
