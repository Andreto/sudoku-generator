var board = [];
var printBoard;
var fillSpots = 30;
var boardElem = document.getElementById("sudoku-board");
var fillRange = document.getElementById("fill-range");

const urlParams = new URLSearchParams(window.location.search);

fillRange.addEventListener("input", function () {
    document.getElementById("filled-spots-value").innerHTML = fillRange.value;
    fillSpots = parseInt(fillRange.value);
});

function checkQueryId() {
    if (urlParams.get("id")) {
        var id = urlParams.get("id");
        if (id.length == 81) {
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    board[i][j] = id.charAt(i*9 + j)
                }
            }
            printBoard = board;
            displayBoard();
        }
    }
}

function initBoardFill() {
    for (let i = 0; i < 9; i++) {
        board.push([]);
        var tr = document.createElement("tr");
        for (let j = 0; j < 9; j++) {
            var td = document.createElement("td");
            tr.appendChild(td);
            board[i].push([0]);
        }
        boardElem.appendChild(tr);
    }
}

function displayBoard() {
    var trs = boardElem.querySelectorAll("tr");
    for (let i = 0; i < 9; i++) {
        var tds = trs[i].querySelectorAll("td");
        for (let j = 0; j < 9; j++) {
            if (printBoard[i][j] != 0) {
                tds[j].innerHTML = printBoard[i][j];
            }
        }
    }
}

function resetBoard() {
    boardElem.innerHTML = "";
    board = [];
    initBoardFill();
}

function getBoardId() {
    var out = "";
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            out += printBoard[i][j].toString();
        }
    }
    return(out);
}

function shareButton() {
    var copyInput = document.getElementById("copy-link-text");
    copyInput.value = "https://andreto.github.io/sudoku-generator/?id=" + getBoardId();
    copyInput.select();
    copyInput.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.getElementById("copy-confirm").style.visibility = "inherit";
}

function getValidFill(x, y, a) {
    var row = new Array(9);
    var col = new Array(9);
    var box = new Array(9);

    var xSt = Math.floor(x/3)*3;
    var ySt = Math.floor(y/3)*3;

    // Row, Column
    for (let i = 0; i < 9; i++) {
        row[i] = board[y][i];
        col[i] = board[i][x];
    }

    // Box
    for (let i = xSt; i < xSt + 3; i++) {
        for (let j = ySt; j < ySt + 3; j++) {
            box[j*3 + i] = board[j][i];
        }
    }

    return(!(row.includes(a) || col.includes(a) || box.includes(a)))
}

function generateBoard() {
    document.getElementById("copy-confirm").style.visibility = "hidden";
    var invalid = true;
    var loopCount = 0;
    var i;
    var valid;
    while (invalid) {
        resetBoard();
        i = 0;
        valid = true;
        while (i < 81) {
            var x = i % 9;
            var y = Math.floor(i/9);
            var a = Math.floor(Math.random() * 9);
            for (let ii = 0; ii < 9; ii++){
                let aa = ((a+ii)%9)+1;
                if (getValidFill(x, y, aa)) {
                    board[y][x] = aa;
                    ii = 9;
                }
            }
            if (board[y][x] == 0) {
                i = 82;
                valid = false;
            }
            i++
        }
        if (valid) {
            invalid = false;
        }
        loopCount++;
        if (loopCount > 1000) {
            debugger;
        }
    }
    console.log("Tries made:", loopCount);
    printBoard = board;
    for (let i = 0; i < 81 - fillSpots;) {
        var x = Math.floor(Math.random() * 9);
        var y = Math.floor(Math.random() * 9);
        if (printBoard[y][x] != 0) {
            printBoard[y][x] = 0;
            i++
        }
    }
}