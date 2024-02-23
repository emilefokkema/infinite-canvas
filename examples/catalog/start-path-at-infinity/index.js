import InfiniteCanvas from 'ef-infinite-canvas';
import './index.css';

const infCanvas = new InfiniteCanvas(document.getElementById('canvas'))
const ctx = infCanvas.getContext('2d');

ctx.lineWidth = 3;

ctx.strokeStyle = '#0f0';
ctx.beginPath();
ctx.moveTo(150, 50); // starting point of the green path
ctx.lineTo(50, 50); // end point of the green path
ctx.stroke();

ctx.strokeStyle = '#f00'
ctx.beginPath();
ctx.moveToInfinityInDirection(1, 0); // starting "point" of the red path
ctx.lineTo(50, 150); // end point of the red path
ctx.stroke();