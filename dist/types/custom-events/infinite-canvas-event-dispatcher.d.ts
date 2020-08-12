import { InfiniteCanvasEventMap } from "./infinite-canvas-event-map";
import { EventListener } from "./event-listener";
import { InfiniteCanvasAddEventListenerOptions } from "./infinite-canvas-add-event-listener-options";
import { InfiniteCanvas } from "../infinite-canvas";
export declare class InfiniteCanvasEventDispatcher<K extends keyof InfiniteCanvasEventMap> {
    private readonly infiniteCanvas;
    private listeners;
    private onceListeners;
    constructor(infiniteCanvas: InfiniteCanvas);
    dispatchEvent(event: InfiniteCanvasEventMap[K]): void;
    addListener(listener: EventListener<K>, options?: InfiniteCanvasAddEventListenerOptions): void;
    private notifyListener;
}
