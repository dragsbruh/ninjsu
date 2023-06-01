window.addEventListener('DOMContentLoaded', start);

var display;

var black = new nin.Color(0, 0, 0, 1, false); // Optimization tip: Use is8bit=false to give a 0.00000001% performance boost
var blue = new nin.Color(20, 20, 255, 255, true);
var red = new nin.Color(255, 20, 20, 255, true);
var yellow = new nin.Color(1, 1, 0, 1, false);
// var mycolor = new nin.Color(r, g, b, a, is8bit); // is8bit represents if the color is 8bit or not

var colors = [black, blue, red, yellow];
var color = 0;

function swap_colors() {
	color++;
	if (color > colors.length-1) {
		color = 0;
	}
}

function start() {
	display = new nin.Display('gamecanvas');
	display.fill(colors[color]);
	setInterval(() => {
		swap_colors();
	}, 1000);
	update();
}

function update() {
	display.fill(colors[color]);
	requestAnimationFrame(update);
}