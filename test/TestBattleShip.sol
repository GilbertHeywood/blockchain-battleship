pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/BattleShip.sol";

contract TestBattleShip {

  function testInitialBalanceUsingDeployedContract() {
    BattleShip meta = BattleShip(DeployedAddresses.BattleShip());
  }

  function testInitialBalanceWithNewBattleShip() {
    BattleShip meta = new BattleShip();
  }

}
