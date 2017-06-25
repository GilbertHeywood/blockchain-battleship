pragma solidity ^0.4.2;

import './BattleShipGame.sol';

contract BattleShip {
	mapping(address => address[]) playerGames;

	function BattleShip() {

	}

	function newGame(address player1, address player2) {
		address newGame = new BattleShipGame(player1, player2);
		playerGames[player1].push(newGame);
		playerGames[player2].push(newGame);
	}

	function findGames(address player) constant returns(address[]) {
		return playerGames[player];
	}

}