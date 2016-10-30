require('../dto/dto');
require('./Player');

class Session{

  constructor(buffer){
      this._dto = new DTO(buffer || Session.defaults());
      this._turnMap = {
          'blue':'red',
          'red':'green',
          'green':'yellow',
          'yellow':'blue'
      };
  }

  static defaults(){
    var dto = new DTO();
    dto = dto.setNode('id', new Date());//TODO: real uuid
    dto = dto.setNode('players',
      {
        'blue':Player.playerDefaults('blue'),
        'red':Player.playerDefaults('red'),
        'yellow':Player.playerDefaults('yellow'),
        'green':Player.playerDefaults('green')
      });
    dto = dto.setNode('currentTurn', 'blue');
    return dto.buffer;
  }




  getPlayer(colour){
    return new Player('na', this._dto.getNode('players').getNode(colour).value);
  }

  nextTurn(){
    return new Session(this._dto.setNode('currentTurn',
                this._turnMap[this._dto.getNode('currentTurn').value]).buffer);
  }

  get currentTurn(){
    return this._dto.getNode('currentTurn').value;
  }

}



window.Session = Session;
