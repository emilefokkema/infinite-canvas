import { InfiniteCanvasConfig } from "./config/infinite-canvas-config";
import { InfiniteCanvasUnits } from "./infinite-canvas-units";
import { InfiniteCanvasRenderingContext2D } from "./infinite-context/infinite-canvas-rendering-context-2d";
import { InfiniteCanvasEventMap } from "./custom-events/infinite-canvas-event-map";
import { InfiniteCanvasAddEventListenerOptions } from "./custom-events/infinite-canvas-add-event-listener-options";
import { InfiniteCanvasEventListener } from "./custom-events/infinite-canvas-event-listener";
export declare class InfiniteCanvas implements InfiniteCanvasConfig {
    constructor(canvas: HTMLCanvasElement, config?: Partial<InfiniteCanvasConfig>);
    rotationEnabled: boolean;
    units: InfiniteCanvasUnits;
    greedyGestureHandling: boolean;
    getContext(): InfiniteCanvasRenderingContext2D;
    addEventListener<K extends keyof InfiniteCanvasEventMap>(type: K, listener: InfiniteCanvasEventListener<K>, options?: InfiniteCanvasAddEventListenerOptions): void;
    removeEventListener<K extends keyof InfiniteCanvasEventMap>(type: K, listener: InfiniteCanvasEventListener<K>): void;
    static CANVAS_UNITS: InfiniteCanvasUnits;
    static CSS_UNITS: InfiniteCanvasUnits;
}
