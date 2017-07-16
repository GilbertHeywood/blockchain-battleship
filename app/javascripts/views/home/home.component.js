class Home {
  constructor(Battleship,$state){
    this.Battleship = Battleship;
    this.$state = $state;
  }
  async newGame(){
    try{
      if(!this.Battleship.name) throw "You have to set your name first";
  	 let value = prompt("How much are you putting into the pot?");
  		value = parseInt(value);
      if(isNaN(value)) throw "Please enter a number!";
      if(value <= 0) throw "Please enter a number greater than zero!";
  		let result = await this.Battleship.transaction('newGame',[true],{value: value});
    }catch(e){
      alert(e)
    }
  }
  async setName() {
    let name = prompt("What's your new name? (Max 32 characters)");
    name = name.substring(0,32);
    let result = await this.Battleship.transaction('setName',[name]);
    this.Battleship.name = name;
  }
  async joinGame(game){
    let amountToBet = game.pot.toNumber() / 2;
    try{
      if(!this.Battleship.name) throw {};
      let result = await this.Battleship.transaction('joinGame',[game.id],{value: amountToBet});
    }catch(e){
      alert("Make sure your name is set to join a game");
    }
  }
  async playGame(game){
    this.$state.go('game',{id: game.id});
  }

  get myGames(){
    return this.Battleship.data.games.filter((e) => e.player1 == this.Battleship.data.account);
  }

  get joinedGames(){
    return this.Battleship.data.games.filter((e) => e.player2 == this.Battleship.data.account);
  }

  get otherGames(){
    return this.Battleship.data.games.filter((e) => e.player1 != this.Battleship.data.account && e.player2 != this.Battleship.data.account);
  }
}

Home.$inject = ['Battleship','$state'];

let templateUrl = require('ngtemplate-loader!html-loader!./home.html');

export default {
  templateUrl: templateUrl,
  controller: Home,
  controllerAs: '$ctrl'
}
