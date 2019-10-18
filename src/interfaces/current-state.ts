import { InfiniteCanvasStateInstance } from "../state/infinite-canvas-state-instance";
import { StateChange } from "../state/state-change";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";

export interface CurrentState{
    state: InfiniteCanvasState;
    changeState(change: (state: InfiniteCanvasStateInstance) => StateChange<InfiniteCanvasStateInstance>): void;
    saveState(): void;
    restoreState(): void;
}