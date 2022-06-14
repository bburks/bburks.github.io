var c;
var starting_params = [1, 1, 10];

class Viewer {
  constructor(controller) {
    this.controller = controller;
    this.margin = 0.2;
    this.button_width = 30;
    this.elements = [];
    this.param_names = ['b', 'd', 'start'];
    this.create_canvas();

  }

  create_canvas = () => {
  this.canvas = createCanvas(windowWidth, windowHeight);
  this.canvas.position(0, 0);
  this.setup_canvas();
  }

  setup_canvas = () => {

    background(220, 220, 250);
    this.show_axes();
  }

  set_header = (title) => {
    let q = createElement('h1', title);
    q.position(windowWidth * this.margin, windowHeight * this.margin);
    this.elements.push(q);
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

    this.elements.push(b1);
    this.elements.push(b2);
    this.elements.push(b3);


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
    strokeWeight(2);
    line(this.scale_x(x1), this.scale_y(y1), this.scale_x(x2), this.scale_y(y2));
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
    strokeWeight(3);
    stroke(0, 0, 0);
    line(windowWidth * this.margin,
    windowHeight * (1 - this.margin), windowWidth * this.margin, windowHeight * this.margin)
    line(windowWidth * this.margin,
    windowHeight * (1 - this.margin), windowWidth * (1 - this.margin), windowHeight * (1 - this.margin))

    strokeWeight(0);

  }

  show_scale = () => {
    text('scale: time ranges from 0 to '
    + str(this.xs),
    + 'population count ranges from 0 to ' + str(this.ys),
    windowWidth * this.margin,
    windowHeight * (1 - this.margin));
  }

  create_parameter_chooser = (params) => {

    var buttons = [];
    var startingX = 10;
    var startingY = 10;
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
      lb.position(currentX + down.width, currentY);
      lb.size(100, 40);
      lb.style('hover', 'blue');
      up.position(currentX + down.width + lb.width, currentY);
      up.size(40, 40);
      currentX += down.width;
      currentY += down.height;


    }


    this.create_start_button();
  }

  get_function_when_parameter_button_pressed = (controller, i, change) => {
    function f() {
      controller.parameter_button_pressed(i, change);
    }
    return f;

  }

  create_start_button = () => {
    this.start_button = createButton('start');
    this.start_button.mousePressed(this.controller.start_button_pressed);
    this.start_button.position(190, 10);
    this.start_button.size(120, 120);
  }

  update_parameter_label = (i, new_value) => {
    this.parameter_labels[i].html(this.param_names[i] + ' = ' + str(new_value));
  }

  restart = () => {
    clear();

    background(220, 220, 250);
    this.show_axes();
    this.set_scale(1, max(1.2 * this.controller.model.start(),
    1.5 * this.controller.model.get_average(1)));
  }

  exit = () => {

    for (let i = 0; i < this.elements.length; i ++) {
      this.elements[i].remove();
    }
    this.elements = [];

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
    var m = new OnePopModel(starting_params);
    this.set_model(m)
    this.viewer.set_scale(1, max(1.2 * this.model.start(),
    1.5 * this.model.get_average(1)));
    this.status = 1;
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
    print(old_value);
    var adjusted_change;
    if (param == 2) {
      if (change > 0) {
        adjusted_change = Math.max(1, Math.ceil(change * old_value / 10.0));
      } else {
        adjusted_change = Math.min(-1, Math.floor(change * old_value / 10.0));
      }

    } else {
      var adjusted_change = change;
    }


    var new_value = old_value + adjusted_change;
    if (new_value < 0) {
      return;
    }
    starting_params[param] = new_value;
    this.viewer.update_parameter_label(param, new_value);





  }

  start_button_pressed = () => {
    if (this.status == 1) {
      noLoop();
      this.viewer.start_button.html('restart');
      this.status = 2;
    } else if (this.status == 0) {
      loop();
      this.viewer.start_button.html('stop');
      this.status = 1;
    } else if (this.status == 2) {
      this.model = new OnePopModel(starting_params);
      this.viewer.start_button.html('stop');
      this.viewer.restart();
      this.status = 1;
      loop();
    }
  }

}




function setup() {

  c = new Controller();
  c.viewer.create_parameter_chooser(c.model.params);
  c.viewer.show_scale();



}

function draw() {
  stroke(120, 120, 120);
  c.viewer.line(c.model.time, c.model.get_average(c.model.time),
  c.model.last_time, c.model.get_average(c.model.last_time))
  stroke(188, 56, 35);
  c.viewer.line(c.model.time, c.model.count, c.model.last_time, c.model.last_count);


  c.model.run(0.005);
  if (c.model.time >= 1) {
    c.viewer.start_button.html('restart');
    c.status = 2;
    noLoop();
  }


}
