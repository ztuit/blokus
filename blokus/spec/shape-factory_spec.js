require('../src/index.js');
var ShapeFactory = require('../src/shape-factory.js');



describe("Blokus Tests", function(){

describe("Shape Factory Test", function() {

    it("Can build shape map", function() {
      var shapeFactory = new ShapeFactory();
      var ss = shapeFactory.buildShapeSet('blue');
      expect(ss).not.toBeNull();
    });

    it("Can get coordinates from shape map", function() {
      var shapeFactory = new ShapeFactory();
      var ss = shapeFactory.buildShapeSet('blue');

      ss.map(function(s){
        expect(s.getCoordinates()).not.toBeNull();
      }.bind(this));
    });

    it("print t shape ", function() {
      var shapeFactory = new ShapeFactory();
      var ss = shapeFactory.buildShapeSet('blue');
      console.log(" t tile");
      console.log(ss.get(shapeFactory.tileIndex.ttile).toString());
    });


  });


});
