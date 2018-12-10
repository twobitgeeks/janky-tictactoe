"use strict";

const playerImages = {
  "X": "solid_blue.png",
  "O": "solid_red.png"
};

class Storage {
    constructor() {
        this.gameState;
        this.defaultState = {
            currentBoard: ["", "", "", "", "", "", "", "", ""],
            winsRemaining: [
                "012",
                "345",
                "678",
                "036",
                "147",
                "258",
                "048",
                "246"
            ],
            movesMade: 0,
            currentPlayer: "X",
            gameOver: false
        };
    }

    // get last game state from local storage
    getGameState() {
        if (JSON.parse(localStorage.getItem("gameState")) === null) {
            this.gameState = this.defaultState;
        } else {
            this.gameState = JSON.parse(localStorage.getItem("gameState"));
        }
        return this.gameState;
    }

    // set current game state to local storage
    setGameState(gameState) {
        localStorage.setItem("gameState", JSON.stringify(gameState));
    }
}

class UI {
    constructor() {
        this.messageImage = document.querySelector("#message-image");
        this.messageArea = document.querySelector("#message");
        this.gridContainer = document.querySelector(".grid-container");
        this.playAgainButton = document.querySelector("#play-button");
    }

    // draw the current game state to the board
    draw(gameState) {
        let boxDivs = document.querySelectorAll(".grid-box");
        let background = "";
        boxDivs.forEach(function(box, index) {
            if (gameState.currentBoard[index] in playerImages) {
                let imagePath = playerImages[gameState.currentBoard[index]]
                background = `url(${imagePath})`;
            } else {
                background = "none";
            }
            box.style.background = background;
            box.style.backgroundSize = "cover";
        });
    }

    // display message in the message area
    displayMessage(message, image=null) {
        this.messageArea.textContent = message;
        if (image) {
            this.messageImage.src = image;
            this.messageImage.style.display = "inline-block";
        } else {
            this.messageImage.style.display = "none";
        }
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
    document.addEventListener("DOMContentLoaded", setupGame);

    // set up the game
    function setupGame() {
        storage.getGameState();
        if (gameState.gameOver) {
            playAgain();
        } else {
            ui.playAgainButton.classList.add("hide");
            ui.gridContainer.addEventListener("click", makeMove);
            ui.draw(gameState);
            ui.displayMessage(" to move", 
                              playerImages[gameState.currentPlayer]);
        }
    }

    // respond to move made on the board
    function makeMove(event) {
        let moveIndex = event.target.dataset.index;
        if (gameState.currentBoard[moveIndex] === "" && !gameState.gameOver) {
            gameState.movesMade += 1;
            gameState.currentBoard[moveIndex] = gameState.currentPlayer;

            gameState.winsRemaining.forEach(function(box, index) {
                if (box.includes(moveIndex)) {
                    let putMove = gameState.winsRemaining[index].replace(
                        moveIndex,
                        gameState.currentPlayer
                    );
                    gameState.winsRemaining[index] = putMove;

                    if (putMove === "XXX" || putMove === "OOO") {
                        gameState.gameOver = true;
                        declareWinner(gameState.currentPlayer);
                    }
                }
            });

            if (gameState.movesMade >= 9 && !gameState.gameOver) {
                gameState.gameOver = true;
                declareDraw();
            }

            if (gameState.currentPlayer === "X") {
                gameState.currentPlayer = "O";
            } else {
                gameState.currentPlayer = "X";
            }

            ui.draw(gameState);
            storage.setGameState(gameState);
            if (!gameState.gameOver) {
                ui.displayMessage(" to move",
                                  playerImages[gameState.currentPlayer]);
            }
        }
    }

    // game over, man!
    function declareWinner(currentPlayer) {
        ui.displayMessage(" is the winner!", playerImages[currentPlayer]);
        endGame();
    }

    // it"s a draw
    function declareDraw() {
        ui.displayMessage("The game is a draw.");
        endGame();
    }

    // set board to end game state
    function endGame() {
        ui.gridContainer.removeEventListener("click", makeMove);
        ui.playAgainButton.classList.remove("hide");
        ui.playAgainButton.addEventListener("mouseup", playAgain);
    }

    // reset everything and play again
    function playAgain() {
        gameState.currentBoard = ["", "", "", "", "", "", "", "", ""];
        gameState.winsRemaining = [
            "012",
            "345",
            "678",
            "036",
            "147",
            "258",
            "048",
            "246"
        ];
        gameState.movesMade = 0;
        gameState.currentPlayer = "X";
        gameState.gameOver = false;
        storage.setGameState(gameState);
        ui.draw(gameState);
        ui.displayMessage(" to move", playerImages[gameState.currentPlayer]);
        ui.playAgainButton.classList.add("hide");
        ui.gridContainer.addEventListener("click", makeMove);
    }
})();
