import { WithFunctionsAsStrings } from "../utils";
import { InfiniteCanvasE2EInitialization, EventListenerConfiguration } from "../shared/configuration";
import { EventMap } from "../shared/infinite-canvas-event-map";
import { WindowEventMap } from '../shared/window-event-map'

export interface AsyncResult<T = any>{
    readonly promise: Promise<T>;
}

export interface EventListenerSequenceOnE2ETestPage{
    addListener(listener: EventListenerOnE2ETestPage): void;
    getSequence(): AsyncResult;
}

export interface EventListenerOnE2ETestPage<T = any>{
    getNext(): AsyncResult<T>;
    ensureNoNext(interval: number): AsyncResult<void>;
    startSequence(): EventListenerSequenceOnE2ETestPage;
    addListener(listener: (ev: T) => void): void;
    removeListener(listener: (ev: T) => void): void;
}

export interface InfiniteCanvasOnE2ETestPage{
    addEventListener<Type extends keyof EventMap>(config: WithFunctionsAsStrings<EventListenerConfiguration<EventMap, Type>>): EventListenerOnE2ETestPage<EventMap[Type]>;
}

export interface TestPageLib{
    addWindowEventListener<Type extends keyof WindowEventMap>(config: WithFunctionsAsStrings<EventListenerConfiguration<WindowEventMap, Type>>): EventListenerOnE2ETestPage<WindowEventMap[Type]>;
    initializeInfiniteCanvas(initialization: WithFunctionsAsStrings<InfiniteCanvasE2EInitialization>): InfiniteCanvasOnE2ETestPage;
}