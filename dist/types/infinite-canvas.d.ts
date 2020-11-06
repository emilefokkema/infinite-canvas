import { InfiniteCanvasRenderingContext2D } from "./infinite-context/infinite-canvas-rendering-context-2d";
import { InfiniteCanvasConfig } from "./config/infinite-canvas-config";
import { InfiniteCanvasEventMap } from "./custom-events/infinite-canvas-event-map";
import { InfiniteCanvasAddEventListenerOptions } from "./custom-events/infinite-canvas-add-event-listener-options";
import { InfiniteCanvasEventListener } from "./custom-events/infinite-canvas-event-listener";
import { InfiniteCanvasUnits } from "./infinite-canvas-units";
export declare class InfiniteCanvas implements InfiniteCanvasConfig {
    private readonly canvas;
    private context;
    private viewBox;
    private config;
    private eventDispatchers;
    private rectangle;
    private canvasResizeObserver;
    private canvasResizeListener;
    constructor(canvas: HTMLCanvasElement, config?: InfiniteCanvasConfig);
    private setUnits;
    getContext(): InfiniteCanvasRenderingContext2D;
    get rotationEnabled(): boolean;
    set rotationEnabled(value: boolean);
    get units(): InfiniteCanvasUnits;
    set units(value: InfiniteCanvasUnits);
    get greedyGestureHandling(): boolean;
    set greedyGestureHandling(value: boolean);
    addEventListener<K extends keyof InfiniteCanvasEventMap>(type: K, listener: InfiniteCanvasEventListener<K>, options?: InfiniteCanvasAddEventListenerOptions): void;
    removeEventListener<K extends keyof InfiniteCanvasEventMap>(type: K, listener: InfiniteCanvasEventListener<K>): void;
    static CANVAS_UNITS: InfiniteCanvasUnits;
    static CSS_UNITS: InfiniteCanvasUnits;
}
