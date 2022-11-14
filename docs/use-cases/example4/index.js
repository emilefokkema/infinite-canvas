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

ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(100, 100);
ctx.lineTo(200, 100);
ctx.lineToInfinityInDirection(1, 1);
ctx.stroke();

ctx.fillStyle = "#00f";
ctx.font = "12px Verdana";
ctx.beginPath();
ctx.arc(100, 100, 5, 0, 2 * Math.PI);
ctx.fill();
ctx.fillText("from here", 60, 90)

ctx.beginPath();
ctx.arc(200, 100, 5, 0, 2 * Math.PI);
ctx.fill();
ctx.fillText("to here", 180, 90);

ctx.strokeStyle = "#00f";
ctx.beginPath();
ctx.moveTo(300, 150);
ctx.lineTo(400, 250);
ctx.lineTo(400, 235);
ctx.moveTo(400, 250);
ctx.lineTo(385, 250);
ctx.stroke();
ctx.fillText("extending to infinity", 370, 200);