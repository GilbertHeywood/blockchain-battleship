class Game {
  constructor(Battleship,$state,$timeout){
    this.Battleship = Battleship;
    this.$state = $state;
    this.$timeout = $timeout;
    this.gameId = this.$state.params.id;
    this.getGameData();
    this.getBoard();
    this.getOtherBoard();
    this.laying = {};

    this.Battleship.watch('MadeMove',async (err, result) => {
      this.getOtherBoard();
    })

  }
  get currentState(){
    if(this.data)
      return this.Battleship.states[this.data.gameState.toNumber()];
  }
  async getGameData(){
    this.data = await this.Battleship.call('games',[this.gameId]);
  }
  async getBoard(){
    let board = await this.Battleship.call('showBoard',[this.gameId]);
    board = board.map((row) => row.map((ele) => ele.toNumber()));
    console.log(board);
    var boardTranspose = board[0].map((col, i) => {
      return board.map((row) => row[i])
    });
    this.$timeout(() => this.board = boardTranspose);
  }
  async getOtherBoard(){
    let board = await this.Battleship.call('showOtherPlayerBoard',[this.gameId]);
    board = board.map((row) => row.map((ele) => ele.toNumber()));
    var boardTranspose = board[0].map((col, i) => {
      return board.map((row) => row[i])
    });
    this.$timeout(() => this.otherBoard = boardTranspose);
  }
  async startGame(){
    await this.Battleship.transaction('finishPlacing',[this.gameId]);
    await this.getGameData();
  }
  async makeMove(x,y){
    await this.Battleship.transaction('makeMove',[this.gameId,x,y]);
  }
  async layPiece(x,y){
    if(this.board[y][x] > 0) return;
    if(this.placing) return;
    this.placing = true;
    try{
      if(this.laying.x == x && this.laying.y == y){
        this.laying.x = null;
        this.laying.y = null;
        this.placed = false;
      }else if(this.placed){
        let startX = Math.min(this.laying.x,x);
        let startY = Math.min(this.laying.y,y);
        let endX = Math.max(this.laying.x,x);
        let endY = Math.max(this.laying.y,y);
        await this.Battleship.transaction('placeShip',[this.gameId,startX,endX,startY,endY]);
        await this.getBoard();
        this.placed = false;
        this.laying.x = null;
        this.laying.y = null;
      }else{
        this.laying.x = x;
        this.laying.y = y;
        this.placed = true;
      }
    }catch(e){
      console.log(e);
    }
    this.placing = false;
  }

}

Game.$inject = ['Battleship','$state','$timeout'];

let templateUrl = require('ngtemplate-loader!html-loader!./game.html');

export default {
  templateUrl: templateUrl,
  controller: Game,
  controllerAs: '$ctrl'
}
