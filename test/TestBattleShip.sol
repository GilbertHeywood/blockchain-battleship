pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/BattleShip.sol";

contract TestMetacoin {

  // function testInitialBalanceUsingDeployedContract() {
  //   BattleShip meta = BattleShip(DeployedAddresses.BattleShip());

  //   uint expected = 10000;

  //   Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 BattleShip initially");
  // }

  // function testInitialBalanceWithNewBattleShip() {
  //   BattleShip meta = new BattleShip();

  //   uint expected = 10000;

  //   Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 BattleShip initially");
  // }

}
