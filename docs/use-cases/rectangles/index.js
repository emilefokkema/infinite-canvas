// Import stylesheets
import './style.css';

// Import InfiniteCanvas
import InfiniteCanvas from 'infinite-canvas';

var canvasElement = document.getElementById('canvas');
var rect = canvasElement.getBoundingClientRect();
canvasElement.width = rect.width * devicePixelRatio;
canvasElement.height = rect.height * devicePixelRatio;
var canvas = new InfiniteCanvas(canvasElement, {
  units: InfiniteCanvas.CSS_UNITS,
});
var ctx = canvas.getContext('2d');

ctx.fillStyle = '#DD4A68';

let x = 40,
  y = 40,
  width = 40,
  height = 40;

function draw() {
  ctx.clearRect(-Infinity, -Infinity, Infinity, Infinity);
  ctx.fillRect(x, y, width, height);
  ctx.strokeRect(x, y, width, height);
}

draw();

document.addEventListener(
  'input',
  (e) => {
    const target = e.target;
    if (
      !target ||
      typeof target.matches !== 'function' ||
      !target.matches('.selector .option input')
    ) {
      return;
    }
    eval(`${target.name} = ${target.value}`);
    draw();
    //console.log('input!', target.value, target.name)
  },
  true
);
