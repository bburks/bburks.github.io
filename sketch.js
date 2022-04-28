const rowCount = 50;
const colCount = 50;
const odds = 0.3;
const honesty = 0.99;
const fr = 32;
const framesPerUpdate = 4;

var running = false;
var board;
var lastBoard;
var keepGoing = true;
var frameCounter = 0.0;



function setup() {
  frameRate(fr);
  noStroke();
  canvas = createCanvas(windowWidth, windowHeight);
  board = makeBoard();
  lastBoard = board;
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  background(221, 241, 251);
  showBoard(lastBoard, board, 1)
}

function draw() {
  updateLife()
}

function mousePressed() {
  running = !running;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(221, 241, 251);
}

function makeBoard() {

  var row;
  var data = [];
  for (i=0; i<rowCount; i++) {
    row = [];
    for (j=0; j<colCount; j++) {
      row.push(Math.random() < odds);
    }
    data.push(row);
  }
  return data;
}

function showBoard(lastBoard, board, frac) {
  for (i=0; i<rowCount; i++) {
    for (j=0; j<colCount; j++) {
      if (board[i][j] && lastBoard[i][j]) {
        fill(201, 221, 251);
      } else if (!board[i][j] && !lastBoard[i][j]){
        fill(221, 241, 251);
      } else if (!board[i][j] && lastBoard[i][j]){
        fill(201 + 20*frac, 221 + 20*frac, 251);
      } else {
        fill(221 - 20*frac, 241 - 20*frac, 251);
      }
      square(80*i - 40, 80*j - 40, 78, 25);
    }
  }

}

function right(i) {
  if (i + 1 == colCount) {
    return 0;
  }
  return i + 1;
}

function left(i) {
  if (i == 0) {
    return colCount - 1;
  }
  return i - 1;
}

function up(i) {
  if (i == 0) {
    return rowCount - 1;
  }
  return i - 1;
}

function down(i) {
  if (i + 1 == rowCount) {
    return 0;
  }
  return i + 1;
}

function makeUpdated(board) {
  var tempRow;
  var tempData = [];
  var neighbors;
  var onCount;

  for (var i=0; i<rowCount; i++) {
    tempRow = [];
    for (var j=0; j<colCount; j++) {

      onCount = 0;
      if (board[up(i)][left(j)]) {
      onCount ++;
      }
      if (board[up(i)][j]) {
      onCount ++;
      }
      if (board[up(i)][right(j)]) {
      onCount ++;
      }
      if (board[i][right(j)]) {
      onCount ++;
      }
      if (board[down(i)][right(j)]) {
      onCount ++;
      }
      if (board[down(i)][j]) {
      onCount ++;
      }
      if (board[down(i)][left(j)]) {
      onCount ++;
      }
      if (board[i][left(j)]) {
      onCount ++;
      }

      if (onCount == 3) {
        tempRow.push(stochasticize(true));
      } else if ((onCount == 2) && (board[i][j])) {
        tempRow.push(stochasticize(true));
      } else {
        tempRow.push(stochasticize(false));
      }
    }
    tempData.push(tempRow);
  }

  return tempData;
}

function stochasticize(bool) {
  if (Math.random() < honesty) {
  return bool;
  }
  return !bool;
}

function limitToOne(i) {
  if (i > 1) {
    return 1;
  }
  return i;
}

function updateLife() {
  showBoard(lastBoard, board, limitToOne(frameCounter / framesPerUpdate));
  frameCounter += 1;
  if (frameCounter == framesPerUpdate) {
    frameCounter = 0.0;
    lastBoard = board;
    if (running) {
    board = makeUpdated(board);
    }
  }
}
