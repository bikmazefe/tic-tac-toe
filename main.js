let currentPlayer;
let playerOne;
let playerTwo;
let winningConditions = [ 
                            ["0","1","2"], ["0","3","6"], 
                            ["2","5","8"], ["6","7","8"], 
                            ["3","4","5"], ["1","4","7"],
                            ["0", "4", "8"], ["2", "4", "6"] 
                        ]

const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""]

    const markBoard = (index) => {
        if(board[index].length == 0){
        board[index] = currentPlayer.marker
        currentPlayer.selectedSpots.push(index)
        displayController.markSpot(index);
    }
    }
    return {
        board,
        markBoard
    }
})();


const playerFactory = (marker) => {
    let selectedSpots = []
    return {
        marker,
        selectedSpots
    }
}

const displayController = (() => {

    let wrapper = document.querySelector('.game-board')

    const setupBoard = () => {
        wrapper.innerHTML = ""
        for(let i = 0; i < gameBoard.board.length; i++){
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




const game = (() => {
    let gameOver = false
    let winner;
    const startGame = () => {
        playerOne = playerFactory("X");
        playerTwo = playerFactory("O")
        currentPlayer = playerOne
        displayController.setupBoard();
    }

    // if playerTWO is AI call the AI.play function at the and with if statement
    const playRound = (index) => {
        gameBoard.markBoard(index)
        checkGameStatus();
        currentPlayer === playerOne ? currentPlayer = playerTwo : currentPlayer = playerOne
    }

    const checkGameStatus = () => {
        console.log(gameBoard.board.length)
        if(gameBoard.board.every(square => square.length > 0 )){
            gameOver = true
            console.log('Tie!')
            displayController.deactivateBoard();
        }else if(isWinner(playerOne) || isWinner(playerTwo)){
            gameOver = true
            console.log(winner + "wins")
            displayController.deactivateBoard();
        }
    }

    const isWinner = (player) => {
        for(let i = 0; i < winningConditions.length; i++){
           if(winningConditions[i].every(item => player.selectedSpots.includes(item))){
               winner = player.marker
               return true
               break;
           }
        }
    }

    return {
        playRound,
        startGame
    }
})();



const setListeners = () => {
    document.querySelectorAll('.game-board div').forEach(div => {
        div.addEventListener('click', () => {
            game.playRound(div.dataset.index)
        })
    })
}


document.querySelector('button').addEventListener('click', game.startGame)