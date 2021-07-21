'use strict'

// debugger
const MINE = '<img class="bomb-img" src="./img/bomb.png" alt="">'
const NOTHING = ''


var gBoard;
var gGame = {
    isOn: false,
    shownCellsCount: 0,
    markedCellsCount: 0,
    secsPassed: 0
}


function init() {

    gGame.isOn = true
    boardCreate(4, 4)
    console.table(boardCreate(4, 4))
    renderBoard(gBoard, '.board-container')
    renderCells(gBoard)
    setMinesNegsCount(gBoard)

}

