import { EventListener } from "./event-listener";
import {InfiniteCanvasAddEventListenerOptions} from "./infinite-canvas-add-event-listener-options";
import { Event } from "./event";

export class EventDispatcher<TEvent> implements Event<TEvent>{
    private listeners: EventListener<TEvent>[] = [];
    private onceListeners: EventListener<TEvent>[] = [];
    public dispatchEvent(event: TEvent): void{
        const onceListeners: EventListener<TEvent>[] = this.onceListeners;
        this.onceListeners = [];
        for(const onceListener of onceListeners){
            this.notifyListener(onceListener, event);
        }
        for(const listener of this.listeners){
            this.notifyListener(listener, event);
        }
    }
    public addListener(listener: EventListener<TEvent>, options?: InfiniteCanvasAddEventListenerOptions): void{
        if(options && options.once){
            this.onceListeners.push(listener);
        }else{
            this.listeners.push(listener);
        }
    }
    public removeListener(listener: EventListener<TEvent>): void{
        let index: number = this.listeners.indexOf(listener);
        if(index > -1){
            this.listeners.splice(index, 1);
        }
        index = this.onceListeners.indexOf(listener);
        if(index > -1){
            this.onceListeners.splice(index, 1);
        }
    }
    private notifyListener(listener: EventListener<TEvent>, event: TEvent): void{
        try {
            listener(event);
        } catch (error) {
            console.error(error);
        }
    }
}
