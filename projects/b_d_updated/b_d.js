var c;
var starting_params = [100, 0, 2, 1, 1, 2, 2, 1];
var param_labels = ['n' + '1'.sub(), 'n' + '2'.sub(), 'b' + '1'.sub(), 'b' + '2'.sub(),
'd' + '1'.sub(), 'd' + '2'.sub(), '\u03BB' + '12'.sub(), '\u03BB' + '21'.sub()];
var first_loop = true;
var lastTime;
var lastCounts;
var lastAverages;
const increment = 0.005;

class Viewer {
  constructor(controller) {
    this.controller = controller;
    this.c = createCanvas(windowWidth, windowHeight);
    this.c.position(0, 0);
    this.elements = [];
    this.setupCanvas();
  }

  setupCanvas = (fbounds = null) => {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].remove();
    }
    this.elements = [];
    this.graphBounds = [windowWidth * 0.15, windowHeight * 0.15,
    windowWidth * 0.75, windowHeight * 0.85];
    clear();
    background(220, 220, 250);
    this.showAxes();
    if (fbounds != null) {
      this.setFBounds(fbounds);
      this.showFBounds();
    }
    this.createParameterChooser();
    this.showTitle();
  }

  wipeCanvas = () => {
    this.showAxes();
  }

  setFBounds = (bounds) => {
    this.fBounds = bounds;
  }

  showAxes = () => {
    drawingContext.setLineDash([10, 5]);
    strokeWeight(1);
    stroke(0, 0, 0, 255);
    line(this.x1() * 0.7, this.y1(), this.x2(), this.y1());

    line(this.x1() * 0.7, this.y2(), this.x2(), this.y2());

    line(this.x1(), this.y1(), this.x1(),
    this.y2() + (windowHeight - this.y2()) * 0.3);

    line(this.x2(), this.y1(), this.x2(),
    this.y2()  + (windowHeight - this.y2()) * 0.3);
    drawingContext.setLineDash([]);
    strokeWeight(0);
    fill(240, 230, 200);
    rect(this.x1(), this.y1(), this.x2() - this.x1(), this.y2() - this.y1());

  }

  showFBounds = () => {
    strokeWeight(0);
    fill(0, 0, 0);
    textSize(18);
    text('t = ' + str(this.fx1()), this.x1() + 10, this.y2() + 60);
    text('t = ' + str(this.fx2()), this.x2() + 10, this.y2() + 60);
    text('n = ' + str(this.fy1()), this.x1() - 90, this.y2() - 10);
    text('n = ' + str(Math.floor(this.fy2())), this.x1() - 90, this.y1() + 25);
  }

  showTitle = () => {
  stroke(0, 0, 0);
  noStroke();
  fill(0, 0, 0);
  text('We simulate the size of a continuous-time linear two-type birth-death branching '
  + 'process n(t) between times '
  + 't = 0 and t = 1. For type i, the birth rate is b\u1D62, the death rate is '
  + 'd\u1D62, and the '
  + 'initial population size is n\u1D62. '
  + 'The transition rate from type i to type j is '
  + '\u03BB\u1D62\u2C7C.'
  + 'The dark, jagged path is population sizes in the result of one simulation, and the '
  + 'grey paths are '
  + 'the theoretical average simulation with the chosen parameters.',
   10, 10, windowWidth - 10, windowHeight - 10);
  }

  createParameterChooser = (
  bounds = [this.x2() + (windowWidth - this.x2()) * 0.15,
  this.y1() + 20,
  windowWidth - (windowWidth - this.x2()) * 0.15,
  this.y2() - 50]) => {


    var startingX = bounds[0];
    var startingY = bounds[1];
    var count = param_labels.length;
    const buttonHeight = (bounds[3] - bounds[1]) / (count + 0.5);
    const buttonWidth = (bounds[2] - bounds[0]) / 4;
    const labelWidth = bounds[2] - bounds[0] - 2 * buttonWidth;
    this.parameter_label_buttons = [];

    for (let i = 0; i < count; i++) {
      var label = createButton(param_labels[i] + ' = ' + starting_params[i]);
      label.position(startingX + buttonWidth, startingY + i * buttonHeight);
      label.size(labelWidth, buttonHeight);
      label.addClass('label');
      label.style('font-size', '16px');
      this.parameter_label_buttons[i] = label;
      this.elements.push(label);
      var down = createButton('-');
      down.mousePressed(() => {this.controller.parameterButtonPressed(i, -1)});
      down.position(startingX, startingY + i * buttonHeight);
      down.size(buttonWidth, buttonHeight);
      down.addClass('changer');
      down.style('font-size', '16px');
      this.elements.push(down);
      var up = createButton('+');
      up.mousePressed(() => {this.controller.parameterButtonPressed(i, 1)});
      up.position(startingX + buttonWidth + labelWidth,
       startingY + i * buttonHeight);
      up.size(buttonWidth, buttonHeight);
      up.addClass('changer');
      up.style('font-size', '16px');
      this.elements.push(up);


    }

    this.create_start_button([startingX, startingY + count * buttonHeight, bounds[2],
    startingY + (count + 0.5) * buttonHeight]);
  }

  create_start_button = (bounds) => {
    var start_button = createButton('start');
    start_button.mousePressed(() => this.controller.startButtonPressed(start_button));
    start_button.position(bounds[0], bounds[1]);
    start_button.size(bounds[2] - bounds[0], bounds[3] - bounds[1]);
    start_button.addClass('start');
    this.elements.push(start_button);
    this.start_button = start_button;
  }

  setButton = (type) => {
    if (type == 'restart') {
      this.start_button.removeClass('stop');
      this.start_button.addClass('start');
      this.start_button.html('start');
    } else if (type == 'stop') {
      this.start_button.removeClass('start');
      this.start_button.addClass('stop');
      this.start_button.html('stop');
    }

  }

  updateParameterLabel = (i, label, value) => {
    this.parameter_label_buttons[i].html(label + ' = ' + str(value));
  }

  line = (t1, n1, t2, n2) => {

    if (n2 > this.fy2() && n1 > this.fy2()) {
      return;
    }

    if (n2 > this.fy2() && n1 <= this.fy2()) {
      this.line(t1, n1, t1 + (this.fy2() - n1) * (t2 - t1) / (n2 - n1), this.fy2());
      return;
    }

    if (n1 > this.fy2() && n2 <= this.fy2()) {
      this.line(t2, n2, t1, n1);
      return;
    }


    this.c.line(this.convert_time(t1), this.convert_count(n1),
    this.convert_time(t2), this.convert_count(n2));
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

  convert_time = (t) => {
    return (t - this.fx1()) / (this.fx2() - this.fx1()) *
      (this.x2() - this.x1()) + this.x1();
  }

  convert_count = (n) => {
    return this.y2() - (n - this.fy1()) / (this.fy2() - this.fy1()) *
    (this.y2() - this.y1());
  }


}

class Model {
  constructor(controller) {
    this.controller = controller;
    this.parameter_values = starting_params;
    this.parameter_labels = param_labels;
    this.initialize();
  }

  getParameterLabel = (i) => {
    return this.parameter_labels[i];
  }
  getParameterValue = (i) => {
    return this.parameter_values[i];
  }
  incrementParameter = (i) => {
    if (i > 1) {
      this.parameter_values[i] =
      Math.floor(this.parameter_values[i] * 10 + 1.5) / 10;
    } else {
      if (this.parameter_values[i] >= 100000) {
        return;
      }
      var lastPower =
      10 ** Math.floor(0.01 + Math.log(this.parameter_values[i]) / Math.log(10));
      this.parameter_values[i] =
      this.parameter_values[i] + max(1, lastPower);
    }
  }
  decrementParameter = (i) => {
    if (i > 1) {
      this.parameter_values[i] = max(0,
      Math.floor(this.parameter_values[i] * 10 - 0.5) / 10);
    } else {
      if (this.parameter_values[i] == 0) {
        return;
      }
      var lastPower =
      10 ** Math.floor(Math.log(this.parameter_values[i] - 0.5) / Math.log(10));
      this.parameter_values[i] =
      this.parameter_values[i] - max(1, lastPower);
    }

  }

  initialize = () => {
    this.status = 0;
    this.parameter_values_initialized = [...this.parameter_values];
    this.current_time = 0;
    this.current_population_counts =
    this.parameter_values_initialized.slice(0, 2);
    this.starting_population_counts =
    this.parameter_values_initialized.slice(0, 2);
    this.evolution_matrix = math.matrix([[
      this.parameter_values_initialized[2] -
        this.parameter_values_initialized[4] - this.parameter_values_initialized[6],
      this.parameter_values_initialized[6]],
      [this.parameter_values_initialized[7],
      this.parameter_values_initialized[3] -
        this.parameter_values_initialized[5] -
        this.parameter_values_initialized[7]]]);
    lastTime = this.current_time;
    lastCounts = [this.get_population_size(0), this.get_population_size(1)];
    lastAverages = math.matrix(lastCounts);
  }

  get_birth_rate = (i) => {
    if (i == 0 || i == 1) {
      return this.parameter_values_initialized[i + 2];
    }
  }

  get_death_rate = (i) => {
    if (i == 0 || i == 1) {
      return this.parameter_values_initialized[i + 4];
    }
  }

  get_transition_rate = (i, j) => {
    if (i == 0 && j == 1) {
      return this.parameter_values_initialized[6];
    }

    if (i == 1 && j == 0) {
      return this.parameter_values_initialized[7];
    }
  }

  get_population_size = (i) => {
    return this.current_population_counts[i];
  }

  set_population_size = (i, count) => {
    this.current_population_counts[i] = count;
  }

  get_total_rate = () => {
    var total_rate = 0;
    for (let i = 0; i < 2; i++) {
      total_rate += this.get_birth_rate(i) * this.get_population_size(i);
      total_rate += this.get_death_rate(i) * this.get_population_size(i);
      total_rate += this.get_transition_rate(i, 1 - i)
      * this.get_population_size(i);
    }
    return total_rate;
  }

  get_random_event = () => {
    var r = Math.random() * this.get_total_rate();
    let i = 0;
    while (true) {
      var event_rate;
      if (i < 2) {
        event_rate = this.get_birth_rate(i) * this.get_population_size(i);
      } else if (i < 4) {
        event_rate = this.get_death_rate(i - 2) * this.get_population_size(i - 2);
      } else if (i < 6) {
        event_rate = this.get_transition_rate(i - 4, 5 - i) * this.get_population_size(i - 4);
      }
      if (r < event_rate) {
        return i;
      }
      i++;
      r -= event_rate;
    }

  }

  get_random_duration = () => {
    return (- Math.log(Math.random()) / this.get_total_rate());
  }

  get_average_counts = (t) => {
    return math.multiply(this.starting_population_counts,
     math.expm(math.multiply(this.evolution_matrix, t)));

  }

  calculateYBound = () => {
    var ending_amounts = this.get_average_counts(1);
    return max(math.max(this.starting_population_counts),
    math.max(ending_amounts));
  }

  run = (duration) => {
    var end_time = this.current_time + duration;
    var next_time;
    while (true) {
      next_time = this.current_time + this.get_random_duration();
      if (next_time > end_time) {
        this.current_time = end_time;
        break;
      }
      var i = this.get_random_event();

      if (i < 2) {
        this.set_population_size(i, this.get_population_size(i) + 1);
      } else if (i < 4) {
        this.set_population_size(i - 2, this.get_population_size(i - 2) - 1);
      } else if (i < 6) {
        this.set_population_size(i - 4, this.get_population_size(i - 4) - 1);
        this.set_population_size(5 - i, this.get_population_size(5 - i) + 1);
      }
      this.current_time = next_time;
    }
  }




}

class Controller {
  constructor() {
    this.m = new Model(this);
    this.v = new Viewer(this);
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

  startButtonPressed = () => {
    if (this.m.status == 0 || this.m.status == 2) {
      this.m.initialize();
      this.v.setupCanvas([0, 0, 1, this.m.calculateYBound() * 1.2]);
      this.m.status = 1;
      this.v.setButton('stop');
      loop();
    } else if (this.m.status == 1) {
      this.m.status = 2;
      this.v.setButton('restart');
      noLoop();
    }
  }

}


function setup() {
  frameRate(60);
  c = new Controller();
  lastTime = c.m.current_time;
  lastCounts = [c.m.get_population_size(0), c.m.get_population_size(1)];
  lastAverages = lastCounts;
  c.startButtonPressed();
}

function draw() {
  if (c.m.status != 1) {
    return;
  }
  c.m.run(increment);
  currentTime = c.m.current_time;
  currentCounts = [c.m.get_population_size(0), c.m.get_population_size(1)]
  currentAverages = c.m.get_average_counts(currentTime);



  strokeWeight(2);
  for (let i = 0; i < 2; i++) {
    if (i == 0) {
      stroke(100, 0, 100, 255);
    } else {
      stroke(50, 50, 120, 255);
    }
    c.v.line(currentTime, currentCounts[i], lastTime, lastCounts[i]);
    if (i == 0) {
      stroke(100, 0, 100, 50);
    } else {
      stroke(50, 50, 120, 50);
    }
    c.v.line(currentTime, currentAverages.get([i]), lastTime, lastAverages.get([i]));
  }

  lastTime = currentTime;
  lastCounts = currentCounts;
  lastAverages = currentAverages;

  if (c.m.current_time > 1 - increment * 0.5) {
    c.m.status = 2;
    c.v.setButton('restart');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, true);
  c.v.setupCanvas();
}
