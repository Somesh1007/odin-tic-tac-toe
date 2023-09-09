const Player = (name, type, selection) => {
    let _noOfWins = 0

    let wonRound = () => {
        _noOfWins++
    }

    let getWins = () => {
        return _noOfWins
    }

    return { name, type, selection, getWins, wonRound }
}


const Gameboard = (() => {
    let _gameboard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ]

    let _winCombinations = [
        ['0-0', '0-1', '0-2'], // Horizontal
        ['1-0', '1-1', '1-2'],
        ['2-0', '2-1', '2-2'],
        ['0-0', '1-0', '2-0'], // Vertical
        ['0-1', '1-1', '2-1'],
        ['0-2', '1-2', '2-2'],
        ['0-0', '1-1', '2-2'], // Diagonal
        ['0-2', '1-1', '2-0']
    ]

    //let _startGameButton = document.querySelector('#start-game-button')
    let _restartGameButton = document.querySelector('#restart-game-button')
    let _gameboardRows = document.querySelectorAll('.gameboard .row')
    let _displayText = document.querySelector('.display-text')

    // Add Enhancement Later
    //let _plaverVsComputerRadioButton = document.querySelector('#player-vs-computer')
    //let _plaverVsPlayerRadioButton = document.querySelector('#player-vs-player')

    let _player1 = Player('Player 1', 'Player', 'X')
    let _player2 = Player('Player 2', 'Player', 'O')
    let _playerSelectionMap = { "X": _player1, "O": _player2 }
    let _playerSelection = 'X'

    let _isPlayerVsComputer = false // Add Enhancement Later
    let _isPlayerVsPlayer = true // Add Enhancement Later
    let _isGameInProgress = false
    let _gameboardCount = 0
    let _roundCount = 1
    let roundsToWin = 3



    let startGame = () => {
        console.log('Clicked on Start Game');

        if (_isGameInProgress) {
            alert('Finish the Existing Game or Restart')
        } else {
            if (_isPlayerVsComputer || _isPlayerVsPlayer) {
                resetGameboardRows()
                setGameInProgress(true)
                addEventListenersOnGameboard()

                updateDisplayText(`Round ${_roundCount} : ${_playerSelectionMap['X'].name}(X) play your move.`)

            } else {
                alert('Select Game Type: Player vs Player or Player vs Computer')
            }
        }

    }


    let restartGame = () => {
        console.log('Clicked on Restart Game');

        if (_isPlayerVsComputer || _isPlayerVsPlayer) {
            console.log('Resetting Board');
            if ((_player1.getWins() < roundsToWin) && (_player2.getWins() < roundsToWin)) {
                updateDisplayText(`Round ${_roundCount} : ${_playerSelectionMap['X'].name}(X) play your move.`)

                setGameInProgress(true)
                resetGameboardRows()
                addEventListenersOnGameboard()
            } else {
                removeEventListenersOnGameboard()
                let winnerName

                if (_player1.getWins() === 3) {
                    winnerName = _player1.name
                } else {
                    winnerName = _player2.name
                }

                updateDisplayText(`${winnerName} Won!!!.`)
            }

        } else {
            alert('Select Game Type: Player vs Computer or Player vs Player')
        }
    }

    let handleUserClick = (event) => {
        let row = event.target.classList[1]

        // Check If Already Exists
        let rowNum = row.split("-")[1]
        let colNum = row.split("-")[2]
        let existingValue = _gameboard[rowNum][colNum]

        if (existingValue === null || existingValue === '' || existingValue === undefined) {
            // Insert In Array
            _gameboard[rowNum][colNum] = _playerSelection

            // Insert In DOM/HTML
            event.target.textContent = _playerSelection

            // Increment Counter
            _gameboardCount++

            if (_isPlayerVsPlayer) {
                if (_playerSelection === 'X') {
                    _playerSelection = 'O'
                    updateDisplayText(`Round ${_roundCount} : ${_playerSelectionMap['O'].name}(O) play your move.`)

                } else if (_playerSelection === 'O') {
                    _playerSelection = 'X'
                    updateDisplayText(`Round ${_roundCount} : ${_playerSelectionMap['X'].name}(X) play your move.`)

                }
            } else if (_isPlayerVsComputer) {

            }

            checkForGameResults()

        }
    }

    let updateDisplayText = (text) => {
        _displayText.textContent = text
    }

    let resetGameboardRows = () => {
        resetGameboardCount()
        resetWinningColor()

        // Empty Array & DOM

        for (let rowIndex = 0; rowIndex < _gameboard.length; rowIndex++) {
            let rowArr = _gameboard[rowIndex]

            for (let colIndex = 0; colIndex < rowArr.length; colIndex++) {
                const element = rowArr[colIndex];

                _gameboard[rowIndex][colIndex] = ''
                document.querySelector(`.row-${rowIndex}-${colIndex}`).textContent = ''
            }
        }

    }

    let resetGameboardCount = () => {
        // Reset Counter
        _gameboardCount = 0
    }

    let addEventListenersOnGameboard = () => {
        _gameboardRows.forEach(row => row.addEventListener('click', handleUserClick))
    }

    let removeEventListenersOnGameboard = () => {
        _gameboardRows.forEach(row => row.removeEventListener('click', handleUserClick))
    }

    let checkForGameResults = () => {
        // Winner Cannot be Decided within the first 4 moves/counts
        if (_gameboardCount > 4) {
            let isGameWon = false
            let playerSelectionWin = ''

            //console.log(`Gameboard Count is: ${_gameboardCount}`);
            //console.table(_gameboard)
            let result = checkWinCombinations()

            if (result.isWon) {
                isGameWon = true
                playerSelectionWin = result.playerSelection
                setGameInProgress(false)
            }

            //console.log(`In checkForGameResults isGameWon is: ${isGameWon} & playerSelectionWin is: ${playerSelectionWin}`);

            if (isGameWon) {
                let winningPlayer = _playerSelectionMap[playerSelectionWin]
                updateDisplayText(`Round ${_roundCount} : ${winningPlayer.name}(${playerSelectionWin}) Won!!!`)
                removeEventListenersOnGameboard()
                setGameInProgress(false)
                _roundCount++
                winningPlayer.wonRound()

            } else if (_gameboardCount === 9) {
                updateDisplayText(`Round ${_roundCount} : Draw!!!`)
                removeEventListenersOnGameboard()
                setGameInProgress(false)
                _roundCount++

            }
        }

    }

    let checkWinCombinations = () => {
        let isWon = false
        let playerSelection = ''
        let tempVar = ''
        let matchCounter = 0
        let winCells

        //console.log('In checkWinCombinations');
        for (let i = 0; i < _winCombinations.length; i++) {
            let row = _winCombinations[i];
            tempVar = ''
            matchCounter = 0
            //console.log(`===============In checkWinCombinations row(${i}) is: ${row}====`);

            if (!isWon) {
                for (let j = 0; j < row.length; j++) {

                    //console.log(`In checkWinCombinations row(${i})(${j})`);

                    if (!isWon) {
                        let element = row[j];
                        let currentValue = _gameboard[element.split("-")[0]][element.split("-")[1]]

                        //console.log(`In checkWinCombinations row(${i})(${j}) element is: ${element}`);
                        //console.log(`In checkWinCombinations row(${i})(${j}) currentValue is: ${currentValue}`);
                        //console.log(`In checkWinCombinations row(${i})(${j}) tempVar is: ${tempVar}`);


                        if (j === 0) {
                            tempVar = currentValue
                        }

                        if (validateStringOrNode(tempVar) && validateStringOrNode(currentValue)) {
                            if (matchCounter < 3) {
                                if (tempVar === currentValue) {
                                    matchCounter++
                                }
                            }
                        }

                        if (j !== 0) {
                            tempVar = currentValue
                        }

                        if (matchCounter === 3) {
                            isWon = true
                            playerSelection = currentValue
                            winCells = row
                        }
                    }
                }
            }
        }


        if (isWon) {
            updateWinningColor(winCells)
        }


        return { isWon, playerSelection }
    }

    let updateWinningColor = (winCells) => {
        winCells.forEach((cell) => {
            let row = document.querySelector(`.row-${cell}`)
            row.style.color = 'red'
        })
    }

    let resetWinningColor = () => {
        let rows = document.querySelectorAll('.row')

        rows.forEach((row) => {
            row.style.color = '#46494b'

        })
    }

    let setGameInProgress = (flag) => {
        _isGameInProgress = flag
    }

    let validateStringOrNode = (input) => {
        return (input !== null && input !== undefined && input !== '')
    }

    // Add Event Listeners
    //_startGameButton.addEventListener('click', startGame)
    _restartGameButton.addEventListener('click', restartGame)


    // Add Enhancement Later
    /*_plaverVsComputerRadioButton.addEventListener('click', (event) => {
        _isPlayerVsComputer = event.target.checked
        _isPlayerVsPlayer = false
    })
    _plaverVsPlayerRadioButton.addEventListener('click', (event) => {
        _isPlayerVsPlayer = event.target.checked
        _isPlayerVsComputer = false
    })*/


    return { startGame }
}
)().startGame()
