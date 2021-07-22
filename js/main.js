'use strict'

const MINE = '<img class="bomb-img" src="./img/bomb.png" alt="">'
const NOTHING = ''
const FLAG = '<img class="flag-img" src="./img/flag.png" alt="">'
const VICTORY_SMILE = "./img/victorysmile.png"
const GAME_SMILE = "./img/gamesmile.png"
const LOSE_SMILE = "./img/gameoversmile.png"

var gBoard;

var gGame = {
    isOn: false,
    shownCellsCount: 0,
    markedCellsCount: 0,
    secsPassed: 0,
    livesCounter: 1
}

var gClickCellOption = true;
var gRightBtnClickCellOption = true;
var gStartOnClickCounter;
var gTotalSeconds = 0;
var gFirstClickIndicator;
var gMinesNumberChoice = 2
var gClickedCellIdx = {i: 0, j: 0}



function init(column, row, minesNumber) {

    // restart attributes
    gClickedCellIdx = {i: 0, j: 0}
    closeModal()
    gGame.isOn = false
    stopTimer(gStartOnClickCounter)
    gStartOnClickCounter = false;
    gTotalSeconds = 0
    gClickCellOption = true;
    gRightBtnClickCellOption = true;
    gFirstClickIndicator = false
    gMinesNumberChoice = minesNumber
    resetDomTimer()


    // render a new game
    document.querySelector('.game-smile').src=GAME_SMILE
    column === 4 ? gGame.livesCounter = 1 : gGame.livesCounter = 3
    gGame.isOn = true
    boardCreate(column, row)
    console.table(boardCreate(column, row))
    renderBoard(gBoard, '.board-container')
}


function startPlay(minesNumb) {

    createAndRandomPositinMines(minesNumb)
    setMinesNegsCount(gBoard)
}





