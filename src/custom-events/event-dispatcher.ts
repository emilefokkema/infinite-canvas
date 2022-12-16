import {AddEventListenerOptions} from "../api-surface/add-event-listener-options";
import { Event } from "./event";

export class EventDispatcher<TEvent> implements Event<TEvent>{
    private listeners: ((ev: TEvent) => void)[] = [];
    private onceListeners: ((ev: TEvent) => void)[] = [];
    public dispatchEvent(event: TEvent): void{
        const onceListeners: ((ev: TEvent) => void)[]  = this.onceListeners;
        this.onceListeners = [];
        for(const onceListener of onceListeners){
            this.notifyListener(onceListener, event);
        }
        for(const listener of this.listeners){
            this.notifyListener(listener, event);
        }
    }
    public addListener(listener: (ev: TEvent) => void, options?: AddEventListenerOptions): void{
        if(options && options.once){
            this.onceListeners.push(listener);
        }else{
            this.listeners.push(listener);
        }
    }
    public removeListener(listener: (ev: TEvent) => void): void{
        let index: number = this.listeners.indexOf(listener);
        if(index > -1){
            this.listeners.splice(index, 1);
        }
        index = this.onceListeners.indexOf(listener);
        if(index > -1){
            this.onceListeners.splice(index, 1);
        }
    }
    private notifyListener(listener: (ev: TEvent) => void, event: TEvent): void{
        try {
            listener(event);
        } catch (error) {
            console.error(error);
        }
    }
}
