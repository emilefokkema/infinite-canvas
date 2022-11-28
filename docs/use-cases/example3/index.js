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

ctx.font = "15px Verdana";
var hue = 0;
function drawRect(x, y, w, h){
    ctx.save();
    ctx.fillStyle = "hsl("+hue+",50%,50%,0.3)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "hsl("+hue+",50%,50%,1)";
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
    hue += 43;
}

ctx.fillStyle = "#000";
ctx.fillRect(-Infinity, -Infinity, Infinity, Infinity);
ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
ctx.fillText("no edge", 325, 400);

drawRect(-Infinity, 100, Infinity, -Infinity);
ctx.fillText("only a bottom", 350, 80);

drawRect(50, -Infinity, -Infinity, Infinity);
ctx.save();
ctx.translate(0, 600);
ctx.transform(0, -1, 1, 0, 0, 0);
ctx.fillText("only a right edge", 150, 30);
ctx.restore();

drawRect(550, -Infinity, Infinity, Infinity);
ctx.save();
ctx.translate(600, 0);
ctx.transform(0, 1, -1, 0, 0, 0);
ctx.fillText("only a left edge", 300, 30);
ctx.restore();

drawRect(-Infinity, 500, Infinity, Infinity);
ctx.fillText("only a top", 350, 530);

drawRect(250, 50, -Infinity, -Infinity);
ctx.fillText("only a bottom-right corner", 10, 30);

drawRect(350, 550, Infinity, Infinity);
ctx.fillText("only a top-left corner", 380, 580);

drawRect(250, 550, -Infinity, Infinity);
ctx.fillText("only a top-right corner", 60, 580);

drawRect(350, 50, Infinity, -Infinity);
ctx.fillText("only a bottom-left corner", 370, 30);

drawRect(-Infinity, 150, Infinity, 100);
ctx.fillText("only a top and a bottom", 350, 180);

drawRect(200, -Infinity, 100, Infinity);
ctx.save();
ctx.translate(280, 280);
ctx.transform(0, 1, -1, 0, 0, 0);
ctx.fillText("only a left and a right edge", 0, 0);
ctx.restore();

drawRect(150, 75, -Infinity, 100);
ctx.fillText("no left edge", 10, 130);

drawRect(450, 425, Infinity, 100);
ctx.fillText("no right edge", 480, 480);

drawRect(325, 350, 100, -Infinity);
ctx.fillText("no top", 350, 325);

drawRect(75, 300, 100, Infinity);
ctx.fillText("no bottom", 85, 350);

