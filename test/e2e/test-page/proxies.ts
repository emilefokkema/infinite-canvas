import { JSHandle } from "puppeteer";
import { AsyncResult, EventListenerSequenceOnE2ETestPage} from './page/interfaces'
import { EventListenerConfiguration, InfiniteCanvasE2EInitialization } from "./shared/configuration";
import { InfiniteCanvasEventMap } from './shared/infinite-canvas-event-map';
import { DrawEvent } from "./shared/draw-event";
import { ElementEventMap } from './shared/element-event-map';
import { MouseEventMap, TransformationEventMap, TouchEventMap, PointerEventMap } from "./shared/maps";
import { MouseEventShape } from "./shared/mouse-event-shape";
import { WheelEventShape } from "./shared/wheel-event-shape";
import { TouchEventShape } from "./shared/touch-event-shape";
import { PointerEventShape } from "./shared/pointer-event-shape";

export interface EventListenerProxy<T = any>{
    getNext(): Promise<JSHandle<AsyncResult<T>>>;
    ensureNoNext(interval: number): Promise<JSHandle<AsyncResult<void>>>;
    startSequence(): Promise<JSHandle<EventListenerSequenceOnE2ETestPage>>;
    addSelfToSequence(sequence: JSHandle<EventListenerSequenceOnE2ETestPage>): Promise<void>;
}

interface MouseEventListenerProvider<TEventMap, TMouseEventMap = MouseEventMap<TEventMap>>{
    addMouseEventListener<K extends keyof TMouseEventMap>(
        type: K,
        preventDefault?: (ev: MouseEventShape) => boolean,
        preventNativeDefault?: (ev: MouseEventShape) => boolean,
        stopPropagation?: (ev: MouseEventShape) => boolean,
        capture?: boolean): Promise<EventListenerProxy<TMouseEventMap[K]>>;
}

export interface CanvasElementProxy extends EventListenerProvider<ElementEventMap>, MouseEventListenerProvider<ElementEventMap>{
    initializeInfiniteCanvas(initialization: InfiniteCanvasE2EInitialization): Promise<InfiniteCanvasProxy>;
    setAttribute(name: string, value: string): Promise<void>;
}

export interface EventListenerProvider<TEventMap>{
    addEventListener<Type extends keyof TEventMap>(config: EventListenerConfiguration<TEventMap, Type>): Promise<EventListenerProxy<TEventMap[Type]>>;
}

export interface InfiniteCanvasProxy extends EventListenerProvider<InfiniteCanvasEventMap>, MouseEventListenerProvider<InfiniteCanvasEventMap>{
    addDrawEventListener(debounceInterval?: number): Promise<EventListenerProxy<DrawEvent>>;
    addWheelEventListener(
        preventDefault?: (ev: WheelEventShape) => boolean,
        preventNativeDefault?: (ev: WheelEventShape) => boolean): Promise<EventListenerProxy<WheelEventShape>>;
    addTransformationEventListener<K extends keyof TransformationEventMap>(type: K): Promise<EventListenerProxy<TransformationEventMap[K]>>;
    addTouchEventListener<K extends keyof TouchEventMap>(
        type: K,
        preventDefault?: (ev: TouchEventShape) => boolean,
        preventNativeDefault?: (ev: TouchEventShape) => boolean): Promise<EventListenerProxy<TouchEventMap[K]>>;
    addPointerEventListener<K extends keyof PointerEventMap<InfiniteCanvasEventMap>>(
        type: K,
        preventDefault?: (ev: PointerEventShape) => boolean,
        preventNativeDefault?: (ev: PointerEventShape) => boolean,
        stopPropagation?: (ev: PointerEventShape) => boolean,
        capture?: boolean
    ): Promise<EventListenerProxy<PointerEventMap<InfiniteCanvasEventMap>[K]>>;
}


export type AsyncResultProvider<TResult> = () => Promise<JSHandle<AsyncResult<TResult>>>;
export type AsyncResultProviders<TResults extends unknown[]> = {[K in keyof TResults]: AsyncResultProvider<TResults[K]>};
export type EventListenerProxies<TEvents extends unknown[]> = {[K in keyof TEvents]: EventListenerProxy<TEvents[K]>};
