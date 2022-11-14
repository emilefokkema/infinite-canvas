// Import stylesheets
import './style.css';

// Import InfiniteCanvas
import InfiniteCanvas from 'infinite-canvas';

var canvasElement = document.getElementById("canvas");
var rect = canvasElement.getBoundingClientRect();
canvasElement.width = rect.width * devicePixelRatio;
canvasElement.height = rect.height * devicePixelRatio;
var canvas = new InfiniteCanvas(canvasElement, {units: InfiniteCanvas.CSS_UNITS});
var ctx = canvas.getContext("2d");

// Set line width
ctx.lineWidth = 10;

ctx.save();
ctx.translate(150, 10000);

// Universe
var gradient = ctx.createRadialGradient(0, 0, 9500, 0, 0, 20000);
gradient.addColorStop(0, '#dcddfa');
gradient.addColorStop(0.1, '#7276fc');
gradient.addColorStop(0.5, '#262bd1');
gradient.addColorStop(1, '#000');
ctx.fillStyle = gradient;
ctx.fillRect(-Infinity, -Infinity, Infinity, Infinity)

// Earth
ctx.fillStyle = '#075e01';
ctx.beginPath();
ctx.arc(0, 0, 9750, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();

ctx.restore();

// Wall
ctx.fillStyle = '#a8634a'
ctx.fillRect(75, 140, 150, 110)
ctx.strokeRect(75, 140, 150, 110);

// Door
ctx.save();
ctx.fillStyle = '#000'
ctx.fillRect(130, 190, 40, 60);
ctx.restore();

// Roof
ctx.beginPath();
ctx.moveTo(50, 140);
ctx.lineTo(150, 60);
ctx.lineTo(250, 140);
ctx.closePath();
ctx.fill();
ctx.stroke();

// Laser beam
ctx.save();
ctx.fillStyle = '#000'
ctx.translate(200, 100)
ctx.rotate(-Math.PI / 4)
ctx.fillRect(0, 0, 30, 10)
ctx.beginPath();
ctx.arc(80, 5, 50, 3 * Math.PI / 4, 5 * Math.PI / 4)
ctx.stroke()
ctx.beginPath();
ctx.moveTo(30, 0)
ctx.lineTo(60, 4)
ctx.lineTo(60, 6)
ctx.lineTo(30, 10)
ctx.fill()
ctx.fillStyle = '#f00';
ctx.beginPath();
ctx.moveToInfinityInDirection(1, 0)
ctx.lineTo(60, 4)
ctx.lineTo(60, 6)
ctx.fill()
ctx.restore()

// Crack
ctx.fillStyle = '#f00';
ctx.translate(103.55609, 103.55609);
ctx.scale(0.01, 0.01);
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(5, 1);
ctx.lineTo(3, 2);
ctx.lineTo(9, 5);
ctx.stroke();
ctx.beginPath();
ctx.moveTo(6, 3.5);
ctx.lineTo(6.5, 8);
ctx.stroke();