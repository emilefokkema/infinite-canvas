import { InfiniteCanvasTouchList } from "./infinite-canvas-touch-list";

export interface InfiniteCanvasTouchEvent extends TouchEvent{
    readonly targetTouches: InfiniteCanvasTouchList;
    readonly changedTouches: InfiniteCanvasTouchList;
    readonly touches: InfiniteCanvasTouchList;
}

export * from './infinite-canvas-touch-list';