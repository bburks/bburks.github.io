var c;
var starting_params = [3, 2, 100];
var first_loop = true;

class Viewer {
  constructor(controller) {
    this.controller = controller;
    this.margin = 0.15;
    this.axis_tail_length = this.margin * windowWidth / 3;
    this.button_width = 30;
    this.param_names = ['b', 'd', 'n' + String.fromCharCode(8320)];
    this.create_canvas();


  }

  create_canvas = () => {
  this.canvas = createCanvas(windowWidth, windowHeight);
  this.canvas.position(0, 0);
  this.setup_canvas();
  }

  setup_canvas = () => {


    background(220, 220, 250);
    strokeWeight(0);
    fill(240, 230, 200);
    rect(this.margin * windowWidth,
    this.margin * windowHeight,
    (1 - 2 * this.margin) * windowWidth,
    (1 - 2 * this.margin) * windowHeight);
    this.show_axes();
  }

  set_header = (title) => {
    let q = createElement('h1', title);
    q.position(windowWidth * this.margin, windowHeight * this.margin);

  }

  show_population_chooser = () => {
    this.set_header('How many populations would you like to model?');
    let b1 = createButton('1');
    b1.size(this.button_width, this.button_width);
    b1.position(windowWidth * this.margin, windowHeight * this.margin * 2);
    let b2 = createButton('2');
    b2.size(this.button_width, this.button_width);
    b2.position(windowWidth * this.margin + 2 * this.button_width, windowHeight * this.margin * 2);
    let b3 = createButton('3');
    b3.size(this.button_width, this.button_width);
    b3.position(windowWidth * this.margin + 4 * this.button_width, windowHeight * this.margin * 2);



    b1.mousePressed(this.controller.one_population_chosen);
    b2.mousePressed(this.controller.two_populations_chosen);
    b3.mousePressed(this.controller.three_populations_chosen);
  }

  set_scale = (x, y) => {
    this.xs = x;
    this.ys = y;
  }

  scale_x = (x) => {
    return windowWidth * this.margin + windowWidth * (x / this.xs) * (1 - 2 * this.margin);
  }

  scale_y = (y) => {
    return windowHeight * (1 - this.margin - (y / this.ys) * (1 - 2 * this.margin));
  }

  line = (x1, y1, x2, y2) => {
    if (y1 > this.ys && y2 > this.ys) {
      return;
    }

    if (y1 > this.ys) {
      var xspot = x1 + (x2 - x1) * (y1 - this.ys) / (y1 - y2);
      line(this.scale_x(xspot), this.scale_y(this.ys), this.scale_x(x2),
      this.scale_y(y2));
      return;
    }

    if (y2 > this.ys) {
      var xspot = x2 + (x1 - x2) * (y2 - this.ys) / (y2 - y1);
      line(this.scale_x(xspot), this.scale_y(this.ys), this.scale_x(x1), this.scale_y(y1));
      return;
    }

    strokeWeight(2);
    line(this.scale_x(x1),
    this.scale_y(y1),
    this.scale_x(x2),
    this.scale_y(y2));
  }

  lines = (x1, y1s, x2, y2s) => {

  for (let i = 0; i < y1s.length; i ++) {
    if (i == 0) {
     stroke(100, 100, 0);
    }
    this.line(x1, y1s[i], x2, y2s[i]);

  }

  }

  show_axes = () => {
    drawingContext.setLineDash([10, 5]);
    strokeWeight(1);
    stroke(0, 0, 0);
    line(windowWidth * this.margin,
    windowHeight * (1 - this.margin) + this.axis_tail_length,
    windowWidth * this.margin,
    windowHeight * this.margin);

    line(windowWidth * this.margin - this.axis_tail_length,
    windowHeight * (1 - this.margin),
    windowWidth * (1 - this.margin),
    windowHeight * (1 - this.margin));

    line(windowWidth * this.margin - this.axis_tail_length,
    windowHeight * this.margin,
    windowWidth * (1 - this.margin),
    windowHeight * this.margin);

    line(windowWidth * (1 - this.margin),
    windowHeight * this.margin,
    windowWidth * (1 - this.margin),
    windowHeight * (1 - this.margin) + this.axis_tail_length);
    drawingContext.setLineDash([]);
  }

  show_scale = () => {
    textSize(20);
    text('t = 0', this.margin * windowWidth - 17,
    (1 - this.margin) * windowHeight + this.axis_tail_length + 20);
    text('t = ' + str(this.xs), (1 - this.margin) * windowWidth - 17,
    (1 - this.margin) * windowHeight + this.axis_tail_length + 20);
    text('n = 0',
    this.margin * windowWidth - this.axis_tail_length - 55,
    (1 - this.margin) * windowHeight + 8);
    text('n = ' + str(this.ys),
    this.margin * windowWidth - this.axis_tail_length - 55,
    (this.margin) * windowHeight + 20);
  }

  show_title = () => {
    strokeWeight(0);
    fill(0, 0, 0);
    textSize(windowHeight * this.margin * 0.13);
    textStyle(BOLD);
    text('Branching Process Visualizer', 10, 10,
    windowWidth - 20, windowHeight * this.margin / 7);
    textStyle(NORMAL);
    text('We simulate the size of a continuous-time linear birth-death branching '
    + 'process n(t) between times '
    + 't = 0 and t = 1. The birth rate is b, the death rate is d, and the '
    + 'initial population size is n'
    +  String.fromCharCode(8320)
    + '. The black path is the result of one simulation, and the gray path '
    + 'is the theoretical average (mean) simulation. '
    + 'Finally, note '
    + 'the vertical axis\' upper bound depends on parameter choice.',
    10, 20 + windowHeight * this.margin / 7,
    windowWidth - 200, windowHeight * this.margin);

  }

  create_parameter_chooser = (params) => {

    var buttons = [];
    var startingX = windowWidth * (this.margin) + 10;
    var startingY = windowHeight * (this.margin) + 10;
    var currentY = startingY;
    this.parameter_labels = [];

    for (let i = 0; i < params.length; i++) {
      var currentX = startingX;
      var down = createButton('-');
      var lb = createButton(this.param_names[i] + ' = ' + str(params[i]));
      this.parameter_labels.push(lb);
      var up = createButton('+');


      down.mousePressed(
      this.get_function_when_parameter_button_pressed(this.controller, i, -1));

      up.mousePressed(
      this.get_function_when_parameter_button_pressed(this.controller, i, 1));

      down.position(currentX, currentY);
      down.size(40, 40);
      down.addClass('changer');
      lb.position(currentX + down.width, currentY);
      lb.size(100, 40);
      lb.addClass('label');
      up.position(currentX + down.width + lb.width, currentY);
      up.size(40, 40);
      up.addClass('changer');
      currentX += down.width;
      currentY += down.height;


    }


    this.create_start_button(startingX, startingY);
  }

  get_function_when_parameter_button_pressed = (controller, i, change) => {
    function f() {
      controller.parameter_button_pressed(i, change);
    }
    return f;

  }

  create_start_button = (startingX, startingY) => {
    this.start_button = createButton('start');
    this.start_button.mousePressed(this.controller.start_button_pressed);
    this.start_button.position(startingX, startingY + 120);
    this.start_button.size(180, 40);
    this.start_button.addClass('stop');
  }

  update_parameter_label = (i, new_value) => {
    this.parameter_labels[i].html(this.param_names[i] + ' = ' + str(new_value));
  }

  restart = () => {
    clear();
    this.setup_canvas();
  }


}

class OnePopModel {
  constructor(params) {
    this.params = [...params];
    this.time = 0;
    this.last_time = 0;
    this.count = this.start();
    this.last_count = this.count;

  }

  run = (duration) => {

    this.last_count = this.count;
    this.last_time = this.time;
    var end_time = this.time + duration;
    while (true) {
      var waiting_time = Math.log(Math.random()) * (-1) / (this.tr() * this.count);
      var next_time = this.time + waiting_time;

      if (next_time > end_time || this.count == 0) {
        this.time = end_time;
        break;
      } else {
        this.time = next_time;
        var r = Math.random() * this.tr();
        if (r < this.d()) {
          this.count -= 1;
        } else {
          this.count += 1;
        }
      }

    }
  }

  b = () => {
    return this.params[0];
  }

  d = () => {
    return this.params[1];
  }

  tr = () => {
    return this.b() + this.d();
  }

  start = () => {
    return this.params[2];
  }

  get_average = (t) => {
    return Math.pow(Math.E, (t * (this.b() - this.d()))) * this.start();
  }

  set_controller = (c) => {
    this.controller = c;
  }



}

class Controller {
  constructor() {
    this.viewer = new Viewer(this);
    this.status = 0;
    noLoop();

  }

  set_model = (model) => {
    this.model = model;
    this.model.set_controller(this);
  }

  startup = (model) => {
    this.viewer.setup_canvas();
  }

  parameter_button_pressed = (param, change) => {
    var old_value = starting_params[param];

    var adjusted_change;
    if (param == 2) {
      if (change > 0) {
        adjusted_change = Math.pow(10,
        Math.floor(Math.log(old_value + 0.5) / Math.log(10.0)));
      } else {
        adjusted_change = - Math.pow(10,
        Math.floor(Math.log(old_value - 1) / Math.log(10.0)));
      }
      var new_value = Math.min(old_value + adjusted_change, 9000);
    } else {
      var new_value = Math.floor(old_value * 5 + change + 0.5) / 5;
    }



    if (new_value < 0) {
      return;
    }
    starting_params[param] = new_value;
    this.viewer.update_parameter_label(param, new_value);





  }

  start_button_pressed = () => {
    if (this.status == 0) {
      this.viewer.start_button.html('stop');
      this.viewer.start_button.removeClass('start');
      this.viewer.start_button.addClass('stop');
      this.status = 1;
      var m = new OnePopModel(starting_params);
      this.set_model(m);
      this.viewer.restart();
      this.viewer.set_scale(
      1, Math.ceil(max(2 * this.model.start(), 1.2 * this.model.get_average(1))));
      this.viewer.show_title();
      this.viewer.show_scale();
      loop();
    } else if (this.status == 1) {
      this.viewer.start_button.html('restart');
      this.viewer.start_button.removeClass('stop');
      this.viewer.start_button.addClass('start');
      this.status = 0;
      noLoop();
    }
  }

}




function setup() {
  frameRate(60);

  c = new Controller();
  c.viewer.create_parameter_chooser(starting_params);
  c.viewer.show_title();
  c.start_button_pressed();



}

function draw() {
  if (first_loop) {
    first_loop = false;
    return;
  }

  stroke(180, 180, 180);

  c.viewer.line(
  c.model.time, c.model.get_average(c.model.time),
  c.model.last_time, c.model.get_average(c.model.last_time));

  stroke(0, 0, 0);

  c.viewer.line(c.model.time, c.model.count,
  c.model.last_time, c.model.last_count);


  c.model.run(0.01);
  if (c.model.time > 1.01) {
    c.viewer.start_button.html('restart');
    c.status = 0;
    c.viewer.start_button.removeClass('stop');
    c.viewer.start_button.addClass('start');
    noLoop();
  }


}

function windowResized() {
  //resizeCanvas(windowWidth, windowHeight);
  //c.viewer.setup_canvas();

}
