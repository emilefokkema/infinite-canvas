import {Config} from "./config";
import { Units } from "./units";
import {InfiniteCanvasRenderingContext2D} from "./infinite-canvas-rendering-context-2d";
import {EventMap} from "./event-map";
import { TransformationEvent } from "./transformation-event";
import { Transformed } from './transformed';

export interface InfiniteCanvasEventHandlers extends DocumentAndElementEventHandlers, GlobalEventHandlers {
    /**
     * The [event handler property](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_handler_properties) for the {@link EventMap.transformationstart} event
     */
    ontransformationstart: ((this: InfiniteCanvas, event: TransformationEvent) => any) | null;
    /**
     * The [event handler property](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_handler_properties) for the {@link EventMap.transformationchange} event
     */
    ontransformationchange: ((this: InfiniteCanvas, event: TransformationEvent) => any) | null;
    /**
     * The [event handler property](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_handler_properties) for the {@link EventMap.transformationend} event
     */
    ontransformationend: ((this: InfiniteCanvas, event: TransformationEvent) => any) | null;
    /**
     * The [event handler property](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_handler_properties) for the {@link EventMap.draw} event
     */
    ondraw: ((this: InfiniteCanvas, event: TransformationEvent) => any) | null;
    /**
     * The [event handler property](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_handler_properties) for the {@link EventMap.wheelignored} event
     */
    onwheelignored:  ((this: InfiniteCanvas, event: Event) => any) | null;
    /**
     * The [event handler property](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_handler_properties) for the {@link EventMap.touchignored} event
     */
    ontouchignored:  ((this: InfiniteCanvas, event: Event) => any) | null;
    /**
     * See [`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) 
     */
    addEventListener<K extends keyof EventMap>(type: K, listener: (this: InfiniteCanvas, ev: EventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    /**
     * See [`removeEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)
     */
    removeEventListener<K extends keyof EventMap>(type: K, listener: (this: InfiniteCanvas, ev: EventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

export interface InfiniteCanvas extends Config, InfiniteCanvasEventHandlers, Transformed{
    /**
     * This methods return the {@link InfiniteCanvasRenderingContext2D} belonging to this instance of {@link InfiniteCanvas}
     * 
     * @param contextType for (partial) compatibility with the other [getContext()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext)
     */
    getContext(contextType?: '2d'): InfiniteCanvasRenderingContext2D;
}

export interface InfiniteCanvasCtr {
    /**
     * Creates a new instance of an {@link InfiniteCanvas}
     * 
     * @param canvas The canvas on which to draw the {@link InfiniteCanvas}
     * @param config The {@link InfiniteCanvas}'s initial configuration
     */
    new(canvas: HTMLCanvasElement, config?: Partial<Config>): InfiniteCanvas;
    prototype: InfiniteCanvas;
    /**
     * Static property with a value of {@link Units.CANVAS}
     */
    CANVAS_UNITS: Units;
    /**
     * Static property with a value of {@link Units.CSS}
     */
    CSS_UNITS: Units;
};

declare var InfiniteCanvasConstructor: InfiniteCanvasCtr;

export * from './config'
export * from './event-map'
export * from './infinite-canvas-rendering-context-2d'
export * from './units'
export default InfiniteCanvasConstructor;
