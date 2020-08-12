import { InfiniteCanvasEventMap } from "./infinite-canvas-event-map";
import { InfiniteCanvasEventDispatcher } from "./infinite-canvas-event-dispatcher";
export declare type EventDispatchers = {
    [K in keyof InfiniteCanvasEventMap]: InfiniteCanvasEventDispatcher<K>;
};
