import InfiniteCanvas from './example-infinite-canvas.js';
import './index.css';

const infCanvas = new InfiniteCanvas(document.getElementById('canvas'))
const ctx = infCanvas.getContext('2d');

ctx.lineWidth = 3;

ctx.strokeStyle = '#090';
ctx.fillStyle = '#00990044';

ctx.beginPath(); // begin the green path
ctx.moveTo(10, 10);
ctx.lineTo(10, 110);
ctx.lineTo(110, 110);

ctx.fill(); // fill the green path, which has only finite lines
ctx.stroke();

ctx.strokeStyle = '#900';
ctx.fillStyle = '#99000044';

ctx.beginPath(); // begin the red path
ctx.moveTo(10, 140);
ctx.lineTo(10, 240);
ctx.lineToInfinityInDirection(1, 0);

ctx.fill(); // fill the red path, which contains a line to infinity
ctx.stroke();
