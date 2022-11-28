import './style.css'
import InfiniteCanvas from 'infinite-canvas'

function getMarkings(start, length){
    function* getMarkings(stepSize){
        var firstStep = stepSize * Math.ceil(start / stepSize);
        for(let loc = firstStep; loc <= start + length; loc += stepSize){
            yield loc;
        }
    }
    var stepSize = Math.pow(10, Math.floor(Math.log(length) / Math.log(10) - 0.1));

    function* getMainMarkings(){
        yield* getMarkings(stepSize);
    }
    function* getSubMarkings(){
        yield* getMarkings(stepSize / 10);
    }
    return {getMainMarkings, getSubMarkings};
}
var leftGutter = (function(){
    var width = 40;
    var topOffset = 20;
    var canvas = document.getElementById("left-gutter");
    canvas.width = width;
    var ctx = canvas.getContext("2d");
    var gradient = ctx.createLinearGradient(0, 0, 40, 0);
    gradient.addColorStop(0, '#eee');
    gradient.addColorStop(1, '#bbb');
    function drawMarkedTick(location, inverseTransformation){
        var transformedLocation = location * inverseTransformation.d + inverseTransformation.f - topOffset;
        ctx.fillStyle = '#000';
        ctx.fillRect(25, transformedLocation, 15, 1);
        ctx.fillText(location, 10, transformedLocation);
    }
    function drawSubTick(location, inverseTransformation){
        var transformedLocation = location * inverseTransformation.d + inverseTransformation.f - topOffset;
        ctx.fillStyle = '#000';
        ctx.fillRect(35, transformedLocation, 5, 1);
    }
    function drawWithHeightAndTransformation(height, transformation, inverseTransformation){
        height = height - topOffset;
        canvas.height = height;
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        var topCoordinate = topOffset * transformation.d + transformation.f;
        var distance = height * transformation.d;
        var markings = getMarkings(topCoordinate, distance);
        for(let loc of markings.getMainMarkings()){
            drawMarkedTick(loc, inverseTransformation);
        }
        for(let loc of markings.getSubMarkings()){
            drawSubTick(loc, inverseTransformation);
        }
    }
    return {drawWithHeightAndTransformation};
})()
var topGutter = (function(){
    var height = 20;
    var canvas = document.getElementById("top-gutter");
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    var gradient = ctx.createLinearGradient(0, 0, 0, 20);
    gradient.addColorStop(0, '#eee');
    gradient.addColorStop(1, '#bbb');
    function drawMarkedTick(location, inverseTransformation){
        var transformedLocation = location * inverseTransformation.a + inverseTransformation.e;
        ctx.fillStyle = '#000';
        ctx.fillRect(transformedLocation, 10, 1, 10);
        ctx.fillText(location, transformedLocation - 10, 8)
    }
    function drawSubTick(location, inverseTransformation){
        var transformedLocation = location * inverseTransformation.a + inverseTransformation.e;
        ctx.fillStyle = '#000';
        ctx.fillRect(transformedLocation, 15, 1, 5);
    }
    function drawWithWidthAndTransformation(width, transformation, inverseTransformation){
        canvas.width = width;
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        var leftCoordinate = transformation.e;
        var distance = width * transformation.a;
        var markings = getMarkings(leftCoordinate, distance);
        for(let loc of markings.getMainMarkings()){
            drawMarkedTick(loc, inverseTransformation);
        }
        for(let loc of markings.getSubMarkings()){
            drawSubTick(loc, inverseTransformation);
        }
    }
    return {drawWithWidthAndTransformation};
})();
var canvasEl = document.getElementById("canvas");
canvasEl.width = 1200;
canvasEl.height = 1200;
var infCanvas = new InfiniteCanvas(canvasEl, {greedyGestureHandling: true, rotationEnabled: false, units: InfiniteCanvas.CSS_UNITS});
var ctx = infCanvas.getContext();
infCanvas.addEventListener("draw", (ev) => {
    var rect = canvasEl.getBoundingClientRect();
    topGutter.drawWithWidthAndTransformation(rect.width, ev.transformation, ev.inverseTransformation);
    leftGutter.drawWithHeightAndTransformation(rect.height, ev.transformation, ev.inverseTransformation);
});
function drawDot(x, y){
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillText(`(${x}, ${y})`, x - 5, y - 5);
}
drawDot(0, 0)
drawDot(200, 0)
drawDot(0, 200)
ctx.fillStyle = '#aaa';
ctx.rotate(Math.PI / 8)
ctx.fillRect(50, 50, Infinity, 100);
ctx.strokeRect(50, 50, Infinity, 100);
ctx.fillStyle = '#faa';
ctx.translate(100, 50);
ctx.rotate(Math.PI / 8);
ctx.fillRect(-50, -100, Infinity, 100);
ctx.strokeRect(-50, -100, Infinity, 100);