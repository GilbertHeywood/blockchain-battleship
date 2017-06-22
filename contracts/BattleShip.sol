pragma solidity ^0.4.2;

contract BattleShip {
    
    address public player1;
    address public player2;
    bool public starting;
    bool public started;
    bool public ended;

    uint maxBoatLength;
    uint minBoatLength;
    
    mapping(address => uint) playerFunds;
    
    mapping(address => uint[10][10]) playerGrids;
    mapping(address => bool[4]) playerShips;

    modifier isPlayer() {
        if(msg.sender == player1 || msg.sender == player2) _;
    }

    modifier gameStarting() {
        if(starting) _;
    }

    modifier gameStarted() {
        if(started) _;
    }

    function abs(int number) internal constant returns(uint unumber) {
        if(number < 0) return uint(-1 * number);
        return uint(number);
    }

    function setUpBoard(address player) internal {
        for(uint i = 0; i < 10; i++) {
            for(uint j = 0; j < 10; j++) {
                playerGrids[player][i][j] = 0;
            }
        }
    }

    // 0x14723a09acff6d2a60dcdf7aa4aff308fddc160c
    function BattleShip(address _player2) {
        player1 = msg.sender;
        player2 = _player2;
        maxBoatLength = 5;
        minBoatLength = 2;
        setUpBoard(player1);
        setUpBoard(player2);
    }

    function addFunds() isPlayer payable  {
        playerFunds[msg.sender] += msg.value;
    }

    function startGame() isPlayer  {
        require(playerFunds[player1] > 0 && playerFunds[player2] > 0);
        starting = true;
    }
    
    function placeShip(uint startX, uint startY, uint endX, uint endY) isPlayer {
        require(startX == endX || startY == endY);
        require(startX  < 10 && startX  >= 0 &&
                endX    < 10 && endX    >= 0 &&
                startY  < 10 && startY  >= 0 &&
                endY    < 10 && endY    >= 0);
        uint boatLength;
        if(startX == endX) {
            boatLength = abs(int(startY) - int(endY));
        }else if(startY == endY) {
            boatLength = abs(int(startX) - int(endX));
        }
        require(boatLength <= maxBoatLength && boatLength >= minBoatLength);
        require(!(playerShips[msg.sender][boatLength - 2]));
        playerShips[msg.sender][boatLength - 2] = true;

        for(uint x = startX; x <= endX; x++) {
            for(uint y = startY; y <= endY; y++) {
                playerGrids[msg.sender][x][y] = boatLength;
            }   
        }
    }

    function finishedPlacing() isPlayer constant returns(bool finished) {
        for(uint i = 0; i <= maxBoatLength - minBoatLength; i++) {
            if(!playerShips[player1][i- minBoatLength]) return false;
            if(!playerShips[player2][i- minBoatLength]) return false;
        }
        return true;
    }

    function showBoard() isPlayer constant returns(uint[10][10] board) {
        return playerGrids[msg.sender];
    } 

}