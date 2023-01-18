import './style.css'
import InfiniteCanvas from 'infinite-canvas'

var canvasEl = document.getElementById("canvas");
var infCanvas = new InfiniteCanvas(canvasEl, {greedyGestureHandling: true, units: InfiniteCanvas.CSS_UNITS});
var ctx = infCanvas.getContext();
canvasEl.width = 1200;
canvasEl.height = 1200;
var cursorClassMap = {
    auto: 'cursor-auto',
    grab: 'cursor-grab',
    grabbing: 'cursor-grabbing'
};
function setCanvasCursor(cursor){
    canvasEl.setAttribute('class','')
    if(!cursor){
        return;
    }
    canvasEl.classList.add(cursorClassMap[cursor]);
}
class SceneElement{
    constructor(){
        this.mousePresent = false;
        this._onMouseEnter = () => {};
        this._onMouseLeave = () => {};
        this._onMouseDown = () => {};
        this._onMouseMove = () => {};
        this._onMouseUp = () => {};
        this.cursor = 'auto';
    }
    set onMouseEnter(value){
        this._onMouseEnter = value;
    }
    set onMouseUp(value){
        this._onMouseUp = value;
    }
    set onMouseLeave(value){
        this._onMouseLeave = value;
    }
    set onMouseMove(value){
        this._onMouseMove = value;
    }
    set onMouseDown(value){
        this._onMouseDown = value;
    }
    setMousePresent(mousePresent){
        if(mousePresent && !this.mousePresent){
            this._onMouseEnter();
        }else if(!mousePresent && this.mousePresent){
            this._onMouseLeave();
        }
        this.mousePresent = mousePresent;
    }
    mouseUp(ev){
        if(ev.capturedByElement || !this.isHitBy(ev.x,ev.y)){
            return;
        }
        ev.capturedByElement = this;
        this._onMouseUp();
    }
    mouseDown(ev){
        if(ev.capturedByElement || !this.isHitBy(ev.x,ev.y)){
            return;
        }
        ev.capturedByElement = this;
        this._onMouseDown(ev);
    }
    mouseMove(ev){
        if(ev.capturedByElement || !this.isHitBy(ev.x,ev.y)){
            return this.setMousePresent(false);
        }
        ev.capturedByElement = this;
        this.setMousePresent(true);
        this._onMouseMove(ev);
    }
}
class Rectangle extends SceneElement{
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.lineWidth = 1;
        this.color = '#000';
    }
    isHitBy(x, y){
        const halfLineWidth = this.lineWidth / 2;
        return x > this.x - halfLineWidth && x < this.x + this.width + halfLineWidth &&
            y > this.y - halfLineWidth && y < this.y + this.height + halfLineWidth &&
            !(x > this.x + halfLineWidth && x < this.x + this.width - halfLineWidth &&
                y > this.y + halfLineWidth && y < this.y + this.height - halfLineWidth);
    }
    draw(ctx){
      ctx.save();
      ctx.lineWidth = this.lineWidth;
      ctx.strokeStyle = this.color;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.restore();
    }
}
class Handle extends SceneElement{
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.color = '#f00';
    }
    isHitBy(x, y){
        const dx = x - this.x;
        const dy = y - this.y;
        return dx * dx + dy * dy < this.radius * this.radius;
    }
    draw(ctx){
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(`(${this.x},${this.y})`, this.x + 5, this.y);
        ctx.restore();
    }
}
class Scene{
    constructor() {
        this.draggingHandlePoint = undefined;
        this._onStateChange = () => {};
        this.originX = 20;
        this.originY = 20;
        this.handleX = 220;
        this.handleY = 320;
        this.mouseSceneElement = null;
        this.rectangle = new Rectangle(this.originX, this.originY, this.handleX - this.originX, this.handleY - this.originY);
        this.rectangle.onMouseEnter = () => {
            this.rectangle.color = '#aaa';
            this.emitState();
        };
        this.rectangle.onMouseLeave = () => {
            this.rectangle.color = '#000';
            this.emitState();
        };
        this.handle = new Handle(this.handleX, this.handleY);
        this.handle.onMouseEnter = () => {
            this.handle.color = '#f99';
            this.handle.cursor = 'grab';
            this.emitState();
        };
        this.handle.onMouseDown = (ev) => {
            this.draggingHandlePoint = {x: ev.x, y: ev.y};
            this.handle.cursor = 'grabbing';
            ev.preventDefault();
            this.emitState();
        };
        this.handle.onMouseMove = (ev) => {
            if(this.draggingHandlePoint){
                this.moveHandleToPoint(ev.x, ev.y);
                this.emitState();
            }
        };
        this.handle.onMouseUp = () => {
            this.draggingHandlePoint = undefined;
            this.handle.cursor = 'grab';
            this.emitState();
        };
        this.handle.onMouseLeave = () => {
            this.handle.color = '#f00';
            this.handle.cursor = 'auto';
            this.draggingHandlePoint = undefined;
            this.emitState();
        }
    }
    set onStateChange(value){
        this._onStateChange = value;
    }
    emitState(){
        setTimeout(() => {
            const newState = {cursor: this.mouseSceneElement ? this.mouseSceneElement.cursor : undefined};
            this._onStateChange(newState);
        }, 0)
    }
    moveHandleToPoint(x, y){
        const dx = x - this.draggingHandlePoint.x;
        const dy = y - this.draggingHandlePoint.y;
        this.draggingHandlePoint = {x, y};
        this.handleX += dx;
        this.handleY += dy;
        this.handle.x = this.handleX;
        this.handle.y = this.handleY;
        this.rectangle.width = this.handleX - this.originX;
        this.rectangle.height = this.handleY - this.originY;
    }
    mouseDown(x, y, preventDefault){
        const ev = {x, y, capturedByElement: null, preventDefault: () => preventDefault()};
        this.handle.mouseDown(ev);
        this.rectangle.mouseDown(ev);
        this.mouseSceneElement = ev.capturedByElement;
    }
    mouseUp(x, y){
        const ev = {x, y, capturedByElement: null};
        this.handle.mouseUp(ev);
        this.rectangle.mouseUp(ev);
        this.mouseSceneElement = ev.capturedByElement;
    }
    mouseMove(x, y){
        const ev = {x, y, capturedByElement: null};
        this.handle.mouseMove(ev);
        this.rectangle.mouseMove(ev);
        this.mouseSceneElement = ev.capturedByElement;
    }
    draw(ctx){
        ctx.clearRect(-Infinity, -Infinity, Infinity, Infinity);
        this.rectangle.draw(ctx);
        this.handle.draw(ctx);
    }
}
var scene = new Scene();
scene.onStateChange = (st) => {
    scene.draw(ctx)
    setCanvasCursor(st.cursor);
};
scene.draw(ctx);

var touchIdentifier = undefined;
infCanvas.addEventListener('mousemove', (ev) => {
    const {offsetX: x, offsetY: y} = ev;
    scene.mouseMove(x, y);
});
infCanvas.addEventListener('mousedown', (ev) => {
    const {offsetX: x, offsetY: y} = ev;
    scene.mouseDown(x, y, () => ev.preventDefault());
});
infCanvas.addEventListener('mouseup', (ev) => {
    const {offsetX: x, offsetY: y} = ev;
    scene.mouseUp(x, y)
});
infCanvas.addEventListener('touchmove', ev => {
    if(touchIdentifier === undefined){
        return;
    }
    for(let i = 0; i < ev.changedTouches.length; i++){
        const changedTouch = ev.changedTouches[i];
        if(changedTouch.identifier !== touchIdentifier){
            continue;
        }
        const {infiniteCanvasX: x, infiniteCanvasY: y} = changedTouch;
        scene.mouseMove(x, y);
        break;
    }
});
infCanvas.addEventListener('touchstart', ev => {
    if(touchIdentifier !== undefined){
        return;
    }
    const touch = ev.changedTouches[0];
    const {infiniteCanvasX: x, infiniteCanvasY: y} = touch;
    touchIdentifier = touch.identifier;
    scene.mouseDown(x, y, () => ev.preventDefault(true));
});
infCanvas.addEventListener('touchend', ev => {
    if(touchIdentifier === undefined){
        return;
    }
    for(let i = 0; i < ev.changedTouches.length; i++){
        const changedTouch = ev.changedTouches[i];
        if(changedTouch.identifier !== touchIdentifier){
            continue;
        }
        const {infiniteCanvasX: x, infiniteCanvasY: y} = changedTouch;
        scene.mouseUp(x, y);
        touchIdentifier = undefined;
        break;
    }
});
