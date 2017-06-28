class Home {
  constructor(Battleship){
    this.Battleship = Battleship;
    console.log("Here");
    console.log(this.Battleship);
  }
  async print(){
  	let battleship = await this.Battleship.deployed();
  	console.log(battleship);
  }
}

Home.$inject = ['Battleship'];

let templateUrl = require('ngtemplate-loader!html-loader!./home.html');
console.log(templateUrl);
export default {
  templateUrl: templateUrl,
  controller: Home
}
