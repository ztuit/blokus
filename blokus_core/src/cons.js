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
    * Apply to each, defer to
    **/
   forEach : function(eachF){
     return this.map(function(el){
       eachF(el);
       return el;
     }.bind(this));
   },
   /**
    * Filter the list
    **/
   filter : function(filterF){
     return this._filter(this.head, this.tail, filterF, Nil);
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
   }

};


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

  filter : function(){
    return Nil;
  },

  Cons : function(other){
    return new ConsList(other, Nil);
  }

};


var cons = function(head, tail) {
  return new ConsList(head, tail);
};

var vlist = cons(1, cons(3, cons(42, cons(28, Nil))));


function printList(list){
	return list.isEmpty ? null : list.head + " , " + printList(list.tail);
}


module.exports = {list: ConsList, nil:Nil};
