var c;
var starting_params = [100, 100, 1, 1, 1, 1, 1, 1];
var param_labels = ['n1', 'n2', 'b1', 'b2', 'd1', 'd2', 'l12', 'l21'];
var first_loop = true;

class Viewer {
  constructor(controller) {
    this.controller = controller;
    this.c = createCanvas(windowWidth, windowHeight);
    this.c.position(0, 0);
    this.elements = [];
    this.setupCanvas();
  }

  setupCanvas = () => {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].remove();
    }
    this.elements = [];
    this.graphBounds = [windowWidth * 0.15, windowHeight * 0.15,
    windowWidth * 0.75, windowHeight * 0.85];
    this.setFBounds([0, 0, 1, 199]);
    clear();
    background(220, 220, 250);
    this.showAxes();
    this.showFBounds();
    this.createParameterChooser();
  }

  setFBounds = (bounds) => {
    this.fBounds = bounds;
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

  showFBounds = () => {
    strokeWeight(0);
    fill(0, 0, 0);
    textSize(24);
    text('t = ' + str(this.fx1()), this.x1() + 10, this.y2() + 60);
    text('t = ' + str(this.fx2()), this.x2() + 10, this.y2() + 60);
    text('n = ' + str(this.fy1()), this.x1() - 90, this.y2() - 10);
    text('n = ' + str(this.fy2()), this.x1() - 90, this.y1() + 25);
  }

  createParameterChooser = (
  bounds = [this.x2() + 60,
  this.y1() + 50,
  windowWidth - 60,
  this.y2() - 50]
  ) => {


    var startingX = bounds[0];
    var startingY = bounds[1];
    var count = param_labels.length;
    const buttonHeight = (bounds[3] - bounds[1]) / count;
    const buttonWidth = (bounds[2] - bounds[0]) / 4;
    const labelWidth = bounds[2] - bounds[0] - 2 * buttonWidth;
    this.parameter_label_buttons = [];

    for (let i = 0; i < count; i++) {
      var label = createButton(param_labels[i] + ' = ' + starting_params[i]);
      label.position(startingX + buttonWidth, startingY + i * buttonHeight);
      label.size(labelWidth, buttonHeight);
      label.addClass('label');
      this.parameter_label_buttons[i] = label;
      this.elements.push(label);
      var down = createButton('-');
      down.mousePressed(() => {this.controller.parameterButtonPressed(i, -1)});
      down.position(startingX, startingY + i * buttonHeight);
      down.size(buttonWidth, buttonHeight);
      down.addClass('changer');
      this.elements.push(down);
      var up = createButton('+');
      up.mousePressed(() => {this.controller.parameterButtonPressed(i, 1)});
      up.position(startingX + buttonWidth + labelWidth,
       startingY + i * buttonHeight);
      up.size(buttonWidth, buttonHeight);
      up.addClass('changer');
      this.elements.push(up);


    }


  }

  updateParameterLabel = (i, label, value) => {
    this.parameter_label_buttons[i].html(label + ' = ' + str(value));
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



}

class Model {
  constructor(controller) {
    this.controller = controller;
    this.parameter_values = starting_params;
    this.parameter_labels = param_labels;
  }

  getParameterLabel = (i) => {
    return this.parameter_labels[i];
  }
  getParameterValue = (i) => {
    return this.parameter_values[i];
  }
  incrementParameter = (i) => {
    this.parameter_values[i] = this.parameter_values[i] + 1;
  }
  decrementParameter = (i) => {
    this.parameter_values[i] = this.parameter_values[i] - 1;
  }


}

class Controller {
  constructor() {
    this.v = new Viewer(this);
    this.m = new Model(this);
  }


  parameterButtonPressed = (i, j) => {
    if (j == 1) {
      this.m.incrementParameter(i);
    }
    if (j == -1) {
      this.m.decrementParameter(i);
    }
    var val = this.m.getParameterValue(i);
    var label = this.m.getParameterLabel(i);
    this.v.updateParameterLabel(i, label, val)
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
  resizeCanvas(windowWidth, windowHeight, true);
  c.v.setupCanvas();
}
