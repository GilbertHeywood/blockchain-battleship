require('babel-polyfill');
let BattleShipGame = artifacts.require("./BattleShipGame.sol");
let BattleShip = artifacts.require("./BattleShip.sol");

contract('BattleShip', async (accounts) => {    
    it("should not have any games accociated with accounts", async () => {
        let battleship = await BattleShip.deployed();
        let games = await battleship.findGames(accounts[0]);
        assert.equal(games.length, 0, "Player should have had no game");
    });
    it("should be able to create games", async () => {
        let battleship = await BattleShip.deployed();
        let result = await battleship.newGame(accounts[0],accounts[1]);
        let games1 = await battleship.findGames(accounts[0]);
        let games2 = await battleship.findGames(accounts[1]);
        assert.equal(games1.length, 1, "Player should have had no game");
        assert.equal(games2.length, 1, "Player should have had no game");
    });
});
