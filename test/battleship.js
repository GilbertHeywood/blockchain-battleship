require('babel-polyfill');
let BattleShip = artifacts.require("./BattleShip.sol");

function printBoard(board) {
  var boardTranspose = board[0].map((col, i) => {
    return board.map((row) => {
      return row[i];
    })
  });
  let printedBoard = boardTranspose.reduce((c, row) => {
    return c + (row.map((col) => {
      let ele = col.toString();
      if(ele.length==1) ele = " " + ele;
      return ele;
    }) + '\n');
  }, '');
  return printedBoard;
}

contract('BattleShip', async (accounts) => {

  let battleship, transactionData, gameId;

  it("should be able to create a new game", async () => {
    battleship = await BattleShip.deployed();
    transactionData = await battleship.newGame(true,{from: accounts[0], value: 10});
    gameId = transactionData.logs[transactionData.logs.length - 1].args.gameId;

    let gameData = await battleship.games.call(gameId);
    assert.equal(gameData[0],accounts[0],"The player1 wasn't set correctly")
    assert.equal(gameData[1],"0x0000000000000000000000000000000000000000","Player2 was defined");
    assert.equal(gameData[4],0,"The game is not in the correct state");
  });

  it("the players shouldn't be able to join game if value is wrong", async () => {
    try{
      let result = await battleship.joinGame(gameId,{from: accounts[1], value: 20});
    }catch(e){
      // console.error(e);
    }
    let gameData = await battleship.games.call(gameId);
    assert.equal(gameData[0],accounts[0],"The player1 wasn't set correctly")
    assert.equal(gameData[1],"0x0000000000000000000000000000000000000000","Player2 was defined");
  });

  it("the players should be able to join game if value is right", async () => {
    let result = await battleship.joinGame(gameId,{from: accounts[1], value: 10});
    let gameData = await battleship.games.call(gameId);
    assert.equal(gameData[0],accounts[0],"The player1 wasn't set correctly")
    assert.equal(gameData[1],accounts[1],"The player2 wasn't set correctly");
    assert.equal(gameData[4],1,"The game is not in the correct state");
  });

  it("the players should be able to see their board", async () => {
    let board = await battleship.showBoard(gameId, {from: accounts[0]});
    let boardNumbers = board.map((row) => {
      return row.map((col) => col.toNumber());
    });
    let allZero = boardNumbers.reduce((c,row) => c && row.reduce((c,ele) => c && ele == 0, true), true);
    assert.equal(board.length == 10 && board[0].length == 10,true,"The board has the wrong dimensions");
    assert.equal(allZero,true,"The elements are not all initialized to zero");
  });

  it("the players should be able to place their pieces", async () => {
    await battleship.placeShip(gameId,0,2,0,0,{from: accounts[0]});
    let board = await battleship.showBoard(gameId,{from: accounts[0]});
    let boardNumbers = board.map((row) => {
      return row.map((col) => col.toNumber());
    });
    assert.equal(boardNumbers[0][0],2,"Piece not placed right");
    assert.equal(boardNumbers[1][0],2,"Piece not placed right");
    assert.equal(boardNumbers[2][0],0,"Piece not placed right");
  });

  it("the players should be able start game onces all pieces put down", async () => {
    await battleship.placeShip(gameId,0,3,1,1,{from: accounts[0]});
    await battleship.placeShip(gameId,0,4,2,2,{from: accounts[0]});
    await battleship.placeShip(gameId,0,5,3,3,{from: accounts[0]});
    await battleship.placeShip(gameId,0,2,0,0,{from: accounts[1]});
    await battleship.placeShip(gameId,0,3,1,1,{from: accounts[1]});
    await battleship.placeShip(gameId,0,4,2,2,{from: accounts[1]});
    await battleship.placeShip(gameId,0,5,3,3,{from: accounts[1]});

    let board1 = await battleship.showBoard(gameId,{from: accounts[0]});
    let board1Numbers = board1.map((row) => {
      return row.map((col) => col.toNumber());
    });

    let board2 = await battleship.showBoard(gameId,{from: accounts[1]});
    let board2Numbers = board2.map((row) => {
      return row.map((col) => col.toNumber());
    });

    
    await battleship.finishPlacing(gameId);

    let gameData = await battleship.games.call(gameId);
    assert.equal(gameData[4],2,"Game not able to start even though pieces are down");

  });

  it("the players shouldn't be able to make a move if it's not their turn", async () => {
    let battleship = await BattleShip.deployed();

    try{
      await battleship.makeMove(gameId,0,0,{from: accounts[1]});
    }catch(e){

    }
    let board1 = await battleship.showBoard(gameId,{from: accounts[0]});
    let board1Numbers = board1.map((row) => {
      return row.map((col) => col.toNumber());
    });

    assert.equal(board1Numbers[0][0],2,"Shouldn't have been able to make that move");
    
  });

  it("the players should be able to move if it's their turn", async () => {
    let battleship = await BattleShip.deployed();

    let result = await battleship.makeMove(gameId,0,0,{from: accounts[0]});

    let board2 = await battleship.showBoard(gameId,{from: accounts[1]});
    let board2Numbers = board2.map((row) => {
      return row.map((col) => col.toNumber());
    });
    assert.equal(board2Numbers[0][0],-2,"Should have been able to make that move");
    let numLogs = result.logs.length;
    assert.equal(result.logs[numLogs-1].event,"HitBattleShip","The event had the wrong name");
    assert.equal(result.logs[numLogs-1].args.pieceHit.toNumber(),2,"The piecewas the wrong one");
    assert.equal(result.logs[numLogs-1].args.x.toNumber(),0,"The x had the wrong value");
    assert.equal(result.logs[numLogs-1].args.y.toNumber(),0,"The y had the wrong value");
  });

  it("the player should be able to say they won at any time", async () => {
    let battleship = await BattleShip.deployed();

    let result = await battleship.sayWon(gameId,{from: accounts[0]});

    let numLogs = result.logs.length;
    assert.equal(result.logs[numLogs-1].event,"WonChallenged","The event had the wrong name");
    assert.equal(result.logs[numLogs-1].args.player,accounts[0],"The wrong player was assigned to event");
  });

  it("the player should be able to win the game", async () => {
    let battleship = await BattleShip.deployed();
    // Making moves
    await battleship.makeMove(gameId,0,0,{from: accounts[1]});
    await battleship.makeMove(gameId,1,0,{from: accounts[0]});
    await battleship.makeMove(gameId,1,0,{from: accounts[1]});
    await battleship.makeMove(gameId,0,1,{from: accounts[0]});
    await battleship.makeMove(gameId,2,0,{from: accounts[1]});
    await battleship.makeMove(gameId,1,1,{from: accounts[0]});
    await battleship.makeMove(gameId,3,0,{from: accounts[1]});
    await battleship.makeMove(gameId,2,1,{from: accounts[0]});
    await battleship.makeMove(gameId,4,0,{from: accounts[1]});
    await battleship.makeMove(gameId,0,2,{from: accounts[0]});
    await battleship.makeMove(gameId,5,0,{from: accounts[1]});
    await battleship.makeMove(gameId,1,2,{from: accounts[0]});
    await battleship.makeMove(gameId,6,0,{from: accounts[1]});
    await battleship.makeMove(gameId,2,2,{from: accounts[0]});
    await battleship.makeMove(gameId,7,0,{from: accounts[1]});
    await battleship.makeMove(gameId,3,2,{from: accounts[0]});
    await battleship.makeMove(gameId,8,0,{from: accounts[1]});
    await battleship.makeMove(gameId,0,3,{from: accounts[0]});
    await battleship.makeMove(gameId,9,0,{from: accounts[1]});
    await battleship.makeMove(gameId,1,3,{from: accounts[0]});
    await battleship.makeMove(gameId,0,1,{from: accounts[1]});
    await battleship.makeMove(gameId,2,3,{from: accounts[0]});
    await battleship.makeMove(gameId,0,2,{from: accounts[1]});
    await battleship.makeMove(gameId,3,3,{from: accounts[0]});
    await battleship.makeMove(gameId,0,3,{from: accounts[1]});
    await battleship.makeMove(gameId,4,3,{from: accounts[0]});

    let result = await battleship.sayWon(gameId,{from: accounts[0]});

    let numLogs = result.logs.length;

    let board1 = await battleship.showBoard(gameId,{from: accounts[0]});
    let board2 = await battleship.showBoard(gameId,{from: accounts[1]});

    console.log(printBoard(board1));
    console.log(printBoard(board2));
    
    assert.equal(result.logs[numLogs-1].event,"GameEnded","The event had the wrong name");
    assert.equal(result.logs[numLogs-1].args.winner,accounts[0],"The wrong player was assigned to event");
  });

  

});
