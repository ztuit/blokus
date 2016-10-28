require('../src/index.js');
var ConsList = require('../src/cons.js');

var Shape = require('../src/shape.js');

var Coordinate = require('../src/coordinate.js');



describe("Blokus Tests", function(){

describe("Shape Tests", function() {

  it("Shape Builds ok", function() {
    var shapeMap = (new ConsList.list(new Coordinate(0,0))).Cons(new Coordinate(0,1))
                  .Cons(new Coordinate(0,2)).Cons(new Coordinate(1,1));

                var shape = new Shape(new Coordinate(0,0), shapeMap, 0);
              //  console.log("\n" + shape.toString());
                //expect(shape.toString()).toBe("X\nXX\nX\n");

  });

  it("Shape rotates ok Right", function() {
    var shapeMap = (new ConsList.list(new Coordinate(0,0))).Cons(new Coordinate(0,1))
                  .Cons(new Coordinate(0,2)).Cons(new Coordinate(1,1));

                var shape = new Shape(new Coordinate(0,0), shapeMap, 0);
                //  console.log("\n" + shape.toString());
                shape = shape.rotateLeft90();
              //  console.log("\n" + shape.toString());
                //expect(shape.toString()).toBe("X\nXX\nX\n");

  });

  it("Shape normalised ok", function() {
    var shapeMap = (new ConsList.list(new Coordinate(0,0))).Cons(new Coordinate(1,0))
                  .Cons(new Coordinate(2,0));

                var shape = new Shape(new Coordinate(0,0), shapeMap, 0);
                  console.log("\n pre rotate:\n" + shape.toString());
                shape = shape.rotateRight90();
                console.log("\n Poste rotate:\n" + shape.toString());
                //expect(shape.toString()).toBe("X\nXX\nX\n");

  });



  });


});
