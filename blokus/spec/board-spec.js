require('../src/index.js');
var ConsList = require('../src/cons.js');

var Shape = require('../src/shape.js');

var Board = require('../src/board.js');

var ShapeFactory = require('../src/shape-factory.js');

var Coordinate = require('../src/coordinate.js');

describe("Blokus Tests", function(){

describe("Board Tests", function() {

  it("Board Builds ok", function() {
    var board = new Board(15,15);

  //  console.log(board.draw());

  });

  it("Board Can add Shape ok", function() {
    var board = new Board(15,15);
      var shapeFactory = new ShapeFactory();
    var ss = shapeFactory.buildShapeSet('blue');
    var shp = ss.head.rePosition(new Coordinate(5,5));
    expect(board.addShape(shp)).toBeTruthy();

    //console.log(board.draw());

  });


  it("Board Can add Shape to first available place", function() {
    var board = new Board(15,15);
      var shapeFactory = new ShapeFactory();
    var ss = shapeFactory.buildShapeSet('blue');
    var shp = ss.get(4);
    expect(board.assignPlace(shp)).toBeTruthy();

    console.log(board.draw());

  });



  });


});
