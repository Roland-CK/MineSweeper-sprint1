


// -------------- the model build ------------------------------ // 

function boardCreate(column, row) {

    gBoard = []
    for (var i = 0; i < column; i++) {
        gBoard[i] = [] // makes new array
        for (var j = 0; j < row; j++) {
            gBoard[i][j] = createCell(i, j) // makes new cell in that array
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

function createAndRandomPositinMines(minesNumber, idex, jdex) {

    for (var i = 1; i <= minesNumber; i++) {
        var randCell = getRandCell(idex, jdex)
        createMine(randCell.i, randCell.j)
    }
}


function createMine(i, j) {

    var cell = gBoard[i][j]
    cell.isMine = true
    // cell.isShown = true
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
            // strHTML += '<td onclick="cellClicked(this)" class="' + className + '"> ' + cell + ' </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;

    document.querySelector('.lives-counter').innerHTML = `<div class="lives-counter">Lives remaining : ${gGame.livesCounter}</div>`
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

function renderCellsWithNegsNums(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isShown) continue
            else {
                var elCell = document.querySelector(`.cell${board[i][j].location.i}-${board[i][j].location.j}`);
                elCell.innerHTML = NOTHING
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
            var currCell = board[i][j]
            board[i][j].isShown = true // model update
            elCell = document.querySelector(`.cell${board[i][j].location.i}-${board[i][j].location.j}`);
            elCell.innerHTML = board[i][j].minesAroundCount
        }
    }

    return;
}


// ----------------  mouse click  -------------------------------//


function cellClicked(elCell, i, j) {
    if (gClickCellOption !== true)
        return;
    // debugger
    countClicksAndRestartTimer()


    if (gFirstClickIndicator !== true) {
        gFirstClickIndicator = true

        gBoard[i][j].isShown = true

        elCell = document.querySelector(`.cell${gBoard[i][j].location.i}-${gBoard[i][j].location.j}`);
        elCell.innerHTML = gBoard[i][j].minesAroundCount

        startPlay(gMinesNumberChoice, i, j)
        return

    }


    if (gBoard[i][j].isMarked) return;

    if (gBoard[i][j].isMine && gBoard[i][j].isShown === false) {
        // debugger
        --gGame.livesCounter
        console.log('livesCounter', gGame.livesCounter);
        var modalTxt = document.querySelector('.modal').innerText
        document.querySelector('.lives-counter').innerHTML = `<div class="lives-counter">Lives remaining : ${gGame.livesCounter}</div>`
        if (gGame.livesCounter <= 0) {
            gameOver(i, j)
            gBoard[i][j].isShown = true
        modalTxt = 'G A M E  O V E R'
        openModal() 
        return
        } 

        modalTxt = 'Ooooops! you blowned a BOMB!)'
        openModal()

        elCell = document.querySelector(`.cell${gBoard[i][j].location.i}-${gBoard[i][j].location.j}`);
        elCell.innerHTML = gBoard[i][j].currCellContent

    }

    else {
        gBoard[i][j].isShown = true // model update
        elCell = document.querySelector(`.cell${gBoard[i][j].location.i}-${gBoard[i][j].location.j}`);
        elCell.innerHTML = gBoard[i][j].minesAroundCount
        if (gBoard[i][j].minesAroundCount === 0) {
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
    gGame.isOn = false
    stopTimer(gStartOnClickCounter)
    gClickCellOption = false
    gRightBtnClickCellOption = false
    document.querySelector('.game-smile').src = VICTORY_SMILE
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

function getRandCell(iIndx, jIndx) {
    var cells = [];

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = { i: i, j: j };
            if (cell.i === iIndx && cell.j === jIndx)
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
    document.querySelector('.timer').innerHTML = "Just start by click a cell : " + hour + ":" + minute + ":" + seconds;
}

function countClicksAndRestartTimer() {

    if (!gStartOnClickCounter) {
        gStartOnClickCounter = setInterval(countTimer, 1000);
    }
}

function stopTimer(interval) {
    if (gGame.isOn === false) clearInterval(interval)

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

