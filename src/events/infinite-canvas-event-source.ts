import {InfiniteCanvas} from "../api-surface/infinite-canvas";
import { isEventListenerObject } from "../event-utils/accept-event-listener-objects";

interface InfiniteCanvasEventSourceForEventListenerObjects{
    addListener(listener: EventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeListener(listener: EventListenerObject, options?: boolean | EventListenerOptions): void;
}

interface InfiniteCanvasEventSourceForListeners<TEvent>{
    on: (this: InfiniteCanvas, ev: TEvent) => any;
    addListener(listener: (this: InfiniteCanvas, ev: TEvent) => any, options?: boolean | AddEventListenerOptions): void;
    removeListener(listener: (this: InfiniteCanvas, ev: TEvent) => any, options?: boolean | EventListenerOptions): void;
}

export type InfiniteCanvasEventSource<TEvent> = InfiniteCanvasEventSourceForListeners<TEvent> & InfiniteCanvasEventSourceForEventListenerObjects;

export function addListenerToInfiniteCanvasEventSource<TEvent>(
    source: InfiniteCanvasEventSource<TEvent>,
    listener: ((this: InfiniteCanvas, ev: TEvent) => any) | EventListenerObject,
    options?: boolean | AddEventListenerOptions
){
    if(isEventListenerObject(listener)){
        source.addListener(listener, options);
    }else{
        source.addListener(listener, options);
    }
}

export function removeListenerFromInfiniteCanvasEventSource<TEvent>(
    source: InfiniteCanvasEventSource<TEvent>,
    listener: ((this: InfiniteCanvas, ev: TEvent) => any) | EventListenerObject,
    options?: boolean | EventListenerOptions
){
    if(isEventListenerObject(listener)){
        source.removeListener(listener, options);
    }else{
        source.removeListener(listener, options);
    }
}
