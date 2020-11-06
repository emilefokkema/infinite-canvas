import { InfiniteCanvasEventMap } from "./infinite-canvas-event-map";
import { EventListener } from "./event-listener";
import { InfiniteCanvasAddEventListenerOptions } from "./infinite-canvas-add-event-listener-options";
import { InfiniteCanvasDrawEvent } from "./infinite-canvas-draw-event";
import { Event } from "./event";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";
export declare class EventDispatcherCollection {
    private readonly drawEvent;
    private transformationStartEvent;
    private transformationChangeEvent;
    private transformationEndEvent;
    constructor(rectangle: CanvasRectangle, drawEvent: Event<InfiniteCanvasDrawEvent>, transformationStartEvent: Event<void>, transformationChangeEvent: Event<void>, transformationEndEvent: Event<void>);
    addEventListener<K extends keyof InfiniteCanvasEventMap>(event: K, listener: EventListener<InfiniteCanvasEventMap[K]>, options?: InfiniteCanvasAddEventListenerOptions): void;
    removeEventListener<K extends keyof InfiniteCanvasEventMap>(event: K, listener: EventListener<InfiniteCanvasEventMap[K]>): void;
}
