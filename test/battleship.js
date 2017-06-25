require('babel-polyfill');
let BattleShipGame = artifacts.require("./BattleShipGame.sol");
let BattleShip = artifacts.require("./BattleShip.sol");

contract('BattleShip', async (accounts) => {    
    it("should not have any games accociated with accounts", async () => {
        let battleship = await BattleShip.deployed();
        let games = await battleship.findGames(accounts[0]);
        console.log(games);
    });
});
