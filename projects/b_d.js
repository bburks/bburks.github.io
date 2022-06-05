
class TimePoint {
  constructor(t, counts) {
    this.time = t;
    this.counts = counts;
  }

  min() {
    var mn = this.counts[0];
    var count;
    for (let i = 1; i < this.counts.length; i++) {
      count = this.counts[i];
      if (count < mn) {
        mn = count;
      }
    }
    return mn;
  }

  max() {
    var mx = this.counts[0];
    var count;
    for (let i = 1; i < this.counts.length; i++) {
      count = this.counts[i];
      if (count > mx) {
        mx = count;
      }
    }
    return mx;
  }

  refactor(bounds) {
    var refactoredCounts = [];
    for (let i = 0; i < counts.length; i ++) {
      rCount = counts[i] - bounds[1]
      refactoredCounts.push()
    }
  }

}

class TimeData {
  constructor(data = []) {
    this.data = data;
  }

  append(datum) {
    this.data.push(datum);

  }

  length() {
    return this.data.length;
  }

  _computeBounds() {

    var thisMin;
    var thisMax;
    var datum = this.data[0];
    var dMin = datum.min();
    var dMax = datum.max();


    var dT = datum.time;

    var xMin = dT;
    var xMax = dT;
    var yMax = dMax;
    var yMin = dMin;

    for (let i = 1; i < this.data.length; i++) {
      datum = this.data[i];
      dMin = datum.min();
      dMax = datum.max();
      dT = datum.time;

      if (dMin < yMin) {
        yMin = dMin;
      }
      if (dMax > yMax) {
        yMax = dMax;
      }
      if (dT < xMin) {
        xMin = dT;
      }
      if (dT > xMax) {
        xMax = dT;
      }
    }
    return [xMin, yMin, xMax - xMin, yMax - yMin];
  }
}

class Viewer {

  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.data = [];
  }

  fill() {

    //rect(this.x1, this.y1, this.x2, this.y2);
    rect(this.standardizeX(0), this.standardizeY(0),
    this.standardizeX(1) -  this.standardizeX(0),
    this.standardizeY(1) - this.standardizeY(0));
  }

  set(data) {
    this.data = data;
  }

  drawData() {


    var bounds = this.data._computeBounds();

    for (let i = 0; i < this.data.data.length - 1; i++) {
      var current = this.data.data[i];
      var next = this.data.data[i + 1];


      var scTime = (current.time - bounds[0]) / bounds[2];
      var snTime = (next.time - bounds[0]) / bounds[2];
      for (let j = 0; j < current.counts.length; j++) {
        this.drawLine(scTime,
         (current.counts[j] - bounds[1]) / bounds[3],
         snTime,
         (next.counts[j] - bounds[1]) / bounds[3]);
      }
    }
  }

  standardizeX(x) {
    return this.x1 + ((this.x2 - this.x1) * x);
  }

  standardizeY(y) {
    return this.y2 - ((this.y2 - this.y1) * y);
  }

  drawLine(x1, y1, x2, y2) {
    line(this.standardizeX(x1), this.standardizeY(y1),
    this.standardizeX(x2), this.standardizeY(y2));
    //line(this.x1, this.y1, this.x2, this.y2)
  }

}

class BDProcess1 {

  constructor(b, d, count) {
    this.b = b;
    this.d = d;
    this.counts = new TimeData([new TimePoint(0, [count])]);
    this.time = 0;
  }

  



}





var i = 0;
var v;
function toGraph(i) {
  return Math.sin(i / 1000);
}



function setup() {
  //frameRate(1)
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0, 'fixed');
  background(200, 200, 255);


  v = new Viewer(0, 0, windowWidth, windowHeight);
  times = new TimeData([]);
  v.set(times);


  fill(0, 0, 0);
  strokeWeight(1);
  stroke(255, 0, 0);






}

function draw() {
  v.data.append(new TimePoint(i, [toGraph(i)]));
  i++;
  v.fill();
  v.drawData();

}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

}
