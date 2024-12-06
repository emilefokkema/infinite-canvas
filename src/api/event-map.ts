import type { DrawEvent } from "./draw-event";
import type { InfiniteCanvasEventWithDefaultBehavior } from "./infinite-canvas-event-with-default-behavior";
import type { InfiniteCanvasTouchEvent } from "./infinite-canvas-touch-event";
import type { TransformationEvent } from "./transformation-event";

export interface EventMap extends HTMLElementEventMap {
	/**
	 * Emitted when {@link InfiniteCanvas} begins transforming (for example when the user begins to pan)
	 */
    transformationstart: TransformationEvent,
    /**
     * Emitted when {@link InfiniteCanvas} transforms (for example when the user pans)
     */
    transformationchange: TransformationEvent,
    /**
     * Emitted when {@link InfiniteCanvas} has finished transforming
     */
    transformationend: TransformationEvent,
    /** 
     * Emitted when the {@link InfiniteCanvas} has drawn its content on the underlying `<canvas>`
     */
    draw: DrawEvent,
    /**
     * Emitted when {@link Config#greedyGestureHandling} is `false` and the user 'scrolls' (uses the mouse wheel) without using the Ctrl key
     */
    wheelignored: Event,
    /**
     * Emitted when {@link Config#greedyGestureHandling} is `false` and the user uses one one finger
     */
    touchignored: Event,
    mousedown: MouseEvent & InfiniteCanvasEventWithDefaultBehavior,
    pointerdown: PointerEvent & InfiniteCanvasEventWithDefaultBehavior,
    wheel: WheelEvent & InfiniteCanvasEventWithDefaultBehavior
    touchstart: InfiniteCanvasTouchEvent & InfiniteCanvasEventWithDefaultBehavior,
    touchmove: InfiniteCanvasTouchEvent,
    touchend: InfiniteCanvasTouchEvent,
    touchcancel: InfiniteCanvasTouchEvent
}

export * from "./draw-event";
export * from './transformation-event';
export * from './infinite-canvas-touch-event';
export * from './transformed';
export * from './infinite-canvas-event-with-default-behavior';
export * from './infinite-canvas-touch-event';
