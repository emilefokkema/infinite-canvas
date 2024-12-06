import { InfiniteCanvasState } from "../state/infinite-canvas-state";

export interface StateChange{
    state: InfiniteCanvasState;
    initialState: InfiniteCanvasState;
}