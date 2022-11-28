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

//draw infinitely wide rectangle
ctx.fillRect(50, 50, Infinity, 30);