// Import stylesheets
import './style.css';
import './overlay.css';

// Import InfiniteCanvas
import InfiniteCanvas from 'infinite-canvas';
import Overlay from './overlay.js'

var canvasElement = document.getElementById("canvas");
var rect = canvasElement.getBoundingClientRect();
canvasElement.width = rect.width * devicePixelRatio;
canvasElement.height = rect.height * devicePixelRatio;
var canvas = new InfiniteCanvas(canvasElement);
new Overlay(document.getElementById('overlay'), canvas)
var ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.moveTo(30, 30);
ctx.lineToInfinityInDirection(1, 1);
ctx.stroke();