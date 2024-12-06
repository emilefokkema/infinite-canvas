import { RectangleManager } from "../../rectangle/rectangle-manager";
import { EventSource } from "../../event-utils/event-source";
import { map } from "../../event-utils/map";
import { addListenerToInfiniteCanvasEventSource, InfiniteCanvasEventSource, removeListenerFromInfiniteCanvasEventSource } from "../infinite-canvas-event-source";
import { createStoppableInfiniteCanvasEvent } from "../create-infinite-canvas-event";
import { InfiniteCanvas } from "api/infinite-canvas";
import { MappableInternalEvent } from "../internal-events/mappable-internal-event";
import { EventCollection } from "./event-collection";

export abstract class BaseEventCollection<TKey extends keyof TEventMap, TEventMap extends {[K in keyof TEventMap]: Event}> implements EventCollection<TEventMap>{
    protected cache: {[K in keyof TEventMap]?: InfiniteCanvasEventSource<TEventMap[K]>};
    constructor(protected readonly rectangleManager: RectangleManager, private readonly infiniteCanvas: InfiniteCanvas){
        this.cache = {};
    }
    protected abstract getEventSource(type: TKey): InfiniteCanvasEventSource<TEventMap[TKey]>;

    protected map<TSource, TTarget extends Event>(
        source: EventSource<TSource>,
        mapFn: (ev: TSource) => MappableInternalEvent<TTarget>): InfiniteCanvasEventSource<TTarget>{
        return createStoppableInfiniteCanvasEvent(map(source, mapFn), this.rectangleManager, this.infiniteCanvas);
    }
    public setOn(type: TKey, listener: (this: InfiniteCanvas, ev: TEventMap[keyof TEventMap]) => any): void{
        if(listener){
            if(!this.cache[type]){
                this.cache[type] = this.getEventSource(type)
            }
            this.cache[type].on = listener;
        }else{
            if(!this.cache[type]){
                return;
            }
            this.cache[type].on = null;
        }
    }
    public getOn(type: keyof TEventMap): (this: InfiniteCanvas, ev: TEventMap[keyof TEventMap]) => any{
        if(!this.cache[type]){
            return null;
        }
        return this.cache[type].on;
    }
    public addEventListener(type: TKey, listener: ((this: InfiniteCanvas, ev: TEventMap[TKey]) => any) | EventListenerObject, options?: boolean | AddEventListenerOptions): void{
        if(!this.cache[type]){
            this.cache[type] = this.getEventSource(type)
        }
        addListenerToInfiniteCanvasEventSource(this.cache[type], listener, options);
    }
    public removeEventListener(type: TKey, listener: ((this: InfiniteCanvas, ev: TEventMap[TKey]) => any) | EventListenerObject, options?: boolean | EventListenerOptions): void{
        if(!this.cache[type]){
            return;
        }
        removeListenerFromInfiniteCanvasEventSource(this.cache[type], listener, options);
    }
}
