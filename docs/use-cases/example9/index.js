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

ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
ctx.beginPath();
ctx.moveToInfinityInDirection(1, 0); //to the right
ctx.lineToInfinityInDirection(0, 1); //downwards
ctx.lineToInfinityInDirection(-1, -1); //left and up
ctx.fill(); //fills the entire plane
ctx.lineTo(200, 200); //reduces the area spanned by the path
ctx.fill();
ctx.stroke();