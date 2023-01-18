import { InfiniteCanvasTouch } from "./infinite-canvas-touch";

export interface InfiniteCanvasTouchList extends TouchList{
    item(index: number): InfiniteCanvasTouch | null;
    [index: number]: InfiniteCanvasTouch;
}

export * from './infinite-canvas-touch';