// set up variables
let gameState = [],
  winsRemainingX = [],
  winsRemainingO = [],
  movesMade,
  currentPlayer,
  gameOver;

// create win conditions to compare against
const potentialWins = ['012', '345', '678', '036', '147', '258', '048', '246'];

// grab UI elements
const messageArea = document.querySelector('#message');
const gridContainer = document.querySelector('.grid-container');
const playAgainButton = document.querySelector('#play-button');

// setup game
resetGameState();

// reset the game state to empty
function resetGameState() {
  gameState = ['', '', '', '', '', '', '', '', ''];

  winsRemainingX = potentialWins.slice();
  winsRemainingO = potentialWins.slice();

  movesMade = 0;
  currentPlayer = 'X';
  gameOver = false;
  playAgainButton.classList.add('hide');
  gridContainer.addEventListener('click', makeMove);
  displayGameState(gameState);
  displayMessage('X to move');
}

// respond to click on game board
function makeMove(event) {
  let thisMove = event.target.id.slice(-1);
  if (gameState[thisMove] === '') {
    updateGameState(thisMove);
    displayGameState(gameState);
  }
}

// update the game state with the current move
function updateGameState(thisMove) {
  movesMade += 1;

  if (currentPlayer === 'X') {
    gameState[thisMove] = 'X';

    for (let i = 0; i < winsRemainingX.length; i += 1) {
      if (winsRemainingX[i].includes(thisMove)) {
        let putMove = winsRemainingX[i].replace(thisMove, 'X');
        winsRemainingX[i] = putMove;
        if (putMove === 'XXX') {
          declareWinner(currentPlayer);
        }
      }
    }

    for (let i = winsRemainingO.length - 1; i >= 0; i -= 1) {
      if (winsRemainingO[i].includes(thisMove)) {
        winsRemainingO.splice(i, 1);
      }
    }

    currentPlayer = 'O';
    if (!gameOver) {
      displayMessage('O to move');
    }
  } else if (currentPlayer === 'O') {
    gameState[thisMove] = 'O';

    for (let i = 0; i < winsRemainingO.length; i += 1) {
      if (winsRemainingO[i].includes(thisMove)) {
        let putMove = winsRemainingO[i].replace(thisMove, 'O');
        winsRemainingO[i] = putMove;
        if (putMove === 'OOO') {
          declareWinner(currentPlayer);
        }
      }
    }

    for (let i = winsRemainingX.length - 1; i >= 0; i -= 1) {
      if (winsRemainingX[i].includes(thisMove)) {
        winsRemainingX.splice(i, 1);
      }
    }

    currentPlayer = 'X';
    if (!gameOver) {
      displayMessage('X to move');
    }
  }
  if (!gameOver && movesMade === 9) {
    declareDraw();
  }
}

// update display to reflect current game state
function displayGameState(gameState) {
  let boxDivs = [];
  for (let i = 0; i <= 8; i += 1) {
    boxDivs[i] = document.getElementById('box' + i);
    if (boxDivs[i].innerText != gameState[i]) {
      boxDivs[i].innerText = gameState[i];
    }
  }
}

// game over, man
function declareWinner(currentPlayer) {
  displayMessage(`Player ${currentPlayer} is the winner!`);
  playAgain();
}

// it's a draw
function declareDraw() {
  displayMessage('The game is a draw.');
  playAgain();
}

// message handler
function displayMessage(msg) {
  messageArea.textContent = msg;
}

// get ready for new game
function playAgain() {
  gameOver = true;
  gridContainer.removeEventListener('click', makeMove);
  playAgainButton.classList.remove('hide');
  playAgainButton.addEventListener('mouseup', function() {
    resetGameState();
  });
}
