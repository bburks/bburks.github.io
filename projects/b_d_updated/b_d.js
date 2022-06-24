var c;
var starting_params = [3, 2, 100];
var first_loop = true;

class Viewer {
  constructor() {
    this.c = createCanvas(windowWidth, windowHeight);
    this.graphBounds = [windowWidth * 0.2, windowHeight * 0.2,
    windowWidth * 0.8, windowHeight * 0.8];
    this.setupCanvas();
  }

  setupCanvas = () => {
    background(220, 220, 250);
    this.showAxes();
  }

  setFBounds = (bounds) => {
    this.fBounds = bounds;
  }

  x1 = () => {
    return this.graphBounds[0];
  }

  x2 = () => {
    return this.graphBounds[2];
  }

  y1 = () => {
      return this.graphBounds[1];
  }

  y2 = () => {
    return this.graphBounds[3];
  }

  fx1 = () => {
    return this.fBounds[0];
  }

  fx2 = () => {
    return this.fBounds[2];
  }

  fy1 = () => {
      return this.fBounds[1];
  }

  fy2 = () => {
    return this.fBounds[3];
  }

  showAxes = () => {
    drawingContext.setLineDash([10, 5]);
    strokeWeight(1);
    line(this.x1() * 0.7, this.y1(), this.x2(), this.y1());

    line(this.x1() * 0.7, this.y2(), this.x2(), this.y2());

    line(this.x1(), this.y1(), this.x1(),
    this.y2() + (windowHeight - this.y2()) * 0.3);

    line(this.x2(), this.y1(), this.x2(),
    this.y2()  + (windowHeight - this.y2()) * 0.3);

    strokeWeight(0);
    fill(240, 230, 200);
    rect(this.x1(), this.y1(), this.x2() - this.x1(), this.y2() - this.y1());

  }

  makeParameterButtons = () => {
    var parameterButtonBox = []
  }

}

class Model {
  constructor() {

  }
}

class Controller {
  constructor() {
    this.v = new Viewer();
    this.m = new Model();
  }

}




function setup() {
  frameRate(30);

  c = new Controller();

  noLoop();
}

function draw() {

}

function windowResized() {

}
