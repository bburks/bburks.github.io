const rowCount = 30;
const colCount = 50;
const visibleW = 25;
const visibleH = 15;


const odds = 0;
var honesty;
const fr = 24;
const framesPerUpdate = 3;


var gridSize;
var running = true;
var board;
var lastBoard;
var keepGoing = true;
var frameCounter = 0.0;
var honestySlider;
var started;


function setup() {
  frameRate(fr);
  noStroke();
  canvas = createCanvas(windowWidth, windowHeight);
  gridSize = Math.min(
  Math.floor(windowWidth / visibleW), Math.floor(windowHeight/visibleH));
  board = makeBoard();
  lastBoard = board;
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  background(221, 241, 251);
  showBoard(lastBoard, board, 1)
  makeSlider();
  noLoop();

}

function draw() {
  honesty = honestySlider.value();
  background(221, 241, 251);
  updateLife();

  logHonesty();
}

function mousePressed() {
  if (!started) {
  started = true;
  loop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(221, 241, 251);
  honestySlider.remove();
  makeSlider();
}

function makeBoard() {
  const N = [[true, false, false, false, true],
  [true, true, false, false, true],
  [true, false, true, false, true],
  [true, false, false, true, true],
  [true, false, false, false, true]];
  const A = [[false, true, true, false],
  [true, false, false, true],
  [true, true, true, true],
  [true, false, false, true],
  [true, false, false, true]];
  const O = [[false, true, false],
  [true, false, true],
  [true, false, true],
  [true, false, true],
  [false, true, false]];
  const M = [[true, false, false, false, true],
  [true, true, false, true, true],
  [true, false, true, false, true],
  [true, false, false, false, true],
  [true, false, false, false, true]];
  const I = [[true, true, true],
  [false, true, false],
  [false, true, false],
  [false, true, false],
  [true, true, true]];
  const B = [[true, true, true, false],
  [true, false, false, true],
  [true, true, true, false],
  [true, false, false, true],
  [true, true, true, false]];
  const U = [[true, false, false,true],
  [true, false, false,true],
  [true, false, false,true],
  [true, false, false,true],
  [false, true, true, false]];
  const R = [[true, true, true, false],
  [true, false, false, true],
  [true, true, true, false],
  [true, false, false, true],
  [true, false, false, true]];
  const K = [[true, false, false, true],
  [true, false, true, false],
  [true, true, false, false],
  [true, false, true, false],
  [true, false, false, true]]
  const S = [[true, true, true, true],
  [true, false, false, false],
  [true, true, true, true],
  [false, false, false, true],
  [true, true, true, true]];

  var row;
  var data = [];
  for (i=0; i<rowCount; i++) {
    row = [];
    for (j=0; j<colCount; j++) {
      row.push(Math.random() < odds);
    }
    data.push(row);
  }
  /*
  insert(N, 1, 1, data);
  insert(A, 1, 7, data);
  insert(O, 1, 12, data);
  insert(M, 1, 16, data);
  insert(I, 1, 22, data);
  insert(B, 10, 1, data);
  insert(U, 10, 6, data);
  insert(R, 10, 11, data);
  insert(K, 10, 16, data);
  insert(S, 10, 21, data);
  */
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
      square(gridSize*j - gridSize / 2, gridSize*i - gridSize / 2, gridSize - 2, gridSize / 3);
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

function insert(pattern, row, col, myBoard) {
  pr = pattern.length
  pc = pattern[0].length
  for (i=0; i<pr; i++) {
    for (j=0; j<pc; j++) {
      myBoard[i + row][j + col] = pattern[i][j]
    }
  }
}

function makeSlider() {
honestySlider = createSlider(0.9, 1, 1, 0.001);
honestySlider.position(windowWidth / 3, windowHeight - 50);
honestySlider.style('width',  str(windowWidth / 3) + 'px');
honestySlider.style('opacity', '50%');


}

function logHonesty() {
fill(0, 0, 0, 100);
textSize(32);
noStroke();
text('Spontaneity: ' + str(Math.floor(1000 - honesty * 1000) / 10) + '%', 10, 10, windowWidth, 100);
}
