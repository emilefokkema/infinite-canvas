import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { InfiniteCanvasStateInstance } from "../state/infinite-canvas-state-instance";
export interface CurrentState {
    state: InfiniteCanvasState;
    changeState(change: (state: InfiniteCanvasStateInstance) => InfiniteCanvasStateInstance): void;
    saveState(): void;
    restoreState(): void;
}
