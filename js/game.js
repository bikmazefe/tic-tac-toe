let currentPlayer;
let playerOne;
let playerTwo;
let winningConditions = [ 
                            [0,1,2], [0,3,6], 
                            [2,5,8], [6,7,8], 
                            [3,4,5], [1,4,7],
                            [0, 4, 8], [2,4,6] 
                        ]

// Game board module 
const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""]
    // Marks the spot in the array 
    // and calls the display controller for updating the display.
    const markBoard = (index) => {
        if(board[index].length == 0){
            board[index] = currentPlayer.marker
            displayController.markSpot(index);
        }
    }
    const boardIsFull = () => {
        return board.every(square => square.length > 0)
    }
    const clearBoard = () => {
        for(let i = 0; i < board.length; i++){
            board[i] = ""
        }
    }


    return {
        markBoard,
        boardIsFull, 
        board, 
        clearBoard
    }
})();

// AI player module
const AI = (() => {
    let marker = "O"
    let minimaxScores = {
        X: -10,
        O: 10,
        tie: 0
    }

    const play = () => {
        let bestScore = -Infinity;
        let move;
        // iterating over the board
        for(let i = 0; i < 9; i++){
            // checking if the current spot is available
            if(gameBoard.board[i] == ""){
                // temporarily marks the spot
                gameBoard.board[i] = "O"
                // calls the minimax function with temporary move
                let score = minimax(gameBoard.board, 0, false);
                // removes mark
                gameBoard.board[i] = ""
                // checks if it's the desirable move 
                if (score > bestScore){
                    bestScore = score;
                    move = i
                }
            }
        }
        gameBoard.markBoard(move);
        currentPlayer = playerOne;
        game.checkGameStatus();
    }
    // minimax algorithm
    const minimax = (board, depth, isMaximizing) => {
        let result = game.checkWinner();
        // base case for the recursive call
        if(result !== undefined){
            return minimaxScores[result]
        }
        if (isMaximizing){
            let bestScore = -Infinity
            for(let i = 0; i < 9; i++){
                if(gameBoard.board[i] == ""){
                    board[i] = "O"
                    let score = minimax(board, depth + 1, false);
                    board[i] = ""
                    if(score > bestScore){
                        bestScore = score
                    }
                }
            }
            return bestScore
        }else{
            let bestScore = Infinity
            for(let i = 0; i < 9; i++){
                if(gameBoard.board[i] == ""){
                    board[i] = "X"
                    let score = minimax(board, depth + 1, true);
                    board[i] = ""
                    if (score < bestScore){
                        bestScore = score
                    }
                }
            }
            return bestScore
        }

    }

    return{
        play,
        marker,
        minimaxScores
    }
})();   


const playerFactory = (marker) => {
    return {
        marker
    }
}



// Main module for game flow and related checks
const game = (() => {
    let gameOver = false
    let againstComputer = false;


    const startGame = (mode) => {
        if(mode == "ai"){
            againstComputer = true;
        }
        playerOne = playerFactory("X");
        againstComputer ? playerTwo = AI : playerTwo = playerFactory("O")
        currentPlayer = playerOne
        displayController.setupBoard();
    }

    const playRound = (index) => {
        gameBoard.markBoard(index)
        checkGameStatus();
        currentPlayer === playerOne ? currentPlayer = playerTwo : currentPlayer = playerOne
        if (againstComputer && !gameOver){
            AI.play();
        }
    }

    const checkGameStatus = () => {
        if(checkWinner() !== undefined){
            gameOver = true;
            displayController.deactivateBoard();
            displayController.declareWinner(checkWinner())
        }
    }

    const checkWinner = () => {
        let winner;
        const equation = (a,b,c) => {
            return a == b && b == c && a != "";
        }
        for(let i = 0; i < winningConditions.length; i++){
           let index =  winningConditions[i]
           let board = gameBoard.board
           if(equation(board[index[0]],board[index[1]], board[index[2]])){
               winner = board[index[0]];
           }
        }
        if (gameBoard.boardIsFull()){
            return 'tie'
        } else {
            return winner
        }
    }

    const restartGame = () => {
        gameBoard.clearBoard();
        displayController.reActivateBoard();
        gameOver = false;
    }


    return {
        playRound,
        startGame, 
        checkWinner,
        checkGameStatus,
        restartGame,
    }
})();

// Module for updating the display
const displayController = (() => {

    let wrapper = document.querySelector('.game-board')
    wrapper.addEventListener('animationend', () => wrapper.style.animation = "")

    const setupBoard = () => {
        wrapper.innerHTML = ""
        for(let i = 0; i < 9; i++){
            let div = document.createElement('div');
            div.setAttribute('data-index', i);
            wrapper.appendChild(div)
        }
        setListeners();
    }

    const markSpot = (index) => {
        let spot = document.querySelector(`div[data-index = "${index}"]`)
        spot.innerHTML = currentPlayer.marker;
        wrapper.style.animation = "shakeBoard 0.5s"
    }

    const reActivateBoard = () => {
        wrapper.classList.remove('inactive');
        document.getElementById('result-field').textContent =  ""
        playAgain.style.display = "none"
    }

    const deactivateBoard = () => {
        wrapper.classList.add('inactive')
    }

    const declareWinner = (result) => {
        let resultField = document.getElementById('result-field')
        if(result !== "tie"){
            resultField.textContent = `"${result}" wins!`
        }else{
            resultField.textContent = `${result}!`
        }
        playAgain.style.display = "block"
    }


    return {
        setupBoard,
        deactivateBoard,
        reActivateBoard,
        markSpot,
        declareWinner
    }
})();


// Sets event listeners after initial board setup
const setListeners = () => {
    document.querySelectorAll('.game-board div').forEach(div => {
        div.addEventListener('click', () => {
            game.playRound(div.dataset.index)
        })
    })
}





