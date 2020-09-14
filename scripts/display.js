import { gameController } from "./game.js";
import { gameBoard } from "./board.js";

const displayController = (function (doc) {
  const homeScreen = doc.querySelector(".home-screen");
  const beginScreen = doc.querySelector(".begin-screen");
  const playScreen = doc.querySelector(".play-screen");
  const endScreen = doc.querySelector(".end-screen");

  const beginScreeMsgDisplay = doc.getElementsByClassName("begin-screen__msg");
  const endScreenMsgDisplay = doc.getElementsByClassName("end-screen__msg");

  const player1NameInput = doc.getElementById("p1-name");
  const player2NameInput = doc.getElementById("p2-name");
  const singlePlayerBtn = doc.getElementById("single-pl-btn");
  const multiPlayerBtn = doc.getElementById("multi-pl-btn");
  const rematchBtn = doc.getElementById("rematch-btn");
  const logoutBtn = doc.getElementById("logout-btn");
  const loginBtn = doc.getElementById("login-btn");
  const backBtn = doc.getElementById("back-btn");

  const gameSettings = {};
  let GAME_MODE = null;

  function _handleScreenBtnClick() {
    if (this === singlePlayerBtn || this === multiPlayerBtn) {
      _setGameMode.call(this);
      _styleInputDisplay();
      homeScreen.classList.add("screen--hide");
      beginScreen.classList.remove("screen--hide");
    } else if (this === rematchBtn) {
      endScreen.classList.add("screen--hide");
      playScreen.classList.remove("screen--hide");
    } else if (this === logoutBtn) {
      _setPlayersNameAlias();
      endScreen.classList.add("screen--hide");
      homeScreen.classList.remove("screen--hide");
    } else if (this === loginBtn) {
      _initGameSettings();
      beginScreen.classList.add("screen--hide");
      playScreen.classList.remove("screen--hide");
    } else if (this === backBtn) {
      beginScreen.classList.add("screen--hide");
      homeScreen.classList.remove("screen--hide");
    }
  }

  function _activateButtons() {
    singlePlayerBtn.addEventListener("click", _handleScreenBtnClick.bind(singlePlayerBtn), false);
    multiPlayerBtn.addEventListener("click", _handleScreenBtnClick.bind(multiPlayerBtn), false);
    rematchBtn.addEventListener("click", _handleScreenBtnClick.bind(rematchBtn), false);
    logoutBtn.addEventListener("click", _handleScreenBtnClick.bind(logoutBtn), false);
    loginBtn.addEventListener("click", _handleScreenBtnClick.bind(loginBtn), false);
    backBtn.addEventListener("click", _handleScreenBtnClick.bind(backBtn), false);
  }

  function _hideScreenAtStartup() {
    beginScreen.classList.add("screen--hide");
    playScreen.classList.add("screen--hide");
    endScreen.classList.add("screen--hide");
  }

  function _initGameSettings() {
    gameSettings.gameMode = _getGameMode();
    gameSettings.player1Name = player1NameInput.value;
    gameSettings.player2Name = player2NameInput.value;
  }

  function _setPlayersNameAlias() {
    player1NameInput.value = player1NameInput.placeholder;
    player2NameInput.value = player2NameInput.placeholder;
  }

  function _setGameMode() {
    if (this === singlePlayerBtn) {
      GAME_MODE = "single_player";
    } else if (this === multiPlayerBtn) {
      GAME_MODE = "multi_player";
    }
  }

  function _getGameMode() {
    return GAME_MODE;
  }

  function clearBoard() {
    const boardCells = doc.querySelectorAll(".play-screen__board-cell");

    for (let i = 0; i < boardCells.length; i++) {
      boardCells[i].textContent = "\u00A0";
    }
  }

  function _styleInputDisplay() {
    if (_getGameMode() === "single_player") {
      player1NameInput.style.top = "40%";
      player2NameInput.style.display = "none";
    }else{
      // reset to default value
      player1NameInput.style.top = "";
      player2NameInput.style.display = ""; 
    }
  }

  function render() {
    const boardArray = gameBoard.getBoardArray();
    const boardCells = doc.querySelectorAll(".play-screen__board-cell");

    for (let i = 0; i < boardArray.length; i++) {
      if (boardArray[i] !== null) {
        boardCells[i].textContent = boardArray[i];
      }
    }
  }

  function getGameSettings() {
    return gameSettings;
  }

  function switchToEndScreen() {
    playScreen.classList.add("screen--hide");
    endScreen.classList.remove("screen--hide");
  }

  (function () {
    _setPlayersNameAlias();
    _activateButtons();
    _hideScreenAtStartup();
  })();

  return {
    getGameSettings,
    switchToEndScreen,
    clearBoard,
    render,
  };
})(document);

export { displayController };
