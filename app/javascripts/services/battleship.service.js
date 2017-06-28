// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

// Import our contract artifacts and turn them into usable abstractions.
import battleshipDef from '../../../build/contracts/Battleship.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var Battleship = contract(battleshipDef);

// any web3 provider
var provider = new Web3.providers.HttpProvider("http://localhost:8545");

// give it web3 powers!
Battleship.setProvider(provider);

class BattleshipService {
  constructor() {

  }
  async deployed() {
  	return await Battleship.deployed();
  }
}

BattleshipService.$inject = ['$q'];

export default BattleshipService;