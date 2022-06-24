class Color {
  constructor(r, g, b, a = 255) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  towards(color, frac) {
    return Color(
    frac * color.r + (1 - frac) * frac.r,
    frac * color.g + (1 - frac) * frac.g,
    frac * color.b + (1 - frac) * frac.b,
    frac * color.a + (1 - frac) * frac.a
    )
  }

  fill() {
    fill(this.r, this.g, this.b, this.a);
  }

  background() {
    background(this.r, this.g, this.b, this.a);
  }

  stroke() {
    stroke(this.r, this.g, this.b, this.a);
  }
}

const bc = new Color(211, 200, 211);
const fallerC = new Color(201, 190, 221, 255);
const fr = 60;
const frPerFaller = 1;
var frCurrent = 0;
var time = 0;
var slowest;
var fastest;


class Faller {

  constructor() {
    this.x = Math.floor(Math.random() * windowWidth);
    this.y = 0;
    this.w = 2;
    this.h = 10;
    this.color = fallerC;
    this.next = null;
  }

  remove() {
    this.storm.remove(this);
  }

  show() {
    this.color.stroke();
    strokeWeight(1);
    line(this.x, this.y, this.x + this.w, this.y);
    bc.stroke();
    line(this.x - 1, this.y - this.h, this.x +  this.w + 1, this.y - this.h);
  }

  shiftDown(n) {
    this.y = this.y + n;
  }

  isVisible() {
    return (this.y < windowHeight + this.h + 1)
  }
}

function makeNewFaller() {
  newFaller = new Faller();
  slowest.next = newFaller;
  slowest = newFaller;
}

function removeInvisibleFallers() {
  while (!fastest.isVisible()) {
   fastest = fastest.next;
  }
}

function updateAndShowFallers() {
  current = fastest;
  while (current != null) {
    current.show();
    current.shiftDown(1);
    current = current.next;
  }

}

function updateFallers() {
  current = fastest;
  while (current != null) {
    current.shiftDown(1);
    current = current.next;
  }
}


function setup() {

  frameRate(fr);
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0, 'fixed');
  canvas.style('z-index', '-1');
  faller = new Faller();
  slowest = faller;
  fastest = faller;
  while (fastest.isVisible()) {
    frCurrent += 1;
    if (frCurrent % frPerFaller == 0) {
      makeNewFaller();
    }
    updateFallers();
  }
  bc.background();

}

function draw() {
  frCurrent += 1;
  if (frCurrent % frPerFaller == 0) {
    makeNewFaller();
  }

  updateAndShowFallers();
  removeInvisibleFallers();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  bc.background();
}
