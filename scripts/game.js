import { gameBoard } from "./board.js";
import { displayController } from "./display.js";

const playerFactory = (name, marker, isMyTurn) => {
  return { name, marker, isMyTurn };
};

const gameController = (function () {
  const boardElement = gameBoard.get();

  let player1 = null;
  let player2 = null;

  function _initPlayers() {
    const gameSettings = displayController.getGameSettings();
    player1 = playerFactory(gameSettings.player1Name, "X", true);
    player2 = playerFactory(gameSettings.player2Name, "O", false);
  }

  const _isPlayerTurn = (player) => player.isMyTurn;

  function _getPlayerTurn() {
    return _isPlayerTurn(player1) ? player1 : player2;
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

  function _gameWinner() {
    const boardArray = gameBoard.getBoardArray();
    if (boardArray[0] === boardArray[1] && boardArray[1] === boardArray[2]) {
      return true;
    }
    if (boardArray[3] === boardArray[4] && boardArray[4] === boardArray[5]) {
      return true;
    }
    if (boardArray[6] === boardArray[7] && boardArray[7] === boardArray[8]) {
      return true;
    }
    if (boardArray[0] === boardArray[3] && boardArray[3] === boardArray[6]) {
      return true;
    }
    if (boardArray[1] === boardArray[4] && boardArray[4] === boardArray[7]) {
      return true;
    }
    if (boardArray[0] === boardArray[4] && boardArray[4] === boardArray[8]) {
      return true;
    }
    if (boardArray[2] === boardArray[4] && boardArray[4] === boardArray[6]) {
      return true;
    }
    if (boardArray[6] === boardArray[7] && boardArray[7] === boardArray[8]) {
      return true;
    }
    false;
  }
  const _isWinner = () => _gameWinner(); 

  function _executePlay(player, cellIndex) {
    const isCellUpdated = gameBoard.updateCell(cellIndex, player.marker);
    if (isCellUpdated) {
      displayController.render();
      _changePlayerTurn();
      /* if(_isWinner){
          alert(`${player.name} win the game`);
      } */
    }
  }

  function _handleBoardClick(event) {
    const cellClicked = event.target.closest(".play-screen__board-cell");
    const player = _getPlayerTurn();
    if (cellClicked) {
      const cellIndex = event.target.getAttribute("data-cell-number") - 1;
      _executePlay(player, cellIndex);
    }
  }

  (function () {
    _initPlayers();
  })();

  boardElement.addEventListener("click", _handleBoardClick);
})();

export { gameController };
