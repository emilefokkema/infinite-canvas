import { WithFunctionsAsStrings } from "../utils";
import { InfiniteCanvasE2EInitialization, EventListenerConfiguration, FullInfiniteCanvasE2EInitialization, CanvasElementInitialization } from "../shared/configuration";
import { InfiniteCanvasEventMap } from "../shared/infinite-canvas-event-map";
import { WindowEventMap } from '../shared/window-event-map'
import { ElementEventMap } from '../shared/element-event-map';

export interface AsyncResult<T = any>{
    readonly promise: Promise<T>;
}

export interface EventListenerSequenceOnE2ETestPage{
    addListener(listener: EventListenerOnE2ETestPage): void;
    getSequence(): AsyncResult;
}

export interface CanvasElementOnE2eTestPage extends EventListenerProviderOnE2eTestPage<ElementEventMap>{
    initializeInfiniteCanvas(initialization: WithFunctionsAsStrings<InfiniteCanvasE2EInitialization>): InfiniteCanvasOnE2ETestPage;
    setAttribute(name: string, value: string): void;
}

export interface EventListenerProviderOnE2eTestPage<TEventMap>{
    addEventListener<Type extends keyof TEventMap>(config: WithFunctionsAsStrings<EventListenerConfiguration<TEventMap, Type>>): EventListenerOnE2ETestPage<TEventMap[Type]>;
}

export interface EventListenerOnE2ETestPage<T = any>{
    getNext(): AsyncResult<T>;
    ensureNoNext(interval: number): AsyncResult<void>;
    startSequence(): EventListenerSequenceOnE2ETestPage;
    addListener(listener: (ev: T) => void): void;
    removeListener(listener: (ev: T) => void): void;
}

export interface InfiniteCanvasOnE2ETestPage extends EventListenerProviderOnE2eTestPage<InfiniteCanvasEventMap>{

}

export interface TestPageLib{
    addWindowEventListener<Type extends keyof WindowEventMap>(config: WithFunctionsAsStrings<EventListenerConfiguration<WindowEventMap, Type>>): EventListenerOnE2ETestPage<WindowEventMap[Type]>;
    initializeInfiniteCanvas(initialization: WithFunctionsAsStrings<FullInfiniteCanvasE2EInitialization>): InfiniteCanvasOnE2ETestPage;
    initializeCanvas(initialization: WithFunctionsAsStrings<CanvasElementInitialization>): CanvasElementOnE2eTestPage;
    addStyleSheet(cssText: string): void;
}
