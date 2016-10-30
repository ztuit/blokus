require('../dto/dto');

class Player{
  constructor(colour, buffer){
    this._dto = new DTO(buffer || Player.playerDefaults(colour));
  }


  static playerDefaults(colour){
    return (new DTO()).setNode('colour',colour)
    .setNode('name', colour + " player")
    .setNode('turnsTaken', 0)
    .setNode('turnsPassed', 1)
    .setNode('lastTurnAt',"")
    .setNode('shapes',{}).buffer;
  }


  get lastTurnTime(){
    return this._dto.getNode('lastTurnAt').value;
  }

  get turnsTaken(){

  }

  get name(){
    return this._dto.getNode('name').value;
  }

  get passes(){

  }

  get colour(){
    return this._dto.getNode('colour').value;
  }


}



window.Player = Player;
