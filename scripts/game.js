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

  /**
   * Init the Players detail and their marker.
   */
  function _initPlayers() {
    const gameSettings = displayController.getGameSettings();
    player1 = playerFactory(gameSettings.player1Name, "X", true);
    player2 = playerFactory(gameSettings.player2Name, "O", false);
    isComputerOpponent = gameSettings.gameMode === 'single_player' ? true: false;
  }

  /**
   * Return true if its current player turn, else false
   * @param {Object} player - current player
   * @return {Boolean}
   */
  const _isPlayerTurn = (player) => player.isMyTurn;

  /**
   * Return the current player
   */
  function _getPlayerTurn() {
    return _isPlayerTurn(player1) ? player1 : player2;
  }

  /**
   * Switch player turn based on previous played player. 
   */
  function _changePlayerTurn() {
    if (player1.isMyTurn) {
      player1.isMyTurn = false;
      player2.isMyTurn = true;
    } else {
      player1.isMyTurn = true;
      player2.isMyTurn = false;
    }
  }

  /**
   * Used to optimize the time taken by minimax algo to do calculation,
   * by manually calculating first move of computer.
   * @return {Number} - The cell index value that is used for computer move. 
   */
  function _getComputerFirstOptimizedMove(){
    const boardArray = gameBoard.getBoardArray();
    if(boardArray[4] === null) return 4;
    else return 0;
  }

  /**
   * It implement the minimax algo and return the best move on the basis
   * of board State.
   * @param {Object} board - The gameboard
   * @param {Number} depth - The current level in recuresive tree
   * @param {Boolean} isMaximizing -  true if player is computer, else false 
   * @return {Number} choosen cell index value.
   */
  function _getComputerBestMove(board,depth=0,isMaximizing=true){
    // base condition
    if(_isPlayerWin('O')){
      return 100 - depth;
    }else if(_isPlayerWin('X')){
      return -100 + depth;
    }else if(_isGameTie()){
      return 0;
    }

    let moves = [];
    if(isMaximizing){ // If player is computer.
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

    }else if(!isMaximizing){ // If player is not computer.
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
        for(let i=0; i<moves.length; i++){
          if(moves[i].moveScore === bestMoveScore){
            return moves[i].index;
          } 
        }
        
      }
      return bestMoveScore;
    }
  }
   
  /**
   * Update the gameBoard after computer played its move. 
   */
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

  /**
   * Return true if active player win ,else false.
   */
  function _isPlayerWin(marker) {
    return gameBoard.computeRowMatch(marker)? true :
           gameBoard.computeColMatch(marker)? true :
           gameBoard.computeDiagonalMatch(marker) ? true : false;
  }


  /**
   * Return true if game tie ,else false.
   */
  function _isGameTie() {
    const boardArray = gameBoard.getBoardArray();
    return boardArray.every((cell) => cell !== null);
  }

  /**
   * Return true if game is over, else false.
   */
  function _isGameOver(marker) {
    return _isPlayerWin(marker) ? isWinnerFound = true : _isGameTie();
  }

  /**
   * Return true if active player win ,else false.
   */
  function _resetGameParams(){
    player1 = null;
    player2 = null;
    isComputerOpponent = false;
    isWinnerFound = false;
  }

  /**
   * Reset the game paramters and other rendering when game is over.
   */
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

  /**
   * Update the gameBoard after player played its move. 
   */
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

  /**
   * Return true if player1 and player2 are intialized,else false. 
   */
  function _isGameSettingAvailable() {
    if (player1 && player2) {
      return true;
    } else {
      _initPlayers();
      return player1 && player2;
    }
  }

  /**
   * Click Event Handler for boardElement
   * @param {Object} event - The `click` event object 
   */
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
