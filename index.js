const Gameboard = (function ()  {
    const gameboardArray = ["", "", "", "", "", "", "", "", ""];
    const addMarker = (piece, index) => {
        gameboardArray[index] = piece;
    }
    const checkDraw = () => {
        let piecesTaken = 0;
        for (let i = 0; i < 9; i++) {
            if (gameboardArray[i]) {
                piecesTaken++
            }
        }
        if (piecesTaken == 9) {
            return true;
        }
        
    }
    const checkWinner = (piece) => {
        const array = Gameboard.gameboardArray;
        if (array[0] == piece && array[1] == piece && array[2] == piece ||
            array[3] == piece && array[4] == piece && array[5] == piece ||
            array[6] == piece && array[7] == piece && array[8] == piece ||
            array[0] == piece && array[3] == piece && array[6] == piece ||
            array[1] == piece && array[4] == piece && array[7] == piece ||
            array[2] == piece && array[5] == piece && array[8] == piece ||
            array[0] == piece && array[4] == piece && array[8] == piece ||
            array[2] == piece && array[4] == piece && array[6] == piece  ) 
            {
                return true;
            }
    }

    return {gameboardArray, addMarker, checkDraw, checkWinner}
})();

function createPlayer(name, piece, turn) {
    return {name, piece, turn};
}

const GameController = (function() {
    const player1 = createPlayer("X", "x", 0)
    const player2 = createPlayer("O", "o", 1)
    let player1Turn = player1.turn;
    let player2Turn = player2.turn;
    let turn = player1Turn;
    const players = [player1, player2]
    let gameOver = false;

    const switchTurn = (currTurn) => {
        if (currTurn == 0) {
            GameController.turn = player2Turn;
        }else {
            GameController.turn = player1Turn;
        }
    }

    const playRound = (currTurn) => {
        if (Gameboard.checkWinner(GameController.players[currTurn].piece)) {
            console.log(GameController.players[currTurn].name + " is the winner!")
            GameController.gameOver = true;
            Display.declareWinner(GameController.players[currTurn].name);
        }else if (Gameboard.checkDraw()){
            console.log("Draw!")
            Display.declareDraw();
        }else {
            GameController.switchTurn(currTurn);
        }
    }

    return {turn, players, gameOver, switchTurn, playRound}
})();

const Display = (function () {
    const boardContainer = document.querySelector(".board");
    const restartButton = document.querySelector(".restart-btn");
    const message = document.querySelector(".message");
    const tiles = document.querySelectorAll(".tile")

    tiles.forEach((tile) => {
        tile.addEventListener("click", () => {
            console.log(GameController.gameOver)
            if (tile.innerHTML == "" && GameController.gameOver == false) {
                Display.placeTile(GameController.turn, tile); 
                GameController.playRound(GameController.turn)
            }
        })
    })

    const placeTile = (turn, tile) => {
        tile.innerHTML = GameController.players[turn].piece;
        if (GameController.players[turn].piece == "x") {
            tile.style.color = "#e76f51";
        }else {
            tile.style.color = "#2a9d8f";
        }
        Gameboard.addMarker(GameController.players[turn].piece, tile.dataset.index);
        console.log(Gameboard.gameboardArray);
    }

    const restartGame = () => {
        const tiles = document.querySelectorAll(".tile")
        for (let i = 0; i < 9; i++) {
            Gameboard.gameboardArray[i] = "";
            tiles[i].innerHTML = "";
        }
        GameController.gameOver = false;
        message.innerHTML = "";
    };

    restartButton.addEventListener("click", () => {
        Display.restartGame();
        GameController.turn = 0;
    })

    const declareWinner = (winningPlayer) => {
        message.innerHTML = winningPlayer + " is the winner!";
    }
    const declareDraw = () => {
        message.innerHTML = "Draw!"
    }

    return {placeTile, restartGame, declareWinner, declareDraw};
})();