const gameBoard = (function(doc){
  const boardArray = Array(9).fill(null);
  let  winColIndices = Array(3).fill(null);
  const _boardElement = doc.querySelector(".play-screen__board");

  const get = () => _boardElement;

  const getBoardArray = () => boardArray;

  const _isEmpty = (cell) => (cell === null ? true : false);


  function _setWinColIndices(i1,i2,i3){
     winColIndices = [null,null,null];
     winColIndices.push(i1,i2,i3);
  }

  function getWinColIndices(){
    return winColIndices;
  }

  function getEmptyCells(){
    const emptyCellsIndex = [];
    boardArray.forEach((cell,index)=>{
      if(_isEmpty(cell))
        emptyCellsIndex.push(index);
    })
    return emptyCellsIndex;
  }

  function updateCell(index, marker) {
    const cell = boardArray[index];
    if (_isEmpty(cell)) {
      boardArray[index] = marker;
      return true;
    }
    return false;
  }

  function computeRowMatch(marker){
    if (
      marker === boardArray[0] &&
      boardArray[0] === boardArray[1] &&
      boardArray[1] === boardArray[2]
    ) {
      _setWinColIndices(0,1,2);
      return true;
    }
    else if (
      marker === boardArray[3] &&
      boardArray[3] === boardArray[4] &&
      boardArray[4] === boardArray[5]
    ) {
      _setWinColIndices(3,4,5);
      return true;
    }
    else if (
      marker === boardArray[6] &&
      boardArray[6] === boardArray[7] &&
      boardArray[7] === boardArray[8]
    ) {
      _setWinColIndices(6,7,8);
      return true;
    }else{
      _setWinColIndices(null,null,null); 
    }
  }

  function computeColMatch(marker){
    if (
      marker === boardArray[0] &&
      boardArray[0] === boardArray[3] &&
      boardArray[3] === boardArray[6]
    ) {
      _setWinColIndices(0,3,6);
      return true;
    }
    else if (
      marker === boardArray[1] &&
      boardArray[1] === boardArray[4] &&
      boardArray[4] === boardArray[7]
    ) {
      _setWinColIndices(1,4,7);
      return true;
    }
    else if (
      marker === boardArray[2] &&
      boardArray[2] === boardArray[5] &&
      boardArray[5] === boardArray[8]
    ) {
      _setWinColIndices(2,5,8);
      return true;
    }
    else{
      _setWinColIndices(null,null,null);
    }
  }

  function computeDiagonalMatch(marker){
    if (
      marker === boardArray[2] &&
      boardArray[2] === boardArray[4] &&
      boardArray[4] === boardArray[6]
    ) {
      _setWinColIndices(2,4,6);
      return true;
    }
    else if (
      marker === boardArray[0] &&
      boardArray[0] === boardArray[4] &&
      boardArray[4] === boardArray[8]
    ) {
      _setWinColIndices(0,4,8);
      return true;
    }
    else{
      _setWinColIndices(null,null,null)
    }
  }

  function reset(){
    boardArray.fill(null);
    winColIndices = [];
  }

  return {
      get,
      getBoardArray,
      getEmptyCells,
      getWinColIndices,
      reset,
      updateCell,
      computeRowMatch,
      computeColMatch,
      computeDiagonalMatch,
  }
})(document);


export {gameBoard};