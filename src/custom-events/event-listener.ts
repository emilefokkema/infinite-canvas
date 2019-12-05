import { InfiniteCanvasEventMap } from "./infinite-canvas-event-map";
import { InfiniteCanvas } from "../infinite-canvas";


export declare type EventListener<K extends keyof InfiniteCanvasEventMap> = (this: InfiniteCanvas, ev: InfiniteCanvasEventMap[K]) => any;