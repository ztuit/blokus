require('../src/index.js');
var ConsList = require('../src/cons.js');



describe("Blokus Tests", function(){

describe("Cons Test", function() {

  it("List length is correct", function() {
    var list = new ConsList.list('a');
    list = list.Cons('b');
    list = list.Cons('c');
    	expect(list.length).toBe(3);
  });

    it("Can find in list", function() {
      var list = new ConsList.list('a');
      list = list.Cons('b');
      list = list.Cons('c');

      expect(list.get(1)).toBe('b');
    });

    it("List map returns a cons list", function() {
      var list = new ConsList.list('a');
      list = list.Cons('b');
      list = list.Cons('c');
      list = list.map(function(c){
          return c + 1;
      });
      expect(list.get(1)).toBe('b1');
    });

  });


});
