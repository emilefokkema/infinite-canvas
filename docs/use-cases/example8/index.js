// Import stylesheets
import './style.css';

// Import InfiniteCanvas
import InfiniteCanvas from 'infinite-canvas';

var canvasElement = document.getElementById("canvas");
var rect = canvasElement.getBoundingClientRect();
canvasElement.width = rect.width;
canvasElement.height = rect.height;
var canvas = new InfiniteCanvas(canvasElement);
var ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.moveToInfinityInDirection(1, 0);
ctx.lineTo(100, 100);
ctx.lineTo(100, 200);
ctx.lineToInfinityInDirection(-1, 0);
ctx.fill(); //does nothing, because the subpath's start and end are opposite each other
ctx.stroke();