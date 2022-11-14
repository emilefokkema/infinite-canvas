// Import stylesheets
import './style.css';

// Import InfiniteCanvas
import InfiniteCanvas from 'infinite-canvas';

var canvasElement = document.getElementById("canvas");
var rect = canvasElement.getBoundingClientRect();
canvasElement.width = rect.width * devicePixelRatio;
canvasElement.height = rect.height * devicePixelRatio;
var canvas = new InfiniteCanvas(canvasElement);
var ctx = canvas.getContext("2d");

ctx.fillStyle = '#DD4A68';
ctx.beginPath();
ctx.moveTo(60, 60);
ctx.lineToInfinityInDirection(1, 1);
ctx.lineToInfinityInDirection(-1, 1);
ctx.fill();
ctx.stroke();