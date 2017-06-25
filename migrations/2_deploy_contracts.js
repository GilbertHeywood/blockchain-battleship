var BattleShip = artifacts.require("./BattleShip.sol");
var BattleShipGame = artifacts.require("./BattleShipGame.sol");

module.exports = function(deployer, network, accounts) {
  // deployer.deploy(StringLib);
  // deployer.link(StringLib, BattleShip);
  deployer.deploy(BattleShipGame);
  deployer.deploy(BattleShip);
  console.log(network);
  console.log(accounts);
};
