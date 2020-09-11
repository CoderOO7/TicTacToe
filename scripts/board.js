import {displayController}  from "./display.js";

const gameBoard = (function(doc){
  const boardArray = Array(9).fill(null);

  const _boardElement = doc.querySelector(".play-screen__board");

  const get = () => _boardElement;

  const getBoardArray = () => boardArray;

  const _isEmpty = (cell) => (cell === null ? true : false);

  function updateCell(index, marker) {
    const cell = boardArray[index];
    if (_isEmpty(cell)) {
      boardArray[index] = marker;
      return true;
    }
    return false;
  }

  return {
      get,
      getBoardArray,
      updateCell
  }
})(document);


export {gameBoard};