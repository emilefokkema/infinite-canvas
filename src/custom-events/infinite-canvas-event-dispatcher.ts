import { InfiniteCanvasEventMap } from "./infinite-canvas-event-map";
import { EventListener } from "./event-listener";
import { InfiniteCanvasAddEventListenerOptions } from "./infinite-canvas-add-event-listener-options";
import { InfiniteCanvas } from "../infinite-canvas";

export class InfiniteCanvasEventDispatcher<K extends keyof InfiniteCanvasEventMap>{
    private listeners: EventListener<K>[] = [];
    private onceListeners: EventListener<K>[] = [];
    constructor(private readonly infiniteCanvas: InfiniteCanvas){

    }
    public dispatchEvent(event: InfiniteCanvasEventMap[K]): void{
        const onceListeners: EventListener<K>[] = this.onceListeners;
        this.onceListeners = [];
        for(const onceListener of onceListeners){
            this.notifyListener(onceListener, event);
        }
        for(const listener of this.listeners){
            this.notifyListener(listener, event);
        }
    }
    public addListener(listener: EventListener<K>, options?: InfiniteCanvasAddEventListenerOptions){
        if(options && options.once){
            this.onceListeners.push(listener);
        }else{
            this.listeners.push(listener);
        }
    }
    private notifyListener(listener: EventListener<K>, event: InfiniteCanvasEventMap[K]): void{
        listener.call(this.infiniteCanvas, event);
    }
}