import InfiniteCanvas from 'ef-infinite-canvas';

let registry;
let port;
const initializedMessageType = 'EXAMPLE_INFINITE_CANVAS_INITIALIZED';

function sendMessageToParent(message, portMessageHandler){
    if(port){
        port.postMessage(message)
        return;
    }
    const parent = window.parent;
    if(!parent){
        return;
    }
    const channel = new MessageChannel();
    port = channel.port2;
    port.onmessage = portMessageHandler;
    parent.postMessage(message, location.origin, [channel.port1]);
}
class InfiniteCanvasRegistry{
    constructor(){
        this.latestId = 0;
        this.infiniteCanvases = {};
    }
    registerInfiniteCanvas(infCanvas){
        const id = this.latestId++;
        this.infiniteCanvases[id] = infCanvas;
        sendMessageToParent(
            {type: initializedMessageType, id},
            (e) => this.handleMessageFromPort(e))
    }
    handleMessageFromPort(e){
        const data = e.data;
        if(data.type === 'DISABLE_GREEDY_GESTURE_HANDLING'){
            const id = data.id;
            const infCanvas = this.infiniteCanvases[id];
            infCanvas.greedyGestureHandling = false;
            infCanvas.addEventListener('wheelignored', (e) => {
                e.preventDefault();
                sendMessageToParent({type: 'WHEEL_IGNORED', id})
            })
            infCanvas.addEventListener('touchignored', (e) => {
                e.preventDefault();
                sendMessageToParent({type: 'TOUCH_IGNORED', id})
            })
        }
    }
}

function initialize(){
    registry = new InfiniteCanvasRegistry();
}

initialize();

export default class extends InfiniteCanvas{
    constructor(canvasEl){
        super(canvasEl, {units: InfiniteCanvas.CSS_UNITS, greedyGestureHandling: true});
        const { width, height } = canvasEl.getBoundingClientRect();
        canvasEl.width = width * devicePixelRatio;
        canvasEl.height = height * devicePixelRatio;
        if(registry){
            registry.registerInfiniteCanvas(this);
        }
    }
}