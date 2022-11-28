// Import stylesheets
import './style.css';

// Import InfiniteCanvas
import InfiniteCanvas from 'infinite-canvas';

// Write Javascript code!
const canvasEl = document.getElementById('canvas');
const infCanvas = new InfiniteCanvas(canvasEl);
infCanvas.greedyGestureHandling = true;
const ctx = infCanvas.getContext();

// Fill the entire canvas
ctx.fillStyle = '#cce'
ctx.fillRect(-Infinity, -Infinity, Infinity, Infinity)

// Draw an infinitely long red line
ctx.strokeStyle = '#f00';
ctx.lineWidth = 5;
ctx.beginPath();
ctx.moveToInfinityInDirection(1, 0);
ctx.lineTo(20, 20);
ctx.lineToInfinityInDirection(-1, 0);
ctx.stroke();

// Draw a regular rectangle
ctx.fillStyle = '#000'
ctx.fillRect(40, 40, 50, 50);
