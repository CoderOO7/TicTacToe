import {gameController} from './game.js';
import {gameBoard} from './board.js';

const displayController = (function(doc){
    const player1NameInput = doc.getElementById('pl-input');
    const player2NameInput = doc.getElementById('p2-input');
    const gameSettings = {}

    
    console.log({player1NameInput})

    function _setGameSettings(){
        gameSetting.player1Name = player1NameInput.value;
        gameSetting.player2Name = player1NameInput.value;
    }

    function _detectGameModeSelection(){
        
    }

    function render(){
        const boardElement = gameBoard.get();
        const boardArray = gameBoard.getBoardArray();
        const boardCells = doc.querySelectorAll('.play-screen__board-cell');
        
        for(let i = 0; i< boardArray.length; i++){
            if(boardArray[i] !== null){
                boardCells[i].textContent = boardArray[i];
            }
        }
    }

    function getGameSettings(){
        return gameSettings;
    }

   /*  (function(){
        console.log(player1NameInput)
        player1NameInput.value = 'X';
        player2NameInput.value = 'O';
    })(); */

    return {
        getGameSettings,
        render
    }

})(document);

export {displayController};