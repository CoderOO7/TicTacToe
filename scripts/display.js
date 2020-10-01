import { gameBoard } from "./board.js";

const displayController = (function (doc) {
  const homeScreen = doc.querySelector(".home-screen");
  const beginScreen = doc.querySelector(".begin-screen");
  const playScreen = doc.querySelector(".play-screen");
  const endScreen = doc.querySelector(".end-screen");

  const beginScreenMsgDisplay = doc.getElementsByClassName("begin-screen__msg")[0];
  const endScreenMsgDisplay = doc.getElementsByClassName("end-screen__msg")[0];

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
  let timeoutIdsBucket = [];

  /**
   * Init the action to be performed for specific button
   * click. 
   */
  function _handleScreenBtnClick() {
    if (this === singlePlayerBtn || this === multiPlayerBtn) {
      _setGameMode.call(this);
      _styleInputDisplay();
      _displayWelcomeMessage();
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
      _clearTimeout();
      beginScreen.classList.add("screen--hide");
      homeScreen.classList.remove("screen--hide");
    }
  }

  /**
   * Add click event listeners to Screen Buttons. 
   */
  function _activateButtons() {
    singlePlayerBtn.addEventListener("click", _handleScreenBtnClick.bind(singlePlayerBtn), false);
    multiPlayerBtn.addEventListener("click", _handleScreenBtnClick.bind(multiPlayerBtn), false);
    rematchBtn.addEventListener("click", _handleScreenBtnClick.bind(rematchBtn), false);
    logoutBtn.addEventListener("click", _handleScreenBtnClick.bind(logoutBtn), false);
    loginBtn.addEventListener("click", _handleScreenBtnClick.bind(loginBtn), false);
    backBtn.addEventListener("click", _handleScreenBtnClick.bind(backBtn), false);
  }

  /**
   * Use to add a pause for the specified time in milliseconds 
   * @param {Number} milliseconds - amount of time to pause.
   * @return {Promise.<String>} - when specified time completed.
   */
  function _sleep(milliseconds){
    return new Promise(resolve => setTimeout(resolve,milliseconds));
  }

  /**
   * Create automatic typing effect on message display of screens.
   * @param {Array} textArray - contain message in form of array of strings
   * that should be display.
   * @param {Object} targetElement - document node to which message is render  
   */
  function _typeWriter(textArray, targetElement){
    let display = targetElement;
    textArray.forEach((frame, index) => {
      let add = (index === 0) ? 750 : 1725 * (index + 1);
      let line = frame.split('');
      let lastMils = 0;

      timeoutIdsBucket.push(setTimeout(() => {
        display.textContent = '';
      },add));
      
      display.textContent = '';
      line.forEach((character) => {
        let milliseconds = Math.floor(Math.random() * 125);
        timeoutIdsBucket.push(setTimeout(() => {
          display.textContent += character;
        }, milliseconds + lastMils + add + 120));
        lastMils += milliseconds;       
      });
    })
  }

  /**
   * To greet the user, show the message based on the game mode selection.
   */
  function _displayWelcomeMessage(){
    if(_getGameMode() === 'single_player'){
      let text = [
        'hello, PLAYER X',
        'my name is O',
        'enter an alias below',
        'or do not, PLAYER X',
        'you shall not defeat O'
      ];
      _typeWriter(text,beginScreenMsgDisplay);
    }else{
      let text = [
        'hello, PLAYER X',
        'welcome, PLAYER O',
        'enter an alias below',
        'or do not, PLAYER X',
        'will you, PLAYER O?',
        '...login, play tic tac toe!'
      ];
      _typeWriter(text,beginScreenMsgDisplay);
    }
  }

  /**
   * Cancel all timout events based on the id pushed in timeoutIdsBucket
   * when setTimeOut() function is called.  
   */
  function _clearTimeout(){
    return timeoutIdsBucket.forEach(id=>{clearTimeout(id);});
  }
  
  /**
   * Hide all the screens excpt HomeScreen 
   */
  function _hideScreenAtStartup() {
    beginScreen.classList.add("screen--hide");
    playScreen.classList.add("screen--hide");
    endScreen.classList.add("screen--hide");
  }

  /**
   * Assign the gameSetting object based on input values and 
   * gameMode Selection.
   */
  function _initGameSettings() {
    gameSettings.gameMode = _getGameMode();
    gameSettings.player1Name = player1NameInput.value.toUpperCase();
    gameSettings.player2Name = player2NameInput.value.toUpperCase();
  }

  /**
   * In case player don't enter their name, then these alias values
   * will be used.
   */
  function _setPlayersNameAlias() {
    player1NameInput.value = player1NameInput.placeholder.toUpperCase();
    player2NameInput.value = player2NameInput.placeholder.toUpperCase();
  }

  /**
   * Init GAME_MODE global variable with selected mode by user. 
   */
  function _setGameMode() {
    if (this === singlePlayerBtn) {
      GAME_MODE = "single_player";
    } else if (this === multiPlayerBtn) {
      GAME_MODE = "multi_player";
    }
  }

  /**
   * Return the gameMode.  
   */
  function _getGameMode() {
    return GAME_MODE;
  }

  /**
   * Style the input display at BeginScreen.
   */
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

  /**
   * Used to create matrix background for app.  
   */
  function _showMatrixRain() {
    // Initialising the canvas
    let canvas = document.querySelector(".canvas");
    let ctx = canvas.getContext("2d");

    // Setting the width and height of the canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Setting up the letters
    let letters = "loveyouoye";
    letters = letters.split("");

    // Setting up the columns
    let fontSize = 14;
    let columns = canvas.width / fontSize;

    // Setting up the drops
    var drops = [];
    for (var i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    // Setting up the draw function
    function _draw() {
      ctx.fillStyle = "rgba(0, 0, 0, .1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < drops.length; i++) {
        var text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillStyle = "#0f0";
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        drops[i]++;
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
      }
    }

    // To prevent layout break when browser window size or mobile orientation changes.
    function _resizeCanvas(canvas,ctx){
      if(canvas && ctx){
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    }

    //Event listener fire event on change in browser window size.
    window.addEventListener('resize', ()=>{_resizeCanvas(canvas,ctx)},false);
    //Event listener fire event on change in mobile orientation. 
    window.addEventListener('orientationchange',()=>{_resizeCanvas(canvas,ctx)},false);
    
    // Loop the animation
    setInterval(_draw, 60);
  }

  /**
   * Reset the game board by filling blank spaces in cells.
   */
  function clearBoard() {
    const boardCells = doc.querySelectorAll(".play-screen__board-cell");

    for (let i = 0; i < boardCells.length; i++) {
      boardCells[i].classList.remove('text--glow','col--blink');
      boardCells[i].textContent = "\u00A0";
    }
  }

  /**
   * Render the game-board cells with either 'O' or 'X' using the index 
   * value of gameBoard array.
   */
  function render() {
    const boardArray = gameBoard.getBoardArray();
    const boardCells = doc.querySelectorAll(".play-screen__board-cell");

    for (let i = 0; i < boardArray.length; i++) {
      if (boardArray[i] !== null) {
        boardCells[i].classList.add("col--blink");
        boardCells[i].textContent = boardArray[i];
      }
    }
  }

  /** 
   * Highlight the particular row, coloumn or diagonal that satisfy winning 
   * condition.
   */
  async function highlightWinningCoord(){
    const boardArray = gameBoard.getBoardArray();
    const boardCells = doc.querySelectorAll(".play-screen__board-cell");
    const winColIndices = gameBoard.getWinColIndices();

    winColIndices.forEach((i)=>{
      if(i !== null){
        boardCells[i].classList.add('text--glow');
        boardCells[i].textContent = boardArray[i];
      }
    })

    await _sleep(2000);
    clearBoard();
    await _sleep(500);
  }

  /**
   * Return the current gameSettings. 
   */
  function getGameSettings() {
    return gameSettings;
  }

  /**
   * Used to display endScreen when game is over. 
   */
  function switchToEndScreen() {
    playScreen.classList.add("screen--hide");
    endScreen.classList.remove("screen--hide");
  }

  /**
   * Render the text to endScreen message display. 
   */
  function displayGameEndMessage(text){
    let textArr = [text];
    _typeWriter(textArr, endScreenMsgDisplay);
  }

  (function () {
    _showMatrixRain();
    _setPlayersNameAlias();
    _activateButtons();
    _hideScreenAtStartup();
  })();

  return {
    displayGameEndMessage,
    switchToEndScreen,
    highlightWinningCoord,
    getGameSettings,
    clearBoard,
    render,
  };
})(document);

export { displayController };