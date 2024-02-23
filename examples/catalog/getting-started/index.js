import InfiniteCanvas from 'ef-infinite-canvas';
import './index.css'

// assuming there is a <canvas> element that has id 'canvas'
const infCanvas = new InfiniteCanvas(document.getElementById('canvas'))

// get the CanvasRenderingContext2D
const ctx = infCanvas.getContext('2d');

ctx.fillStyle = '#f00';
ctx.lineWidth = 4;
ctx.beginPath();
ctx.rect(30, 30, Infinity, 30);
ctx.fill();
ctx.stroke();