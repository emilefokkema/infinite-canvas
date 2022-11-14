// Import stylesheets
import './style.css';

// Import InfiniteCanvas
import InfiniteCanvas from 'ef-infinite-canvas';

var canvasElement = document.getElementById('canvas');
var rect = canvasElement.getBoundingClientRect();
canvasElement.width = rect.width * devicePixelRatio;
canvasElement.height = rect.height * devicePixelRatio;
var canvas = new InfiniteCanvas(canvasElement, {
  units: InfiniteCanvas.CSS_UNITS,
});
var ctx = canvas.getContext('2d');

ctx.fillStyle = '#DD4A68';

let secondDirectionAngle = 1;

function draw() {
  ctx.clearRect(-Infinity, -Infinity, Infinity, Infinity);
  ctx.beginPath();
  ctx.moveToInfinityInDirection(-1, 0);
  ctx.lineTo(100, 200);
  ctx.lineTo(100, 100);
  const angle = (secondDirectionAngle * Math.PI) / 20;
  if (secondDirectionAngle === 0) {
    ctx.lineToInfinityInDirection(1, 0);
  } else if (secondDirectionAngle === 20) {
    ctx.lineToInfinityInDirection(-1, 0);
  } else if (secondDirectionAngle > 20 && secondDirectionAngle < 40) {
    ctx.lineTo(100 + 150 / Math.tan(-angle), 50);
  } else {
    ctx.lineTo(100 + 150 / Math.tan(angle), 250);
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

document.getElementById('upbutton').addEventListener('click', () => {
  secondDirectionAngle -= 1;
  if (secondDirectionAngle < 0) {
    secondDirectionAngle += 40;
  }
  console.log(secondDirectionAngle);
  draw();
});

document.getElementById('downbutton').addEventListener('click', () => {
  secondDirectionAngle += 1;
  if (secondDirectionAngle >= 40) {
    secondDirectionAngle -= 40;
  }
  console.log(secondDirectionAngle);
  draw();
});

draw();
