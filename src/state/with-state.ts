import { StateChange } from "./state-change";
import { InfiniteCanvasStateInstance } from "./infinite-canvas-state-instance";
import { InfiniteCanvasState } from "./infinite-canvas-state";

export interface WithState{
    readonly state: InfiniteCanvasState;
    changeState(change: (state: InfiniteCanvasStateInstance) => StateChange<InfiniteCanvasStateInstance>): void;
    saveState(): void;
    restoreState(): void;
}