window.addEventListener('DOMContentLoaded', start);

var display;
var player;


class Player {
  // Your custom player class
  constructor(x, y) {
    this.rect = new nin.Rect(x, y, 64, 64);
    this.color = new nin.Color(1, 1, 1, 1, false);
  }
  update() {
    // Basic keyboard usage
    if (nin.key.ispressed('ARROWUP') | nin.key.ispressed('W')) {
      this.rect.y -= 10;
    }
    if (nin.key.ispressed('ARROWDOWN') | nin.key.ispressed('S')) {
      this.rect.y += 10;
    }
    if (nin.key.ispressed('ARROWLEFT') | nin.key.ispressed('A')) {
      this.rect.x -= 10;
    }
    if (nin.key.ispressed('ARROWRIGHT') | nin.key.ispressed('D')) {
      this.rect.x += 10;
    }
  }
  render(display) {
    display.fill(this.color, this.rect)
  }
}

function start() {
  // Your initialisation code here
  // This function is called when the game starts
  display = new nin.Display('gamecanvas');
  player = new Player(100, 100);

  // Enables keyboard globally - registers keyboard inputs across the page
  nin.key.enable();

  update();
}

function update() {
  // Your game code here
  // This function is called once per frame

  player.update();
  player.render(display);

  requestAnimationFrame(update);
}