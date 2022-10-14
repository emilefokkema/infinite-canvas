function getNext(event){
    return new Promise((res) => {
        const listener = (ev) => {
            res(ev);
            event.removeListener(listener);
        };
        event.addListener(listener)
    });
}
class EventEmitterEvent{
    constructor(eventEmitter, eventName, passive) {
        this.eventEmitter = eventEmitter;
        this.eventName = eventName;
        this.passive = passive;
    }
    addListener(listener){
        if(this.passive === false){
            this.eventEmitter.addEventListener(this.eventName, listener, {passive: false});
        }else{
            this.eventEmitter.addEventListener(this.eventName, listener);
        }
    }
    removeListener(listener){
        this.eventEmitter.removeEventListener(this.eventName, listener);
    }
}
class TransformedEvent{
    constructor(event, listenerTransformer) {
        this.event = event;
        this.listenerTransformer = listenerTransformer;
        this.listeners = [];
    }
    addListener(listener){
        const record = {
            newListener: listener,
            onRemoved: () => {}
        };
        record.oldListener = this.listenerTransformer(listener, onRemoved => record.onRemoved = onRemoved);
        this.listeners.push(record);
        this.event.addListener(record.oldListener);
    }
    removeListener(listener){
        const index = this.listeners.findIndex(r => r.newListener === listener);
        if(index === -1){
            return;
        }
        const [record] = this.listeners.splice(index, 1);
        this.event.removeListener(record.oldListener);
        record.onRemoved();
    }
}
class AsyncResult{
    constructor(promise){
        this.promise = promise;
    }
}
function debounce(event, interval){
    return new TransformedEvent(event, (listener, onRemoved) => {
        let timeoutId = undefined;
        let lastValue = undefined;
        onRemoved(() => {
            if(timeoutId !== undefined){
                clearTimeout(timeoutId);
            }
        });
        return (ev) => {
            lastValue = ev;
            if(timeoutId !== undefined){
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                timeoutId = undefined;
                listener(lastValue);
            }, interval);
        };
    });
}
function notDebounce(event, interval){
    return new TransformedEvent(event, (listener, onRemoved) => {
        let timeoutId = undefined;
        function schedule(){
            if(timeoutId !== undefined){
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                timeoutId = undefined;
                listener();
                schedule();
            }, interval);
        }
        onRemoved(() => {
            if(timeoutId !== undefined){
                clearTimeout(timeoutId);
            }
        });
        schedule();
        return (ev) => {
            schedule();
        };
    })
}

export function waitForNextDebouncedScrollEvent(interval){
    let scrollEvent = new EventEmitterEvent(window, 'scroll');
    scrollEvent = debounce(scrollEvent, interval);
    return new AsyncResult(getNext(scrollEvent));
}
export function getConfig(searchParams){
    const greedyGestureHandling = searchParams.get('greedyGestureHandling') === 'true';

    const rotationEnabled = searchParams.has('rotationEnabled') 
        ? searchParams.get('rotationEnabled') === 'true'
        : true;
    
    const units = searchParams.get('units') === 'css' ? InfiniteCanvas.CSS_UNITS : InfiniteCanvas.CANVAS_UNITS;

    return {greedyGestureHandling, rotationEnabled, units};
}
export class TestCanvas{
    constructor(canvasEl, config){
        this.infCanvas = new InfiniteCanvas(canvasEl, config);
        this.ctx = this.infCanvas.getContext('2d');
        this.drawn = new EventEmitterEvent(this.infCanvas, 'draw');
    }
    waitForDebouncedDrawing(interval){
        return new AsyncResult(getNext(debounce(this.drawn, interval)));
    }
    whenNotDrawnFor(interval){
        return new AsyncResult(getNext(notDebounce(this.drawn, interval)))
    }
    waitForDrawing(){
        return new AsyncResult(getNext(this.drawn));
    }
    executeCode(fn){
        const p = getNext(this.drawn);
        fn(this.ctx);
        return p;
    }
}
