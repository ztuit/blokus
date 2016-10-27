require('../src/index.js');
var Coordinate = require('../src/coordinate.js');
var Shape = require('../src/shape.js');

var Board = require('../src/board.js');


describe("Blokus Tests", function(){

describe("Coordinate Test", function() {

    it("Can add coordinates", function() {
    	var coord = new Coordinate(1,1);
    	expect(coord.equals(new Coordinate(1,1)))
    	.toBeTruthy();
    });

    it("Can rotate coordinates right", function() {
      var coord = new Coordinate(0,1);
      coord = coord.rotate90Right();
      expect(coord.equals(new Coordinate(1,0))).toBeTruthy();
    });

    it("Can rotate coordinates left", function() {
      var coord = new Coordinate(0,1);
      coord = coord.rotate90Left();
      expect(coord.equals(new Coordinate(-1,0))).toBeTruthy();
    });

    it("Can add coordinates", function() {
      var coord = new Coordinate(0,1);
      coord = coord.add(new Coordinate(1,1));
      expect(coord.equals(new Coordinate(1,2))).toBeTruthy();
    });

  });


});
