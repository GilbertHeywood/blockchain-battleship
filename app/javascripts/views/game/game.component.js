class Game {
  constructor(Battleship,$state,$timeout){
    this.Battleship = Battleship;
    this.$state = $state;
    this.$timeout = $timeout;
    this.gameId = this.$state.params.id;
    this.laying = {};
    this.setup();
    this.Battleship.watch('MadeMove', async (err, result) => {
      await [this.getGameData(),this.getBoard(),this.getOtherBoard()];
      alert("Move has been placed");
    });
    this.Battleship.watch('StateChanged', async (err, result) => {
      await this.getGameData();
    });
    this.Battleship.watch('HitBattleShip', async (err, result) => {
      console.log(result);
    });
  }
  async setup(){
    await this.getGameData();
    await this.getBattleshipDimensions();
    await this.getBoard();
    await this.getOtherBoard();
    this.loaded = true;
  }
  numberOfShipsPlaced(board){
    if(!board) return 0;
    let ships = board.reduce((c1,row) => {
      return row.reduce((c2,ele) => {
        if(ele >= this.minBoatLength 
          && ele <= this.maxBoatLength 
          && !c2.includes(ele)
        ) c2.push(ele);
        return c2;
      },c1);
    },[]);
    return ships.length;
  }
  get currentState(){
    if(this.data)
      return this.Battleship.states[this.data.gameState.toNumber()];
  }
  async getGameData(){
    let data = await this.Battleship.call('games',[this.gameId]);
    if(data.player1 == "0x0000000000000000000000000000000000000000")
      this.$state.go("home");
    console.log(data.currentPlayer == this.Battleship.data.account);
    this.$timeout(() => this.data = data);
  }
  async getBattleshipDimensions(){
    let [minBoatLength, maxBoatLength] =  [await this.Battleship.call('minBoatLength'),await this.Battleship.call('maxBoatLength')];
    this.$timeout(() => {
      this.minBoatLength = minBoatLength.toNumber();
      this.maxBoatLength = maxBoatLength.toNumber();
    });
  }
  async getBoard(){
    let board = await this.Battleship.call('showBoard',[this.gameId]);
    board = board.map((row) => row.map((ele) => ele.toNumber()));
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
    try{
      await this.Battleship.transaction('finishPlacing',[this.gameId]);
      await this.getGameData();
    }catch(e){
      alert("Other player is still setting up their board");
    }
  }
  async makeMove(x,y){
    if(this.Battleship.data.account != this.data.currentPlayer){
      alert("it's not your turn, buddy");
      return;
    }
    if(!this.moving){
      this.moving = true;
      try{
        let tx = await this.Battleship.transaction('makeMove',[this.gameId,x,y]);
        console.log(tx);
      }catch(e){
        alert("Move has not been placed");
      }
      this.moving = false;
    }
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
      let length = 1 + Math.max(Math.abs(this.laying.x - x),Math.abs(this.laying.y - y));
      alert(`Have you already laid a length ${length} boat?`);
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
