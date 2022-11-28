import { JSHandle } from "puppeteer";
import { AsyncResult, EventListenerSequenceOnE2ETestPage} from './page/interfaces'
import { EventListenerConfiguration } from "./shared/configuration";
import { EventMap } from './shared/infinite-canvas-event-map';
import { DrawEvent } from "./shared/draw-event";

export interface EventListenerProxy<T = any>{
    getNext(): Promise<JSHandle<AsyncResult<T>>>;
    ensureNoNext(interval: number): Promise<JSHandle<AsyncResult<void>>>;
    startSequence(): Promise<JSHandle<EventListenerSequenceOnE2ETestPage>>;
    addSelfToSequence(sequence: JSHandle<EventListenerSequenceOnE2ETestPage>): Promise<void>;
}

export interface EventListenerProvider<TEventMap>{
    addEventListener<Type extends keyof TEventMap>(config: EventListenerConfiguration<TEventMap, Type>): Promise<EventListenerProxy<TEventMap[Type]>>;
}

export interface InfiniteCanvasProxy extends EventListenerProvider<EventMap>{
    addDrawEventListener(debounceInterval?: number): Promise<EventListenerProxy<DrawEvent>>;
}


export type AsyncResultProvider<TResult> = () => Promise<JSHandle<AsyncResult<TResult>>>;
export type AsyncResultProviders<TResults extends unknown[]> = {[K in keyof TResults]: AsyncResultProvider<TResults[K]>};
export type EventListenerProxies<TEvents extends unknown[]> = {[K in keyof TEvents]: EventListenerProxy<TEvents[K]>};