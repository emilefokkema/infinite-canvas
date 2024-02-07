import InfiniteCanvas from 'ef-infinite-canvas';
import './index.css';

const infCanvas = new InfiniteCanvas(document.getElementById('canvas'))
const ctx = infCanvas.getContext('2d')

ctx.fillStyle = '#00009966'; // blue
ctx.fillRect(30, 30, 30, -Infinity) // A rectangle that extends upwards indefinitely

ctx.fillStyle = '#99000066'; // red
ctx.fillRect(60, 60, -Infinity, 30) // A rectangle that extends to the left indefinitely

ctx.fillStyle = '#00990066'; // green
ctx.fillRect(90, 60, Infinity, 30) // A rectangle that extends to the right indefinitely

ctx.fillStyle = '#99990066'; // yellow
ctx.fillRect(30, 120, 30, Infinity) // A rectangle that extends downwards indefinitely

ctx.fillStyle = '#99009966'; // magenta
ctx.fillRect(-Infinity, 150, Infinity, 30) // A rectangle that extends both left and right indefinitely

ctx.fillStyle = '#00999966'; // cyan
ctx.fillRect(120, -Infinity, 30, Infinity) // A rectangle that extends both upwards and downwards indefinitely