class Storage {
  constructor() {
    this.gameState;
    this.defaultState = {
      currentBoard: ['', '', '', '', '', '', '', '', ''],
      winsRemaining: ['012', '345', '678', '036', '147', '258', '048', '246'],
      movesMade: 0,
      currentPlayer: 'X',
      gameOver: false
    };
  }

  getGameState() {
    // get last game state from local storage
    if (JSON.parse(localStorage.getItem('gameState')) === null) {
      this.gameState = this.defaultState;
    } else {
      this.gameState = JSON.parse(localStorage.getItem('gameState'));
    }
    return this.gameState;
  }

  setGameState(gameState) {
    // set current game state to local storage
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }
}

class UI {
  constructor() {
    this.messageArea = document.querySelector('#message');
    this.gridContainer = document.querySelector('.grid-container');
    this.playAgainButton = document.querySelector('#play-button');
  }

  draw(gameState) {
    // update board here
    let boxDivs = [];
    for (let i = 0; i <= 8; i += 1) {
      boxDivs[i] = document.getElementById('box' + i);
      if (boxDivs[i].innerText !== gameState.currentBoard[i]) {
        boxDivs[i].innerText = gameState.currentBoard[i];
      }
    }
    console.log(gameState);
  }

  displayMessage(message) {
    this.messageArea.textContent = message;
  }
}

(function() {
  // init storage
  const storage = new Storage();

  // init game state
  const gameState = storage.getGameState();

  // init UI
  const ui = new UI();

  // init game
  document.addEventListener('DOMContentLoaded', setupGame);

  function setupGame() {
    storage.getGameState();
    if (gameState.gameOver) {
      playAgain();
    } else {
      ui.playAgainButton.classList.add('hide');
      ui.gridContainer.addEventListener('click', makeMove);
      ui.draw(gameState);
      ui.displayMessage(`${gameState.currentPlayer} to move`);
    }
  }

  function makeMove(event) {
    let moveIndex = event.target.id.slice(-1);
    if (gameState.currentBoard[moveIndex] === '' && !gameState.gameOver) {
      gameState.movesMade += 1;
      gameState.currentBoard[moveIndex] = gameState.currentPlayer;

      for (let i = 0; i < 8; i += 1) {
        if (gameState.winsRemaining[i].includes(moveIndex)) {
          let putMove = gameState.winsRemaining[i].replace(
            moveIndex,
            gameState.currentPlayer
          );
          gameState.winsRemaining[i] = putMove;
          if (putMove === 'XXX' || putMove === 'OOO') {
            gameState.gameOver = true;
            declareWinner(gameState.currentPlayer);
          } else {
            if (gameState.movesMade === 9) {
              gameState.gameOver = true;
              declareDraw();
            }
          }
        }
      }

      if (gameState.currentPlayer === 'X') {
        gameState.currentPlayer = 'O';
      } else {
        gameState.currentPlayer = 'X';
      }

      ui.draw(gameState);
      storage.setGameState(gameState);
      if (!gameState.gameOver) {
        ui.displayMessage(`${gameState.currentPlayer} to move`);
      }
    }
  }

  function declareWinner(currentPlayer) {
    ui.displayMessage(`${currentPlayer} is the winner!`);
    endGame();
  }

  function declareDraw() {
    ui.displayMessage('The game is a draw.');
    endGame();
  }

  function endGame() {
    ui.gridContainer.removeEventListener('click', makeMove);
    ui.playAgainButton.classList.remove('hide');
    ui.playAgainButton.addEventListener('mouseup', playAgain);
  }

  function playAgain() {
    gameState.currentBoard = ['', '', '', '', '', '', '', '', ''];
    gameState.winsRemaining = [
      '012',
      '345',
      '678',
      '036',
      '147',
      '258',
      '048',
      '246'
    ];
    gameState.movesMade = 0;
    gameState.currentPlayer = 'X';
    gameState.gameOver = false;
    storage.setGameState(gameState);
    ui.draw(gameState);
    ui.displayMessage(`${gameState.currentPlayer} to move`);
    ui.playAgainButton.classList.add('hide');
    ui.gridContainer.addEventListener('click', makeMove);
  }
})();
