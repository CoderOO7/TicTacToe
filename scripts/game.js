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

  function _getComputerFirstOptimizedMove(){
    const boardArray = gameBoard.getBoardArray();
    if(boardArray[4] === null) return 4;
    else return 0;
  }

  function _getComputerBestMove(board,depth=0,isMaximizing=true){
    if(_isPlayerWin('O')){
      return 100 - depth;
    }else if(_isPlayerWin('X')){
      return -100 + depth;
    }else if(_isGameTie()){
      return 0;
    }

    let moves = [];
    if(isMaximizing){
      let bestMoveScore = -100;
      let move={};
      board.getEmptyCells().forEach(index=>{
        board.getBoardArray()[index] = 'O';
        let moveScore = _getComputerBestMove(board,depth+1,false);
        board.getBoardArray()[index] = null;
        bestMoveScore = Math.max(bestMoveScore,moveScore);
        if(depth === 0){
          move = {moveScore,index};
          moves.push(move);
        }
      })
      if(depth === 0){
        for(let i=0; i<moves.length; i++){
          if(moves[i].moveScore === bestMoveScore){
            return moves[i].index;
          } 
        }
      }
      return bestMoveScore;
    }else if(!isMaximizing){
      let bestMoveScore = 100;
      let move = {};
      board.getEmptyCells().forEach(index=>{
        board.getBoardArray()[index] = 'X';
        let moveScore = _getComputerBestMove(board,depth+1,true);
        board.getBoardArray()[index] = null;
        bestMoveScore = Math.min(bestMoveScore,moveScore);
        if(depth === 0){
          move = {moveScore,index};
        }
      })
      if(depth === 0){
        console.log(moves);
        for(let i=0; i<moves.length; i++){
          if(moves[i].moveScore === bestMoveScore){
            return moves[i].index;
          } 
        }
        
      }
      return bestMoveScore;
    }
  }
    
  function _executeComputerPlay(){
    const cellIndex = gameBoard.getEmptyCells().length === 8 ? 
                      _getComputerFirstOptimizedMove() :
                      _getComputerBestMove(gameBoard,0,true);

    const isCellUpdated = gameBoard.updateCell(cellIndex, player2.marker);
  
    if(isCellUpdated){
      displayController.render();
      if(_isGameOver(player2.marker)){
        _initGameEnd(player2);
      }
    }
  }

  function _isPlayerWin(marker) {
    return gameBoard.computeRowMatch(marker)? true :
           gameBoard.computeColMatch(marker)? true :
           gameBoard.computeDiagonalMatch(marker) ? true : false;
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

  async function _initGameEnd(player){
    let text = '';
    if (isWinnerFound) {
      if(isComputerOpponent){
        if(player === player2){
          text = `${player1.name} Don't Cry`;
        }else{
          text = `${player1.name} You Are Genious`;
        }
      }else if(!isComputerOpponent){
          text = `${player.name} You Win The Game`;
      }
    } else if(!isWinnerFound){
      text = `it's totally scratch`;
    }
    displayController.clearBoard();
    await displayController.highlightWinningCoord();
    displayController.switchToEndScreen();
    displayController.displayGameEndMessage(text);
    gameBoard.reset();
    _resetGameParams();
  }

  function _executePlay(player, cellIndex) {
    const isCellUpdated = gameBoard.updateCell(cellIndex, player.marker);

    if (isCellUpdated) {
      displayController.render();
      if (_isGameOver(player.marker)) {
        _initGameEnd(player);        
      }else if(isComputerOpponent){
        setTimeout(_executeComputerPlay,100);
      }else if(!isComputerOpponent){
        _changePlayerTurn();
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
