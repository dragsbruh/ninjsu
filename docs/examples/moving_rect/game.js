window.addEventListener('DOMContentLoaded', start);

var display;

var black = new nin.Color(0, 0, 0, 1, false); // Optimization tip: Use is8bit=false to give a 0.00000001% performance boost
var white = new nin.Color(1, 1, 1, 1, false);

var myrect;

function reset_rect() {
	myrect.x = 0;
}

function start() {
	display = new nin.Display('gamecanvas');
	myrect = new nin.Rect(0, 100, 100, 100); // (x, y, width, height)
	update();
}

function update() {
	myrect.x += 5;
	display.fill(white, myrect);
	requestAnimationFrame(update);
}