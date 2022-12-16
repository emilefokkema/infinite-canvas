import { Config } from "./config";
import { Units } from "./units";
import { InfiniteCanvasRenderingContext2D } from "./infinite-canvas-rendering-context-2d";
import { EventMap } from "./event-map";
import { AddEventListenerOptions } from "./add-event-listener-options";
import { EventListener } from "./event-listener";
export interface InfiniteCanvas extends Config {
    /**
     * This methods return the {@link InfiniteCanvasRenderingContext2D} belonging to this instance of {@link InfiniteCanvas}
     *
     * @param contextType for (partial) compatibility with the other [getContext()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext)
     */
    getContext(contextType?: '2d'): InfiniteCanvasRenderingContext2D;
    /**
     * Adds an event listener to an {@link InfiniteCanvas}
     *
     * @example
     * ```js
     * infCanvas.addEventListener('draw', () => {
     *     console.log('drawn!')
     * })
     * ```
     * @param type The type of event to listen to
     * @param listener The listener to add
     * @param options An optional options object
     */
    addEventListener<K extends keyof EventMap>(type: K, listener: EventListener<K>, options?: AddEventListenerOptions): void;
    /**
     * Removes an event listener
     * @param type The type of event that the listener to remove is listening to
     * @param listener The listener to remove
     */
    removeEventListener<K extends keyof EventMap>(type: K, listener: EventListener<K>): void;
}
export interface InfiniteCanvasCtr {
    /**
     * Creates a new instance of an {@link InfiniteCanvas}
     *
     * @param canvas The canvas on which to draw the {@link InfiniteCanvas}
     * @param config The {@link InfiniteCanvas}'s initial configuration
     */
    new (canvas: HTMLCanvasElement, config?: Partial<Config>): InfiniteCanvas;
    prototype: InfiniteCanvas;
    /**
     * Static property with a value of {@link Units.CANVAS}
     */
    CANVAS_UNITS: Units;
    /**
     * Static property with a value of {@link Units.CSS}
     */
    CSS_UNITS: Units;
}
declare var InfiniteCanvasConstructor: InfiniteCanvasCtr;
export * from './add-event-listener-options';
export * from './config';
export * from './event-map';
export * from './event-listener';
export * from './infinite-canvas-rendering-context-2d';
export * from './units';
export default InfiniteCanvasConstructor;
