import { gameBoard } from "./board.js";
import { displayController } from "./display.js";

const playerFactory = (name, marker, isMyTurn) => {
  return { name, marker, isMyTurn };
};

const gameController = (function () {
  const boardElement = gameBoard.get();

  let player1 = null;
  let player2 = null;
  let isComputerOpponent = false;
  let isWinnerFound = false;

  function _initPlayers() {
    const gameSettings = displayController.getGameSettings();
    player1 = playerFactory(gameSettings.player1Name, "X", true);
    player2 = playerFactory(gameSettings.player2Name, "O", false);
    isComputerOpponent = gameSettings.gameMode === 'single_player' ? true: false;
  }

  const _isPlayerTurn = (player) => player.isMyTurn;

  function _getPlayerTurn() {
    return _isPlayerTurn(player1) ? player1 : player2;
  }

  function _disableBoardClick() {
    boardElement.removeEventListener("click", _handleBoardClick, false);
  }

  function _changePlayerTurn() {
    if (player1.isMyTurn) {
      player1.isMyTurn = false;
      player2.isMyTurn = true;
    } else {
      player1.isMyTurn = true;
      player2.isMyTurn = false;
    }
  }

  
  function _getComputerMove(){
    const boardArray = gameBoard.getBoardArray();
    return Math.floor(Math.random()* boardArray.length);
  }
  
  const _isComputerMoveValid = (index) => gameBoard.getBoardArray()[index] === null;   

  function _computerTurn(){
    const cellIndex = _getComputerMove();
    if(_isComputerMoveValid(cellIndex)){
      return _executePlay(player2,cellIndex);
    }else{
      _computerTurn();
    }
  }

  function _isPlayerWin(marker) {
    const boardArray = gameBoard.getBoardArray();
    if (
      marker === boardArray[0] &&
      boardArray[0] === boardArray[1] &&
      boardArray[1] === boardArray[2]
    ) {
      return true;
    }
    if (
      marker === boardArray[3] &&
      boardArray[3] === boardArray[4] &&
      boardArray[4] === boardArray[5]
    ) {
      return true;
    }
    if (
      marker === boardArray[6] &&
      boardArray[6] === boardArray[7] &&
      boardArray[7] === boardArray[8]
    ) {
      return true;
    }
    if (
      marker === boardArray[0] &&
      boardArray[0] === boardArray[3] &&
      boardArray[3] === boardArray[6]
    ) {
      return true;
    }
    if (
      marker === boardArray[1] &&
      boardArray[1] === boardArray[4] &&
      boardArray[4] === boardArray[7]
    ) {
      return true;
    }
    if (
      marker === boardArray[0] &&
      boardArray[0] === boardArray[4] &&
      boardArray[4] === boardArray[8]
    ) {
      return true;
    }
    if (
      marker === boardArray[2] &&
      boardArray[2] === boardArray[4] &&
      boardArray[4] === boardArray[6]
    ) {
      return true;
    }
    if (
      marker === boardArray[6] &&
      boardArray[6] === boardArray[7] &&
      boardArray[7] === boardArray[8]
    ) {
      return true;
    }
    false;
  }

  function _isGameTie() {
    const boardArray = gameBoard.getBoardArray();
    return boardArray.every((cell) => cell !== null);
  }

  function _isGameOver(marker) {
    return _isPlayerWin(marker) ? isWinnerFound = true : _isGameTie();
  }

  function _resetGameParams(){
    player1 = null;
    player2 = null;
    isComputerOpponent = false;
    isWinnerFound = false;
  }

  function _initGameEnd(player){
    let text = '';
    if (isWinnerFound) {
      if(isComputerOpponent){
        if(player === player2){
          text = `${player.name} Don't Cry`;
        }else{
          text = `${player1.name} You Are Genious`;
        }
      }else if(!isComputerOpponent){
          text = `${player.name} You Win The Game`;
      }
    } else if(!isWinnerFound){
      text = `it's totally scratch`;
    }
    _resetGameParams();
    gameBoard.emptyBoardArray();
    displayController.clearBoard();
    displayController.switchToEndScreen();
    displayController.displayGameEndMessage(text);
  }

  function _executePlay(player, cellIndex) {
    const isCellUpdated = gameBoard.updateCell(cellIndex, player.marker);

    if (isCellUpdated) {
      displayController.render();
      _changePlayerTurn();
      if (_isGameOver(player.marker)) {
        _initGameEnd(player);        
      }else if(isComputerOpponent === true && _getPlayerTurn() === player2){
        _computerTurn();
      } 
    }
  }

  function _isGameSettingAvailable() {
    if (player1 && player2) {
      return true;
    } else {
      _initPlayers();
      return player1 && player2;
    }
  }

  function _handleBoardClick(event) {
    if (!_isGameSettingAvailable()) return;
    const cellClicked = event.target.closest(".play-screen__board-cell");
    if (cellClicked && !isWinnerFound) {
      const cellIndex = event.target.getAttribute("data-cell-number") - 1;
      const player = _getPlayerTurn();
      _executePlay(player, cellIndex);
    }
  }
  
  boardElement.addEventListener("click", _handleBoardClick, false);
})();

export { gameController };
