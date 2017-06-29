class Home {
  constructor(Battleship){
    this.Battleship = Battleship;
    this.battleship = Battleship.data;
  }
  async newGame(){
  	let value = prompt("How much are you putting into the pot?");
  	try{
  		value = parseInt(value);
  		let result = await this.Battleship.transaction('newGame',[true],{value: value});
  	}catch(e){
  		alert("Please enter a number!")
  	}
  }
  async joinGame(game){
    let amountToBet = game.pot.toNumber() / 2;
    let result = await this.Battleship.transaction('joinGame',[game.id],{value: amountToBet});
  }
}

Home.$inject = ['Battleship'];

let templateUrl = require('ngtemplate-loader!html-loader!./home.html');

export default {
  templateUrl: templateUrl,
  controller: Home,
  controllerAs: '$ctrl'
}
