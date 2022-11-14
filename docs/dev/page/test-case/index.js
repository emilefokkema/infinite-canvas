import './style.css';
import testCase from './test-case.js';
import InfiniteCanvas from './infinite-canvas.js';

document.getElementById('title').innerText = testCase.title;

const regularCanvas = document.getElementById('regular');
const infiniteCanvas = document.getElementById('infinite');

setWidthAndHeight(regularCanvas)
setWidthAndHeight(infiniteCanvas)

executeCode(regularCanvas, testCase.finiteCode || testCase.code);
executeCode(new InfiniteCanvas(infiniteCanvas, {greedyGestureHandling: true}), testCase.code)

function executeCode(canvas, code){
    code(canvas.getContext('2d'));
}

function setWidthAndHeight(canvasEl){
    canvasEl.width = 400;
    canvasEl.height = 400;
}