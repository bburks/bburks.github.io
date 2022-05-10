

const grid = [
['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
['July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
['1', '2', '3', '4', '5', '6', '7'],
['8', '9', '10', '11', '12', '13', '14'],
['15', '16', '17', '18', '19', '20', '21'],
['22', '23', '24', '25', '26', '27' ,'28'],
['29', '30', '31']
];
const gridCycle = [[0, 0], [6, 0], [6, 2], [7, 2], [7, 6], [3, 6], [3, 7], [0, 7]];
const tw = todaysWinner();

var gridSquare;
var gridOffsetX;
var gridOffsetY;
var p = [[0, 1, 1], [1, 1, 1]];
var l = [[1, 1], [0, 1], [0, 1], [0, 1]];
var v = [[0, 0, 1], [0, 0, 1], [1, 1, 1]];
var u = [[1, 1], [1, 0], [1, 1]];
var y = [[1, 1, 1, 1], [0, 0, 1, 0]];
var z = [[1, 0, 0], [1, 1, 1], [0, 0, 1]];
var s = [[1, 0], [1, 1], [0, 1], [0, 1]];
var o = [[1, 1], [1, 1], [1, 1]];
var pieces = [p, l, v, u, y, z, s, o];
var pieceLocations = [[8, 5], [11, 0], [5, 4], [9, 2], [7, 0], [6, 0], [7, 2], [11, 4]];
var activeP = -1;
var mouseOffset = [0, 0];
var currentShowing = [];
var solved;
var startTime;
var finalDuration;
//p5.js

function setup() {
  colorMode(HSL, 100);
  gridSquare = min(windowWidth / 16, windowHeight / 10);
  gridOffsetX = (windowWidth - (13 * gridSquare)) / 2;
  gridOffsetY = (windowHeight - (7 * gridSquare)) / 2;

  frameRate(30);
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);


  startTime = new Date();

}

function draw() {
  background(6, 77, 75);
  showT();
  showG();
  showPs();
  showActiveP();




}

function mousePressed() {
  if (solved) {
    return;
  }


  if (activeP != -1) {
    spot = subtract(integerize(canvasToGrid([mouseX, mouseY])), mouseOffset);
    pieceLocations[activeP] = spot;
    activeP = -1;
    currentShowing = checkStatus();
    if (currentShowing.length == 2 && currentShowing[0] == tw[0] && currentShowing[1] == tw[1]) {
      solved = true;
    }

  } else {
    var res = getP();
    activeP = res[0];
    mouseOffset = [res[1], res[2]];
  }


}

function keyPressed() {
  if (keyCode == 82 || keyCode == 32) {
    rotateP(activeP);
  }
  if (keyCode == 70 || keyCode == 16) {
    flipP(activeP);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  gridSquare = min(windowWidth / 14, windowHeight / 8);
  gridOffsetX = (windowWidth - (13 * gridSquare)) / 2;
  gridOffsetY = (windowHeight - (7 * gridSquare)) / 2;
}

//visualizer functions

function showP(i) {
  var location = pieceLocations[i];
  var piece = pieces[i];
  var row;
  for (let j = 0; j < piece.length; j++) {
    row = piece[j];
    for (let k = 0; k < row.length; k++) {
      if (row[k] == 1) {
        canvasLocation = gridToCanvas([location[0] + k, location[1] + j]);
        strokeWeight(0);
        fill(15, 60, 75)
        square(canvasLocation[0], canvasLocation[1], gridSquare);
        stroke(0, 0, 0);
        strokeWeight(2);
        if (j == 0 || piece[j - 1][k] == 0) {
          var topRight = gridToCanvas([location[0] + k + 1, location[1] + j]);
          line(canvasLocation[0], canvasLocation[1], topRight[0], topRight[1]);
        }
        if (k == 0 || piece[j][k - 1] == 0) {
          var bottomLeft = gridToCanvas([location[0] + k, location[1] + j + 1]);
          line(canvasLocation[0], canvasLocation[1], bottomLeft[0], bottomLeft[1]);
        }
        if (j == piece.length - 1 || piece[j + 1][k] == 0) {
          var bottomLeft = gridToCanvas([location[0] + k, location[1] + j + 1]);
          var bottomRight = gridToCanvas([location[0] + k + 1, location[1] + j + 1]);
          line(bottomLeft[0], bottomLeft[1], bottomRight[0], bottomRight[1]);
        }
        if (k == row.length - 1 || piece[j][k + 1] == 0) {
          var topRight = gridToCanvas([location[0] + k + 1, location[1] + j]);
          var bottomRight = gridToCanvas([location[0] + k + 1, location[1] + j + 1]);
          line(topRight[0], topRight[1], bottomRight[0], bottomRight[1]);
        }





      }
    }
  }
}

function showPs() {
  for (let i = 0; i < pieces.length; i++) {
    if (i == activeP) {
      continue;
    }
    showP(i);
  }
}

function showG() {

  var lastPoint = gridToCanvas([0, 7]);
  var currentPoint;
  for (let i = 0; i < gridCycle.length; i++) {
    currentPoint = gridToCanvas(gridCycle[i]);
    strokeWeight(4);
    line(currentPoint[0], currentPoint[1], lastPoint[0], lastPoint[1]);
    lastPoint = currentPoint;


  }

  var row;
  var val;
  stroke(0, 0, 0);
  textSize(gridSquare * 0.4);
  textAlign(CENTER);
  for (let i = 0; i < grid.length; i++) {
    row = grid[i];
    for (let j = 0; j < row.length; j++) {
      val = row[j];
      var topLeft = gridToCanvas([j, i]);
      var bottomRight = gridToCanvas([j + 1, i + 1]);
      if (!solved) {
      fill(0, 100, 100);
      } else {
      fill(75, 77, 75);
      }
      strokeWeight(1);
      square(topLeft[0], topLeft[1], bottomRight[0] - topLeft[0]);
      fill(0, 0, 0);
      strokeWeight(0);
      text(val, j * gridSquare + gridOffsetX, (i + 0.34) * gridSquare + gridOffsetY, gridSquare, gridSquare);
    }
  }



}


function showActiveP() {
  fill(15, 0, 0, 40)
  if (activeP != -1) {
    var location = subtract(integerize(canvasToGrid([mouseX, mouseY])), mouseOffset);
    var piece = pieces[activeP];
    strokeWeight(0);
    for (let j = 0; j < piece.length; j++) {
      row = piece[j];
      for (let k = 0; k < row.length; k++) {
        if (row[k] == 1) {
          canvasLocation = gridToCanvas([location[0] + k, location[1] + j]);
          square(canvasLocation[0], canvasLocation[1], gridSquare);
          }





        }
      }
    }
  }

function showT() {
var loc = gridToCanvas([8,5]);
if (!solved) {
finalDuration = new Date();
finalDuration = Math.floor((finalDuration - startTime) / 1000);
}
strokeWeight(0);
fill(0, 0, 0);
textSize(gridSquare);
text(str(finalDuration),loc[0], loc[1], 8*gridSquare, gridSquare);

}

//piece movement

function translateP(i, location) {
  pieceLocations[i] = location;
}

function rotateP(i) {
  if (i == -1) {
  return;
  }
  var piece = pieces[i];
  var oldRow;
  var rotated = [];
  var oldW = piece[0].length;
  var oldH = piece.length;

  for (let j = 0; j < oldW; j++) {
    rotated.push([]);
  }

  for (let j = 0; j < oldH; j++) {
    var oldRow = piece[j];
    for (let k = 0; k < oldW; k++) {
      var exists = oldRow[k];
      rotated[oldW - k - 1].push(exists);
    }
  }

  mouseOffset = [mouseOffset[1], piece[0].length - 1 - mouseOffset[0]];


  pieces[i] = rotated;
}

function flipP(i) {
  if (i == -1) {
  return;
  }
  var piece = pieces[i];
  for (let j = 0; j < piece.length; j++) {
    row = piece[j];
    row.reverse();
  }
  mouseOffset[0] = pieces[activeP][0].length - mouseOffset[0] - 1;
}

function getP() {
  gridLocation = integerize(canvasToGrid([mouseX, mouseY]));
  for (let i = 0; i < pieces.length; i++) {
    piece = pieces[i];
    pieceLocation = pieceLocations[i];
    for (let j = 0; j < piece.length; j++) {
      row = piece[j];
      for (let k = 0; k < row.length; k++) {
        if (row[k] == 1
        && pieceLocation[0] + k == gridLocation[0]
        && pieceLocation[1] + j == gridLocation[1]) {
          return [i, k, j];
        }
      }
    }
  }
  return [-1, 0, 0];
}


//canvas converter

function gridToCanvas(spot) {
  return [spot[0] * gridSquare + gridOffsetX, spot[1] * gridSquare + gridOffsetY];
}

function canvasToGrid(spot) {
  return [(spot[0] - gridOffsetX) / gridSquare, (spot[1] - gridOffsetY) / gridSquare];
}

function integerize(duple) {
  return [Math.floor(duple[0]), Math.floor(duple[1])];
}

function subtract(d1, d2) {
  return [d1[0] - d2[0], d1[1] - d2[1]];
}

//status check

function checkStatus() {

var gridStatusCopy = [
['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
['July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
['1', '2', '3', '4', '5', '6', '7'],
['8', '9', '10', '11', '12', '13', '14'],
['15', '16', '17', '18', '19', '20', '21'],
['22', '23', '24', '25', '26', '27' ,'28'],
['29', '30', '31']
];
var piece;
var location;
var row;
var coveredSpot;
for (let i = 0; i < pieces.length; i++) {
  piece = pieces[i];
  location = pieceLocations[i];
  for (let j = 0; j < piece.length; j++) {
    row = piece[j];
    for (let k = 0; k < row.length; k++) {
      if (row[k] == 1) {
        coveredSpot = [location[0] + k, location[1] + j];
        if (
        coveredSpot[1] < gridStatusCopy.length
        && coveredSpot[1] >= 0
        && coveredSpot[0] < gridStatusCopy[coveredSpot[1]].length
        && coveredSpot[0] >= 0) {
          gridStatusCopy[coveredSpot[1]][coveredSpot[0]] = 'covered';
        }
      }
    }
  }
}

uncovered = [];
for (let i = 0; i < gridStatusCopy.length; i++) {
  row = gridStatusCopy[i];
  for (let j = 0; j < row.length; j++) {
    item = row[j];
    if (item != 'covered') {
      uncovered.push(item);
    }
  }
}

return uncovered;

}

function todaysWinner() {
  var today = new Date();
  var dd = today.getDate() - 1;
  var mm = today.getMonth();
  var winner = [];
  if (mm < 6) {
    winner.push(grid[0][mm]);
  } else {
    winner.push(grid[1][mm - 6])
  }
  if (dd < 7) {
    winner.push(grid[2][mm]);
  } else if (dd < 14) {
    winner.push(grid[3][dd - 7]);
  } else if (mm < 21) {
    winner.push(grid[4][dd - 14]);
  } else if (mm < 28) {
    winner.push(grid[5][dd - 21]);
  } else {
    winner.push(grid[6][dd - 28]);
  }
  return winner;

}
