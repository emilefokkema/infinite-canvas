import { InfiniteCanvas } from 'api/infinite-canvas';

export interface EventListenerCollection<TEventMap, TThis = any>{
    addEventListener(type: keyof TEventMap, listener: ((this: TThis, ev: TEventMap[keyof TEventMap]) => any) | EventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: keyof TEventMap, listener: ((this: TThis, ev: TEventMap[keyof TEventMap]) => any) | EventListenerObject, options?: boolean | EventListenerOptions): void;
}

export interface EventCollection<TEventMap> extends EventListenerCollection<TEventMap, InfiniteCanvas>{
    setOn(type: keyof TEventMap, listener: (this: InfiniteCanvas, ev: TEventMap[keyof TEventMap]) => any): void;
    getOn(type: keyof TEventMap): (this: InfiniteCanvas, ev: TEventMap[keyof TEventMap]) => any;
}
