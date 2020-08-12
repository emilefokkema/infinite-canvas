import { InfiniteCanvasRenderingContext2D } from "./infinite-context/infinite-canvas-rendering-context-2d";
import { InfiniteCanvasConfig } from "./config/infinite-canvas-config";
import { InfiniteCanvasEventMap } from "./custom-events/infinite-canvas-event-map";
import { InfiniteCanvasAddEventListenerOptions } from "./custom-events/infinite-canvas-add-event-listener-options";
import { EventListener } from "./custom-events/event-listener";
export declare class InfiniteCanvas implements InfiniteCanvasConfig {
    private readonly canvas;
    private context;
    private viewBox;
    private transformer;
    private config;
    private eventDispatchers;
    constructor(canvas: HTMLCanvasElement, config?: InfiniteCanvasConfig);
    getContext(): InfiniteCanvasRenderingContext2D;
    get rotationEnabled(): boolean;
    set rotationEnabled(value: boolean);
    get greedyGestureHandling(): boolean;
    set greedyGestureHandling(value: boolean);
    addEventListener<K extends keyof InfiniteCanvasEventMap>(type: K, listener: EventListener<K>, options?: InfiniteCanvasAddEventListenerOptions): void;
    private dispatchDrawEvent;
}
