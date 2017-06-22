// var ConvertLib = artifacts.require("./ConvertLib.sol");
var BattleShip = artifacts.require("./BattleShip.sol");

module.exports = function(deployer, network, accounts) {
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, BattleShip);
  deployer.deploy(BattleShip);
  console.log(accounts);
};
