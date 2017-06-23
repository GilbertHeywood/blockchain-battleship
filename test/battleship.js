require('babel-polyfill');
let BattleShip = artifacts.require("./BattleShip.sol");

contract('BattleShip', async (accounts) => {

  it("should not have any players defined when the contract is created", async () => {
    let battleship = await BattleShip.deployed();
    let player1 = await battleship.player1.call();
    assert.equal(player1,"0x0000000000000000000000000000000000000000","Player1 was defined");
    let player2 = await battleship.player2.call();
    assert.equal(player2,"0x0000000000000000000000000000000000000000","Player1 was defined");
  });

  it("the players should be assigned when a new game starts", async () => {
    let battleship = await BattleShip.deployed();
    await battleship.newGame(accounts[1],{from: accounts[0]});
    let player1 = await battleship.player1.call();
    assert.equal(player1,accounts[0],"Player1 was not defined correctly");
    let player2 = await battleship.player2.call();
    assert.equal(player2,accounts[1],"Player2 was not defined correctly");
  });


  it("the players should be still attached to contract", async () => {
    let battleship = await BattleShip.deployed();
    let player1 = await battleship.player1.call();
    assert.equal(player1,accounts[0],"Player1 was not defined correctly");
    let player2 = await battleship.player2.call();
    assert.equal(player2,accounts[1],"Player2 was not defined correctly");
  });

  it("the players shouldn't be able to start the game yet", async () => {
    let battleship = await BattleShip.deployed();
    try{
      await battleship.startGame();
    }catch(e){

    }
    let starting = await battleship.starting.call();
    assert.equal(starting, false, "The game started without both players putting in funds");
  });

  it("the players should be able to add funds", async () => {
    let battleship = await BattleShip.deployed();
    let _player1funds = 10;
    let _player2funds = 20;
    await battleship.addFunds({from: accounts[0], value: _player1funds});
    await battleship.addFunds({from: accounts[1], value: _player2funds});
    let player1funds = await battleship.getFunds.call(accounts[0]);
    let player2funds = await battleship.getFunds.call(accounts[1]);
    assert.equal(player1funds.toNumber(),_player1funds,"Player1 was not defined correctly");
    assert.equal(player2funds.toNumber(),_player2funds,"Player2 was not defined correctly");
  });


  it("the players should be able to start the game", async () => {
    let battleship = await BattleShip.deployed();
    await battleship.startGame();
    let starting = await battleship.starting.call();
    assert.equal(starting, true, "The game didn't started when funds were in the account");
  });

  it("the players should be able to see their board", async () => {
    let battleship = await BattleShip.deployed();
    let board = await battleship.showBoard({from: accounts[0]});
    let boardNumbers = board.map((row) => {
      return row.map((col) => col.toNumber());
    });
    let allZero = boardNumbers.reduce((c,row) => c && row.reduce((c,ele) => c && ele == 0, true), true);
    assert.equal(allZero,true,"The elements are not all initialized to zero");
  });

  it("the players should be able to place their pieces", async () => {
    let battleship = await BattleShip.deployed();
    await battleship.placeShip(0,2,0,0,{from: accounts[0]});
    let board = await battleship.showBoard({from: accounts[0]});
    let boardNumbers = board.map((row) => {
      return row.map((col) => col.toNumber());
    });
    assert.equal(boardNumbers[0][0],2,"Piece not placed right");
    assert.equal(boardNumbers[1][0],2,"Piece not placed right");
    assert.equal(boardNumbers[2][0],0,"Piece not placed right");
  });

  it("the players should be able start game onces all pieces put down", async () => {
    let battleship = await BattleShip.deployed();
    await battleship.placeShip(0,3,1,1,{from: accounts[0]});
    await battleship.placeShip(0,4,2,2,{from: accounts[0]});
    await battleship.placeShip(0,5,3,3,{from: accounts[0]});
    await battleship.placeShip(0,2,0,0,{from: accounts[1]});
    await battleship.placeShip(0,3,1,1,{from: accounts[1]});
    await battleship.placeShip(0,4,2,2,{from: accounts[1]});
    await battleship.placeShip(0,5,3,3,{from: accounts[1]});

    let board1 = await battleship.showBoard({from: accounts[0]});
    let board1Numbers = board1.map((row) => {
      return row.map((col) => col.toNumber());
    });

    let board2 = await battleship.showBoard({from: accounts[1]});
    let board2Numbers = board2.map((row) => {
      return row.map((col) => col.toNumber());
    });

    await battleship.finishPlacing();
    let started = await battleship.started.call();

    assert.equal(started,true,"Game not able to start even though pieces are down");

  });

  it("the players shouldn't be able to make a move if it's not their turn", async () => {
    let battleship = await BattleShip.deployed();

    try{
      await battleship.makeMove(0,0,{from: accounts[1]});
    }catch(e){

    }
    let board1 = await battleship.showBoard({from: accounts[0]});
    let board1Numbers = board1.map((row) => {
      return row.map((col) => col.toNumber());
    });

    assert.equal(board1Numbers[0][0],2,"Shouldn't have been able to make that move");
    
  });

  it("the players should be able to move if it's their turn", async () => {
    let battleship = await BattleShip.deployed();

    let result = await battleship.makeMove(0,0,{from: accounts[0]});

    let board2 = await battleship.showBoard({from: accounts[1]});
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

    let result = await battleship.sayWon({from: accounts[0]});

    let numLogs = result.logs.length;
    assert.equal(result.logs[numLogs-1].event,"WonChallenged","The event had the wrong name");
    assert.equal(result.logs[numLogs-1].args.player,accounts[0],"The wrong player was assigned to event");
  });

  it("the player should be able to win the game", async () => {
    let battleship = await BattleShip.deployed();
    // Making moves
    await battleship.makeMove(0,0,{from: accounts[1]});
    await battleship.makeMove(1,0,{from: accounts[0]});
    await battleship.makeMove(1,0,{from: accounts[1]});
    await battleship.makeMove(0,1,{from: accounts[0]});
    await battleship.makeMove(2,0,{from: accounts[1]});
    await battleship.makeMove(1,1,{from: accounts[0]});
    await battleship.makeMove(3,0,{from: accounts[1]});
    await battleship.makeMove(2,1,{from: accounts[0]});
    await battleship.makeMove(4,0,{from: accounts[1]});
    await battleship.makeMove(0,2,{from: accounts[0]});
    await battleship.makeMove(5,0,{from: accounts[1]});
    await battleship.makeMove(1,2,{from: accounts[0]});
    await battleship.makeMove(6,0,{from: accounts[1]});
    await battleship.makeMove(2,2,{from: accounts[0]});
    await battleship.makeMove(7,0,{from: accounts[1]});
    await battleship.makeMove(3,2,{from: accounts[0]});
    await battleship.makeMove(8,0,{from: accounts[1]});
    await battleship.makeMove(0,3,{from: accounts[0]});
    await battleship.makeMove(9,0,{from: accounts[1]});
    await battleship.makeMove(1,3,{from: accounts[0]});
    await battleship.makeMove(0,1,{from: accounts[1]});
    await battleship.makeMove(2,3,{from: accounts[0]});
    await battleship.makeMove(0,2,{from: accounts[1]});
    await battleship.makeMove(3,3,{from: accounts[0]});
    await battleship.makeMove(0,3,{from: accounts[1]});
    await battleship.makeMove(4,3,{from: accounts[0]});

    let result = await battleship.sayWon({from: accounts[0]});

    let numLogs = result.logs.length;
    assert.equal(result.logs[numLogs-1].event,"GameEnded","The event had the wrong name");
    assert.equal(result.logs[numLogs-1].args.winner,accounts[0],"The wrong player was assigned to event");

    let board2 = await battleship.showBoard({from: accounts[1]});
    let board2Numbers = board2.map((row) => {
      return row.map((col) => col.toNumber());
    });

    console.log(board2Numbers);

  });

  

});
