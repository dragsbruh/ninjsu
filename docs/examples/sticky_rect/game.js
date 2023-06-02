// Author's Note:
// In this case, the game starts when the button is clicked.

// DOM elements
var para = document.getElementById('joes-para');
var startbtn = document.getElementById('joes-startbtn');

// Hide the game message initially
para.style.display = 'none';

// Game variables
var display;
var black = new nin.Color(0, 0, 0, 1, false); // Optimization tip: Use is8bit=false to give a 0.00000001% performance boost
var white = new nin.Color(1, 1, 1, 1, false);
var myrect;
var follow = false; // To store if rect should follow mouse or not
var leftMouse = false; // To store if left mouse button is clicked or not
const gravity = 1; // Gravitational pull
var yvel; // YVelocity of the rect
var tvel; // Terminal Velocity of the rect

// Start the game
function start() {
  yvel = 0;
  tvel = 10;
  para.style.display = 'block';
  startbtn.style.display = 'none';
  display = new nin.Display('gamecanvas');
  myrect = new nin.Rect(100, 0, 100, 100); // (x, y, width, height)
  nin.mouse.enable_mouse(display); // Enable mouse events
  update();
}

// Game update loop
function update() {
  // Apply gravity and handle terminal velocity
  if (yvel > tvel) {
    yvel = tvel - 1; // terminal velocity reached
  } else {
    yvel += gravity;
  }

  // Fill the canvas with white color and draw the rectangle
  display.fill(white, myrect);

  // Check if rectangle should follow the mouse
  if (follow) {
    myrect.center = nin.mouse.pos; // Returns mouse coordinates (relative to canvas) (x, y)
  }

  // Check if left mouse button is pressed
  leftMouse = nin.mouse.pressed[0]; // Returns a list of pressed keys [LEFT, MIDDLE, RIGHT]

  // Check for collision with the rectangle and handle cursor and movement
  if (myrect.collidepoint(nin.mouse.pos)) {
    if (leftMouse) {
      // Collision detected
      follow = true;
      document.body.style.cursor = "grab";
      yvel = 0;
    } else {
      document.body.style.cursor = "pointer";
      follow = false;
    }
  } else {
    document.body.style.cursor = "auto";
    follow = false;
  }

  // Update rectangle position based on velocity and request next frame
  myrect.y += yvel;
  requestAnimationFrame(update);
}
