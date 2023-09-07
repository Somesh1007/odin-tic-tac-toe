const Player = (name, type) => {


}


const Gameboard = (() => {
    let _gameboard = [
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['O', 'O', 'X']
    ]


    let startGame = () => {

    }

    let restartGame = () => {

    }

    let playGame = (player1, player2) => {
        console.log('Playing Game');
    }


    let handleUserClick = (event) => {
        console.log(`Clicked On Row ${event}`);

    }


    let _startGameButton = document.querySelector('#start-game-button')
    let _restartGameButton = document.querySelector('#restart-game-button')
    let _plaverVsComputerRadioButton = document.querySelector('#player-vs-computer')
    let _plaverVsPlayerRadioButton = document.querySelector('#player-vs-player')
    let _gameboardRow = document.querySelectorAll('.gameboard .row')

    // Add Event Listeners
    _startGameButton.addEventListener('click', startGame)
    _restartGameButton.addEventListener('click', restartGame)
    _gameboardRow.forEach(row => row.addEventListener('click', handleUserClick))




    return {
        playGame
    }
}
)()


let player1 = Player('Somesh', 'Player')
let player2 = Player('Testing', 'Computer')

Gameboard.playGame(player1, player2)
