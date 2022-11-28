import {InfiniteCanvasConfig} from "./config/infinite-canvas-config";
import { InfiniteCanvasUnits } from "./infinite-canvas-units";
import {InfiniteCanvasRenderingContext2D} from "./infinite-context/infinite-canvas-rendering-context-2d";
import {InfiniteCanvasEventMap} from "./custom-events/infinite-canvas-event-map";
import {InfiniteCanvasAddEventListenerOptions} from "./custom-events/infinite-canvas-add-event-listener-options";
import {InfiniteCanvasEventListener} from "./custom-events/infinite-canvas-event-listener";


export interface InfiniteCanvas extends InfiniteCanvasConfig{
    getContext(): InfiniteCanvasRenderingContext2D;
    addEventListener<K extends keyof InfiniteCanvasEventMap>(type: K, listener: InfiniteCanvasEventListener<K>, options?: InfiniteCanvasAddEventListenerOptions): void;
    removeEventListener<K extends keyof InfiniteCanvasEventMap>(type: K, listener: InfiniteCanvasEventListener<K>): void;
}

export interface InfiniteCanvasCtr {
    new(canvas: HTMLCanvasElement, config?: Partial<InfiniteCanvasConfig>): InfiniteCanvas;
    prototype: InfiniteCanvas;
    CANVAS_UNITS: InfiniteCanvasUnits;
    CSS_UNITS: InfiniteCanvasUnits;
};

declare var InfiniteCanvas: InfiniteCanvasCtr;

export default InfiniteCanvas;