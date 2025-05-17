import type { InfiniteCanvasTouch } from "./infinite-canvas-touch";

export interface InfiniteCanvasTouchList extends TouchList{
    [Symbol.iterator](): IterableIterator<InfiniteCanvasTouch>;
    item(index: number): InfiniteCanvasTouch | null;
    [index: number]: InfiniteCanvasTouch;
}

export * from './infinite-canvas-touch';