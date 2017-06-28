class Home {
  constructor(Battleship){
    this.Battleship = Battleship;
  }
}

Home.$inject = ['Battleship'];

export default {
  template: require('ngtemplate-loader!./home.html'),
  controller: Home,
  bindings: {
    'landing': '<'
  }
}
