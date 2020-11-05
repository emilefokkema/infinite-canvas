import { InfiniteCanvasDrawEvent } from "./infinite-canvas-draw-event";
import { InfiniteCanvasTransformationEvent } from "./infinite-canvas-transformation-event";

export interface InfiniteCanvasEventMap{
    "draw": InfiniteCanvasDrawEvent,
    "transformationStart": InfiniteCanvasTransformationEvent,
    "transformationChange": InfiniteCanvasTransformationEvent,
    "transformationEnd": InfiniteCanvasTransformationEvent
}