let currentPlayer;
let playerOne;
let playerTwo;
let winningConditions = [ 
                            [0,1,2], [0,3,6], 
                            [2,5,8], [6,7,8], 
                            [3,4,5], [1,4,7],
                            [0, 4, 8], [2,4,6] 
                        ]

const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""]

    const markBoard = (index) => {
        if(board[index].length == 0){
            board[index] = currentPlayer.marker
            displayController.markSpot(index);
        }
    }
    const boardIsFull = () => {
        return board.every(square => square.length > 0)
    }


    return {
        markBoard,
        boardIsFull, 
        board
    }
})();

const AI = (() => {
    let marker = "O"
    let minimaxScores = {
        X: -10,
        O: 10,
        tie: 0
    }

    const selectedSpots = () => {
        let arr = []
        for(let i = 0; i < gameBoard.board.length; i++){
            if(gameBoard.board[i] == marker){
                arr.push(i)
            }
        }
        return arr
    }

    const play = () => {
        let bestScore = -Infinity;
        let move;
        for(let i = 0; i < 9; i++){
            if(gameBoard.board[i] == ""){
                gameBoard.board[i] = "O"
                let score = minimax(gameBoard.board, 0, false);
                gameBoard.board[i] = ""
                if (score > bestScore){
                    bestScore = score;
                    move = i
                }
            }
        }
        gameBoard.markBoard(move);
        currentPlayer = playerOne;
    }

    const minimax = (board, depth, isMaximizing) => {
        let result = game.checkWinner();
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
        selectedSpots,
        marker,
        minimaxScores
    }
})();   


const playerFactory = (marker) => {

    return {
        marker
    }
}




const game = (() => {
    let gameOver = false
    let againstComputer = true;

    const startGame = () => {
        playerOne = playerFactory("X");
        againstComputer ? playerTwo = AI : playerTwo = playerFactory("O")
        currentPlayer = playerOne
        displayController.setupBoard();
    }

    const playRound = (index) => {
        gameBoard.markBoard(index)
        checkWinner();
        currentPlayer === playerOne ? currentPlayer = playerTwo : currentPlayer = playerOne
        if (againstComputer){
            AI.play();
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

    return {
        playRound,
        startGame, 
        checkWinner
    }
})();

const displayController = (() => {

    let wrapper = document.querySelector('.game-board')

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
        spot.innerHTML = currentPlayer.marker
    }

    const deactivateBoard = () => {
        wrapper.classList.add('inactive')
    }

    return {
        setupBoard,
        deactivateBoard,
        markSpot
    }
})();


const setListeners = () => {
    document.querySelectorAll('.game-board div').forEach(div => {
        div.addEventListener('click', () => {
            game.playRound(div.dataset.index)
        })
    })
}



