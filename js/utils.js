


// -------------- the model build ------------------------------ // 

function boardCreate(column, row) {

    gBoard = []
    for (var i = 0; i < column; i++) {
        gBoard[i] = []
        for (var j = 0; j < row; j++) {
            gBoard[i][j] = createCell(i, j)
        }
    }

    return gBoard
}

function createCell(i, j) {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMarked: false,
        isMine: false,
        currCellContent: '',

        location: {
            i: i,
            j: j
        }
    }
    return cell
}

function createAndRandomPositinMines(minesNumber) {

    for (var i = 1; i <= minesNumber; i++) {
        var randCell = getRandCell()
        createMine(randCell.i, randCell.j)
    }
}


function createMine(i, j) {

    var cell = gBoard[i][j]
    cell.isMine = true
    cell.currCellContent = MINE

}


// ------------------ the dom render ----------------------------- //

function renderBoard(gBoard, selector) {
    var strHTML = '<table border="1"><tbody>';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j].currCellContent;
            var className = 'cell cell' + i + '-' + j;
            strHTML += `<td oncontextmenu="rightClick(this,${i},${j}); return false;" onclick="cellClicked(this,${i},${j})" class="${className}"> ${cell} </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;

    document.querySelector('.lives-counter').innerHTML = `<div class="lives-counter">Lives remaining : ${gGame.livesCounter}</div>`
    document.querySelector('.safe-btn-intxt').innerHTML = `${gGame.safeClickCounter} clicks available`
}

function renderCells(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isMine) {
                var elCell = document.querySelector(`.cell${board[i][j].location.i}-${board[i][j].location.j}`);
                elCell.innerHTML = MINE;
            }
            else {
                var elCell = document.querySelector(`.cell${board[i][j].location.i}-${board[i][j].location.j}`);
                elCell.innerHTML = NOTHING;
            }
        }
    }
}


//------------------- negs counters ----------------------------------- //

function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {

            var negsCounter = negsCount(i, j, gBoard)
            board[i][j].minesAroundCount = negsCounter
        }
    }
}

function negsCount(cellI, cellJ, board) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            var currCell = board[i][j]
            if (currCell.isMine) neighborsCount++;
        }
    }
    return neighborsCount;
}


function negsToShow(cellI, cellJ, board) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (gBoard[i][j].isMarked) continue;
            board[i][j].isShown = true // model update
            var elCell = document.querySelector(`.cell${board[i][j].location.i}-${board[i][j].location.j}`);
            elCell.innerHTML = board[i][j].minesAroundCount
        }
    }
    return;
}


function negsToShowHintClick(cellI, cellJ, board) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isShown) continue;
            else
                // board[i][j].isShown = true // model update
                var elCell = document.querySelector(`.cell${board[i][j].location.i}-${board[i][j].location.j}`);
            board[i][j].isMine ? elCell.innerHTML = MINE : elCell.innerHTML = board[i][j].minesAroundCount
        }
    }
    return;
}

function negsToDis(cellI, cellJ, board) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isShown) continue;
            // board[i][j].isShown = false // model update
            var elCell = document.querySelector(`.cell${board[i][j].location.i}-${board[i][j].location.j}`);
            elCell.innerHTML = NOTHING
        }
    }
    return;
}


// ----------------  mouse click  -------------------------------//



function cellClicked(elCell, i, j) {

    gElLeftBtnClickedCell = elCell
    gLeftBtnClickedCellIdx.i = i
    gLeftBtnClickedCellIdx.j = j

    var cell = gBoard[i][j]
    if (gClickCellOption !== true)
        return;

    countClicksAndRestartTimer()

    if (gFirstClickIndicator !== true) {

        gFirstClickIndicator = true

        startPlay(gMinesNumberChoice)
        cell.isShown = true
        if (cell.minesAroundCount === 0) {
            negsToShow(i, j, gBoard)
        }
        elCell = document.querySelector(`.cell${cell.location.i}-${cell.location.j}`);
        elCell.innerHTML = cell.minesAroundCount
        return
    }

    if (cell.isMarked) return;

    if (cell.isMine && cell.isShown === false && gGame.isOnHintMode === false) {
        --gGame.livesCounter
        console.log('livesCounter', gGame.livesCounter);
        var elLivesCounter = document.querySelector('.lives-counter')
        elLivesCounter.innerHTML = `<div class="lives-counter">Lives remaining : ${gGame.livesCounter}</div>`
        if (gGame.livesCounter <= 0) {
            gameOver(i, j)
            cell.isShown = true
            return
        }

        var modalTxt = document.querySelector('.modal')
        modalTxt.innerText = `Ooooops! you blowned a BOMB! and you got just ${gGame.livesCounter} tries`
        openModal()

        elCell = document.querySelector(`.cell${cell.location.i}-${cell.location.j}`);
        elCell.innerHTML = cell.currCellContent
    }

    if (gGame.isOnHintMode && cell.isShown === false) {

        cell.isMine ? elCell.innerHTML = MINE : elCell.innerHTML = cell.minesAroundCount // dom
        negsToShowHintClick(i, j, gBoard)
        setTimeout(hintDissapear, 1000)

        return
    }

    else {
        cell.isShown = true // model update
        elCell = document.querySelector(`.cell${cell.location.i}-${cell.location.j}`);
        elCell.innerHTML = cell.minesAroundCount
        if (cell.minesAroundCount === 0) {
            negsToShow(i, j, gBoard)
        }

        checkVictory()
    }
}

function rightClick(elCell, i, j) {
    if (gClickCellOption !== true)
        return;

    if (gBoard[i][j].isMarked === false) {
        gBoard[i][j].isMarked = true   // model update
        elCell = document.querySelector(`.cell${gBoard[i][j].location.i}-${gBoard[i][j].location.j}`)  // DOM update
        elCell.innerHTML = FLAG    // DOM update
        checkVictory()
        return false
    }

    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false
        elCell.innerHTML = NOTHING
    }
    return false
}


// ----------------  end game  -----------------------------------//



function checkVictory() {

    for (var idx = 0; idx < gBoard.length; idx++) {
        for (var jdx = 0; jdx < gBoard.length; jdx++) {
            if (gBoard[idx][jdx].isMine && gBoard[idx][jdx].isMarked !== true)
                return;
        }
    }

    for (var idx = 0; idx < gBoard.length; idx++) {
        for (var jdx = 0; jdx < gBoard.length; jdx++)
            if (gBoard[idx][jdx].isMine !== true && gBoard[idx][jdx].isShown !== true)
                return;
    }

    console.log('Victory!');
    // debugger
    if (gPlayingLevel.islevel1)
        gIsVictory.level1 = true
    else if (gPlayingLevel.islevel2)
        gIsVictory.level2 = true
    else if (gPlayingLevel.islevel3)
        gIsVictory.level3 = true

    console.log('playing level : ', gPlayingLevel, 'is victory? ', gIsVictory);

    gGame.isOn = false
    stopTimer(gStartOnClickCounter)
    shwoBestScore()
    gClickCellOption = false
    gRightBtnClickCellOption = false
    document.querySelector('.game-smile').src = VICTORY_SMILE
    var elModal = document.querySelector('.modal')
    elModal.innerText = 'Victory!'
    elModal.style.backgroundColor = "green"
    openModal()



}


function gameOver(i, j) {

    gBoard[i][j].isShown = true
    gGame.isOn = false
    stopTimer(gStartOnClickCounter)
    console.log('Game Over ):');
    var elCell = document.querySelector(`.cell${gBoard[i][j].location.i}-${gBoard[i][j].location.j}`);
    elCell.innerHTML = MINE;
    for (var idx = 0; idx < gBoard.length; idx++) {
        for (var jdx = 0; jdx < gBoard.length; jdx++) {
            if (gBoard[idx][jdx].isMine) {
                gBoard[idx][jdx].isShown = true
                var elCell = document.querySelector(`.cell${gBoard[idx][jdx].location.i}-${gBoard[idx][jdx].location.j}`);
                elCell.innerHTML = MINE;
                gClickCellOption = false
                gRightBtnClickCellOption = false
                document.querySelector('.game-smile').src = LOSE_SMILE
                var elModal = document.querySelector('.modal')
                elModal.innerText = 'G A M E   O V E R'
                openModal()
            }
        }

    }
}


// ---------------------------- random --------------------------------//

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandCell() {
    var cells = [];

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = { i: i, j: j };
            if (gBoard[i][j].isMine)
                continue
            if (cell.i === gLeftBtnClickedCellIdx.i && cell.j === gLeftBtnClickedCellIdx.j)
                continue
            else
                cells.push(cell);
        }
    }

    var randomCell = cells[getRandomInt(0, cells.length)];
    if (!randomCell) return null;

    return randomCell;
}


function getRandCellforSafeClick() {
    var cells = [];

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = { i: i, j: j };
            if (gBoard[i][j].isMine || gBoard[i][j].isShown || gBoard[i][j].isMarked)
                continue
            else
                cells.push(cell);
        }
    }

    var randomCell = cells[getRandomInt(0, cells.length)];
    if (!randomCell) return null;

    return randomCell;
}

//---------------------------  timer  --------------------------------//

function countTimer() {

    ++gTotalSeconds;
    var hour = Math.floor(gTotalSeconds / 3600);
    var minute = Math.floor((gTotalSeconds - hour * 3600) / 60);
    var seconds = gTotalSeconds - (hour * 3600 + minute * 60);
    if (hour < 10)
        hour = "0" + hour;
    if (minute < 10)
        minute = "0" + minute;
    if (seconds < 10)
        seconds = "0" + seconds;
    var inHtmlTxt = "Just start by click on a cell : "
    document.querySelector('.timer').innerHTML = inHtmlTxt + hour + ":" + minute + ":" + seconds;

    if (gPlayingLevel.islevel1) {
        localStorage.scoreLvl1 = hour + ":" + minute + ":" + seconds // store 
    }
    if (gPlayingLevel.islevel2) {
        localStorage.scoreLvl2 = hour + ":" + minute + ":" + seconds // store
    }
    if (gPlayingLevel.islevel3) {
        localStorage.scoreLvl3 = hour + ":" + minute + ":" + seconds // store

    }


}

function countClicksAndRestartTimer() {

    if (!gStartOnClickCounter) {
        gStartOnClickCounter = setInterval(countTimer, 1000);
    }
}

function stopTimer(interval) {
    if (gGame.isOn === false) clearInterval(interval)
}

function resetDomTimer() {

    var elTimer = document.querySelector('.timer')
    elTimer.innerText = `Just start by click on a cell : 00:00:00`
}

// --------------------- modal ------------------------//
function openModal() {
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'block';
    setTimeout(closeModal, 2000);
}

function closeModal() {
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'none';
}



// ------- bonus: hint button ---------------------------------------- //

var gElCurrHint;

function hintClicked(elHint) {

    if (gFirstClickIndicator !== true)
        return
        
    else {

        if (gGame.isOnHintMode) {
            if (gElCurrHint === elHint) {
                gGame.isOnHintMode = false
                elHint.src = HINT_NOT_CLICKED
                gElCurrHint = elHint
                return
            }
            else return
        }

        else {
            gGame.isOnHintMode = true
            elHint.src = HINT_CLICKED
            gElCurrHint = elHint
            return
        }
    }

}

function hintDissapear() {

    gElLeftBtnClickedCell.innerHTML = NOTHING
    negsToDis(gLeftBtnClickedCellIdx.i, gLeftBtnClickedCellIdx.j, gBoard)
    gElCurrHint.style.display = 'none'
    gGame.isOnHintMode = false
}

function hintReset() {

    gElHint[0].src = HINT_NOT_CLICKED
    gElHint[1].src = HINT_NOT_CLICKED
    gElHint[2].src = HINT_NOT_CLICKED

    gElHint[0].style.display = ''
    gElHint[1].style.display = ''
    gElHint[2].style.display = ''

    gGame.isOnHintMode = false
}

// -------- bonus: best score ---------------------------------------- //

localStorage.bestScoreLvl1 = '61:61:61'
localStorage.bestScoreLvl2 = '61:61:61'
localStorage.bestScoreLvl3 = '61:61:61'



function shwoBestScore() {
    // debugger
    if (gIsVictory.level1) {

        var currScore = localStorage.scoreLvl1.split(':')
        var currBestScore = localStorage.bestScoreLvl1.split(':')
        for (var i = 0; i < currScore.length; i++) {
            currScore[i] = +currScore[i]
            currBestScore[i] = +currBestScore[i]
        }

        for (var i = 0; i < currScore.length; i++) {
            if (currScore[i] < currBestScore[i]) {
                localStorage.bestScoreLvl1 = localStorage.scoreLvl1
                document.querySelector('.best-score').innerHTML = "Best time record (level 1) : " + localStorage.bestScoreLvl1
                return
            }
            else continue
        }
    }

    if (gIsVictory.level2) {

        var currScore = localStorage.scoreLvl2.split(':')
        var currBestScore = localStorage.bestScoreLvl2.split(':')
        for (var i = 0; i < currScore.length; i++) {
            currScore[i] = +currScore[i]
            currBestScore[i] = +currBestScore[i]
        }

        for (var i = 0; i < currScore.length; i++) {
            if (currScore[i] < currBestScore[i]) {
                localStorage.bestScoreLvl2 = localStorage.scoreLvl2
                document.querySelector('.best-score').innerHTML = "Best time record (level 2) : " + localStorage.bestScoreLvl2
                return
            }
            else continue
        }
    }

    if (gIsVictory.level3) {

        var currScore = localStorage.scoreLvl3.split(':')
        var currBestScore = localStorage.bestScoreLvl3.split(':')
        for (var i = 0; i < currScore.length; i++) {
            currScore[i] = +currScore[i]
            currBestScore[i] = +currBestScore[i]
        }

        for (var i = 0; i < currScore.length; i++) {
            if (currScore[i] < currBestScore[i]) {
                localStorage.bestScoreLvl3 = localStorage.scoreLvl3
                document.querySelector('.best-score').innerHTML = "Best time record (level 3) : " + localStorage.bestScoreLvl3
                return
            }

        }
    }

}


// --------- bonus: safe click button ----------------------------------- //

function onSafeClickBtn() {

    if (gGame.safeClickCounter === 0)
        return
    else

        --gGame.safeClickCounter
    var getRandCell = getRandCellforSafeClick()
    var elCell = document.querySelector(`.cell${getRandCell.i}-${getRandCell.j}`);

    document.querySelector('.safe-btn-intxt').innerHTML = `${gGame.safeClickCounter} clicks available`
    elCell.style.backgroundColor = 'blue'

    setTimeout(function () { elCell.style.backgroundColor = 'white' }, 2000)

}