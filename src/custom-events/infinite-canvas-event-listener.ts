import { InfiniteCanvasEventMap } from "./infinite-canvas-event-map";
import { EventListener } from "./event-listener";


export declare type InfiniteCanvasEventListener<K extends keyof InfiniteCanvasEventMap> = EventListener<InfiniteCanvasEventMap[K]>;
