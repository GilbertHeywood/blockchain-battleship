pragma solidity ^0.4.2;

import "./StringLib.sol";

contract BattleShip {
    
    address public player1;
    address public player2;
    address public currentPlayer;
    bool public settingUp;
    bool public starting;
    bool public started;
    bool public ended;

    uint8 maxBoatLength;
    uint8 minBoatLength;
    
    mapping(address => uint) playerFunds;
    mapping(address => int8[10][10]) playerGrids;
    mapping(address => bool[4]) playerShips;

    event HitBattleShip(address currentPlayer, uint8 x, uint8 y, int8 pieceHit);
    event WonChallenged(address player);
    event GameEnded(address winner);

    modifier isPlayer() {
        if(msg.sender == player1 || msg.sender == player2) _;
    }

    modifier isCurrentPlayer() {
        if(msg.sender == currentPlayer) _;
    }

    modifier isSettingUp() {
        if(settingUp) _;
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
        for(uint8 i = 0; i < 10; i++) {
            for(uint8 j = 0; j < 10; j++) {
                playerGrids[player][i][j] = 0;
            }
        }
    }

    function findOtherPlayer(address player) internal constant returns(address) {
        if(player == player1) return player2;
        return player1;
    }

    function getFunds(address player) constant returns(uint funds){
        return playerFunds[player];
    }

    function BattleShip() {
        maxBoatLength = 5;
        minBoatLength = 2;
    }

    function newGame(address _player2) {
        player1 = msg.sender;
        player2 = _player2;
        currentPlayer = player1;
        settingUp = true;
        setUpBoard(player1);
        setUpBoard(player2);
    } 

    function showBoard() isPlayer constant returns(int8[10][10] board) {
        return playerGrids[msg.sender];
    }

    function addFunds() isPlayer isSettingUp payable  {
        playerFunds[msg.sender] += msg.value;
    }

    function startGame() isPlayer isSettingUp {
        require(playerFunds[player1] > 0 && playerFunds[player2] > 0);
        settingUp = false;
        starting = true;
    }
    
    function placeShip(uint8 startX, uint8 endX, uint8 startY, uint8 endY) isPlayer gameStarting {
        require(startX == endX || startY == endY);
        require(startX < endX || startY < endY);
        require(startX  < 10 && startX  >= 0 &&
                endX    < 10 && endX    >= 0 &&
                startY  < 10 && startY  >= 0 &&
                endY    < 10 && endY    >= 0);
        uint8 boatLength;
        if(startX == endX) {
            boatLength = uint8(abs(int(startY) - int(endY)));
        }else if(startY == endY) {
            boatLength = uint8(abs(int(startX) - int(endX)));
        }
        require(boatLength <= maxBoatLength && boatLength >= minBoatLength);
        require(!(playerShips[msg.sender][boatLength - minBoatLength]));
        playerShips[msg.sender][boatLength - minBoatLength] = true;

        uint8 placements = 0;
        for(uint8 x = startX; x <= endX; x++) {
            for(uint8 y = startY; y <= endY; y++) {
                playerGrids[msg.sender][x][y] = int8(boatLength);
                placements += 1;
                if(placements == boatLength) return;
            }   
        }
    }

    function finishPlacing() isPlayer gameStarting {
        bool ready = true;
        for(uint8 i = 0; i <= maxBoatLength - minBoatLength; i++) {
            if(!playerShips[player1][i] || !playerShips[player2][i]) {
                ready = false;
                break;
            }
        }
        require(ready);
        started = true;
        starting = false;
    }

    function makeMove(uint8 x, uint8 y) gameStarted isCurrentPlayer {
        address otherPlayer = findOtherPlayer(msg.sender);
        require(playerGrids[otherPlayer][x][y] >= 0);
        if(playerGrids[otherPlayer][x][y] > 0) {
            HitBattleShip(msg.sender,x,y,playerGrids[otherPlayer][x][y]);
            playerGrids[otherPlayer][x][y] = -1 * playerGrids[otherPlayer][x][y];
        }
        currentPlayer = otherPlayer;
    }

    function sayWon() gameStarted {
        WonChallenged(msg.sender);
        address otherPlayer = findOtherPlayer(msg.sender);
        uint8 requiredToWin = 0;
        for(uint8 i = minBoatLength; i <= maxBoatLength; i++){
            requiredToWin += i;
        }
        int8[10][10] otherPlayerGrid = playerGrids[otherPlayer];
        uint8 numberHit = 0;
        for(i = 0;  i < 10; i++) {
            for(uint j = 0;  j < 10; j++) {
                if(otherPlayerGrid[i][j] < 0){
                    numberHit += 1;
                }
            }    
        }
        if(numberHit >= requiredToWin){
            started = false;
            ended = true;
            GameEnded(msg.sender);
        }
    }
}


