class Home {
  constructor(Battleship,$state){
    this.Battleship = Battleship;
    this.$state = $state;
  }
  async newGame(){
  	let value = prompt("How much are you putting into the pot?");
  	try{
  		value = parseInt(value);
      if(isNaN(value)) throw {};
  		let result = await this.Battleship.transaction('newGame',[true],{value: value});
    }catch(e){
      alert("Please enter a number!")
    }
  }
  async joinGame(game){
    let amountToBet = game.pot.toNumber() / 2;
    let result = await this.Battleship.transaction('joinGame',[game.id],{value: amountToBet});
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
