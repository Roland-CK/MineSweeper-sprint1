'use strict'

const MINE = '<img class="bomb-img" src="./img/bomb.png" alt="">'
const NOTHING = ''
const FLAG = '<img class="flag-img" src="./img/flag.png" alt="">'
const VICTORY_SMILE = "./img/victorysmile.png"
const GAME_SMILE = "./img/gamesmile.png"
const LOSE_SMILE = "./img/gameoversmile.png"
const HINT_CLICKED = "./img/hintClicked.png"
const HINT_NOT_CLICKED = "./img/hint.png"

var gBoard;

var gGame = {
    isOn: false,
    safeClickCounter: 3,
    livesCounter: 1,
    isOnHintMode: false
}

var gClickCellOption = true;
var gRightBtnClickCellOption = true;
var gStartOnClickCounter;
var gTotalSeconds = 0;
var gFirstClickIndicator;
var gMinesNumberChoice = 2
var gLeftBtnClickedCellIdx = { i: 0, j: 0 }
var gElHint = [
    document.querySelector('.hint1'),
    document.querySelector('.hint2'),
    document.querySelector('.hint3')
];
var gElLeftBtnClickedCell;
var gPlayingLevel = {
    islevel1: false,
    islevel2: false,
    islevel3: false,
}
var gIsVictory = {
    level1: false,
    level2: false,
    level3: false
}



function init(column, row, minesNumber) {

    // restart attributes
    gGame.safeClickCounter = 3
    gIsVictory.level1 = false
    gIsVictory.level2 = false
    gIsVictory.level3 = false
    hintReset()
    gLeftBtnClickedCellIdx.i = 0
    gLeftBtnClickedCellIdx.j = 0
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
    document.querySelector('.game-smile').src = GAME_SMILE
    column === 4 ? gGame.livesCounter = 1 : gGame.livesCounter = 3
    gGame.isOn = true
    boardCreate(column, row)
    console.table(boardCreate(column, row))
    renderBoard(gBoard, '.board-container')
}


function initOnLoad(column, row, minesNumber) {

    gPlayingLevel.islevel1 = true
    gPlayingLevel.islevel2 = false
    gPlayingLevel.islevel3 = false
    init(column, row, minesNumber)
}




function initLevel1(column, row, minesNumber) {
    
    gPlayingLevel.islevel1 = true
    gPlayingLevel.islevel2 = false
    gPlayingLevel.islevel3 = false
    
    init(column, row, minesNumber)
}

function initLevel2(column, row, minesNumber) {
    
    gPlayingLevel.islevel1 = false
    gPlayingLevel.islevel2 = true
    gPlayingLevel.islevel3 = false
    
    init(column, row, minesNumber)
}

function initLevel3(column, row, minesNumber) {
    
    gPlayingLevel.islevel1 = false
    gPlayingLevel.islevel2 = false
    gPlayingLevel.islevel3 = true
    
    init(column, row, minesNumber)
}



function startPlay(minesNumb) {

    createAndRandomPositinMines(minesNumb)
    setMinesNegsCount(gBoard)
}