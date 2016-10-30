

class DTO{

  constructor(buffer={}){
      this._buffer=buffer;
  }

  getNode(name){
    var node = typeof(this._buffer[name])==='object' ? JSON.parse(JSON.stringify(this._buffer[name])) : this._buffer[name];
    return new DTO(node, name);
  }



  setNode(name, value){
    var newBuffer = this.buffer;
    newBuffer[name]=value;
    return new DTO(newBuffer);
  }

  get value(){
    return this.buffer;
  }

  get buffer(){
    return typeof(this._buffer)==='object' ? JSON.parse(JSON.stringify(this._buffer)) : this._buffer;
  }


}

window.DTO = DTO;
