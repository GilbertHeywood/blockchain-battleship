var BattleShip = artifacts.require("./BattleShip.sol");

contract('BattleShip', function(accounts) {

  it("should not have any players defined when the contract is created", function() {
    var battleship;
    return BattleShip.deployed().then(function(instance) {
      battleship = instance;
      return battleship.player1.call();
    }).then(function(player1){
      assert.equal(player1,"0x0000000000000000000000000000000000000000","Player1 was defined")
      return battleship.player2.call();
    }).then(function(player2){
      assert.equal(player2,"0x0000000000000000000000000000000000000000","Player2 was defined")
    })
  });

  it("should the players should be assigned when a new game starts", function() {
    var battleship;
    return BattleShip.deployed().then(function(instance) {
      battleship = instance;
      return battleship.newGame(accounts[1],{from: accounts[0]});
    }).then(function(tx) {
      return battleship.player1.call();
    }).then(function(player1){
      assert.equal(player1,accounts[0],"Player1 was defined")
      return battleship.player2.call();
    }).then(function(player2){
      assert.equal(player2,accounts[1],"Player2 was defined")
    })
  });




  // it("should put 10000 MetaCoin in the first account", function() {
  //   return MetaCoin.deployed().then(function(instance) {
  //     return instance.getBalance.call(accounts[0]);
  //   }).then(function(balance) {
  //     assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
  //   });
  // });
  // it("should call a function that depends on a linked library", function() {
  //   var meta;
  //   var metaCoinBalance;
  //   var metaCoinEthBalance;

  //   return MetaCoin.deployed().then(function(instance) {
  //     meta = instance;
  //     return meta.getBalance.call(accounts[0]);
  //   }).then(function(outCoinBalance) {
  //     metaCoinBalance = outCoinBalance.toNumber();
  //     return meta.getBalanceInEth.call(accounts[0]);
  //   }).then(function(outCoinBalanceEth) {
  //     metaCoinEthBalance = outCoinBalanceEth.toNumber();
  //   }).then(function() {
  //     assert.equal(metaCoinEthBalance, 2 * metaCoinBalance, "Library function returned unexpeced function, linkage may be broken");
  //   });
  // });

  // it("should send coin correctly", function() {
  //   var meta;

  //   //    Get initial balances of first and second account.
  //   var account_one = accounts[0];
  //   var account_two = accounts[1];

  //   var account_one_starting_balance;
  //   var account_two_starting_balance;
  //   var account_one_ending_balance;
  //   var account_two_ending_balance;

  //   var amount = 10;

  //   return MetaCoin.deployed().then(function(instance) {
  //     meta = instance;
  //     return meta.getBalance.call(account_one);
  //   }).then(function(balance) {
  //     account_one_starting_balance = balance.toNumber();
  //     return meta.getBalance.call(account_two);
  //   }).then(function(balance) {
  //     account_two_starting_balance = balance.toNumber();
  //     return meta.sendCoin(account_two, amount, {from: account_one});
  //   }).then(function() {
  //     return meta.getBalance.call(account_one);
  //   }).then(function(balance) {
  //     account_one_ending_balance = balance.toNumber();
  //     return meta.getBalance.call(account_two);
  //   }).then(function(balance) {
  //     account_two_ending_balance = balance.toNumber();

  //     assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
  //     assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
  //   });
  // });
});
