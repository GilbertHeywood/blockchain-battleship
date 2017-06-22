require('babel-polyfill');
var BattleShip = artifacts.require("./BattleShip.sol");

contract('BattleShip', async (accounts) => {

  it("should not have any players defined when the contract is created", async () => {
    var battleship = await BattleShip.deployed();
    let player1 = await battleship.player1.call();
    assert.equal(player1,"0x0000000000000000000000000000000000000000","Player1 was defined");
    let player2 = await battleship.player2.call();
    assert.equal(player2,"0x0000000000000000000000000000000000000000","Player1 was defined");
  });

  it("the players should be assigned when a new game starts", async () => {
    var battleship = await BattleShip.deployed();
    await battleship.newGame(accounts[1],{from: accounts[0]});
    let player1 = await battleship.player1.call();
    assert.equal(player1,accounts[0],"Player1 was not defined correctly");
    let player2 = await battleship.player2.call();
    assert.equal(player2,accounts[1],"Player2 was not defined correctly");
  });


  it("the players should be still attached to contract", async () => {
    var battleship = await BattleShip.deployed();
    let player1 = await battleship.player1.call();
    assert.equal(player1,accounts[0],"Player1 was not defined correctly");
    let player2 = await battleship.player2.call();
    assert.equal(player2,accounts[1],"Player2 was not defined correctly");
  });

  it("the players shouldn't be able to start the game yet", async () => {
    var battleship = await BattleShip.deployed();
    try{
      await battleship.startGame();
    }catch(e){

    }
    let starting = await battleship.starting.call();
    assert.equal(starting, false, "The game started without both players putting in funds");
  });

  it("the players should be able to add funds", async () => {
    let _player1funds = 10;
    let _player2funds = 20;
    var battleship = await BattleShip.deployed();
    await battleship.addFunds({from: accounts[0], value: _player1funds});
    await battleship.addFunds({from: accounts[1], value: _player2funds});
    let player1funds = await battleship.getFunds.call(accounts[0]);
    let player2funds = await battleship.getFunds.call(accounts[1]);
    assert.equal(player1funds.toNumber(),_player1funds,"Player1 was not defined correctly");
    assert.equal(player2funds.toNumber(),_player2funds,"Player2 was not defined correctly");
  });


  it("the players should be able to start the game", async () => {
    var battleship = await BattleShip.deployed();
    await battleship.startGame();
    let starting = await battleship.starting.call();
    assert.equal(starting, true, "The game didn't started when funds were in the account");
  });

  it("the players should be able to see their board", async () => {
    var battleship = await BattleShip.deployed();
    let board = await battleship.showBoard({from: accounts[0]});
    let boardNumbers = board.map((row) => {
      return row.map((col) => col.toNumber());
    });
    console.log(boardNumbers);
    let allZero = boardNumbers.reduce((c,row) => c && row.reduce((c,ele) => c && ele == 0, true), true);
    assert.equal(allZero,true,"The elements are not all initialized to zero");
  });

  it("the players should be able to place their pieces", async () => {
    var battleship = await BattleShip.deployed();
    await battleship.placeShip(0,2,0,0,{from: accounts[0]});
    let board = await battleship.showBoard({from: accounts[0]});
    let boardNumbers = board.map((row) => {
      return row.map((col) => col.toNumber());
    });
    assert.equal(boardNumbers[0][0],2,"Piece not placed right");
    assert.equal(boardNumbers[1][0],2,"Piece not placed right");
    assert.equal(boardNumbers[2][0],2,"Piece not placed right");
  });

});
