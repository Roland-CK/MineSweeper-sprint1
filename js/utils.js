


// -------------- the model build ------------------------------ // 

function boardCreate(column, row) {

    gBoard = []
    for (var i = 0; i < column; i++) {
        gBoard[i] = [] // makes new array
        for (var j = 0; j < row; j++) {
            gBoard[i][j] = createCell(i, j) // makes new cell in that array
        }
    }
    createMine(0, 1)
    createMine(2, 3)
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


function createMine(i, j) {

    var cell = gBoard[i][j]
    cell.isMine = true
    cell.isShown = true
    cell.currCellContent = MINE

}


// ------------------ the dom render ----------------------------- //

function renderBoard(gBoard, selector) {
    var strHTML = '<table border="1"><tbody>';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            var className = 'cell cell' + i + '-' + j;
            strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
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

