import { DrawEvent } from "./draw-event";
import { TransformationEvent } from "./transformation-event";
export interface EventMap {
    /**
     * Emitted when the {@link InfiniteCanvas} has drawn its content on the underlying `<canvas>`
     */
    "draw": DrawEvent;
    /**
     * Emitted when {@link InfiniteCanvas} begins transforming (for example when the user begins to pan)
     */
    "transformationStart": TransformationEvent;
    /**
     * Emitted when {@link InfiniteCanvas} transforms (for example when the user pans)
     */
    "transformationChange": TransformationEvent;
    /**
     * Emitted when {@link InfiniteCanvas} has finished transforming
     */
    "transformationEnd": TransformationEvent;
}
export * from './draw-event';
export * from './transformation-event';
export * from './transformed';
