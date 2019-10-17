import { WithState } from "../state/with-state";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { WithInstruction } from "./with-instruction";

export interface WithStateAndInstruction extends WithState, WithInstruction{
    readonly initialState: InfiniteCanvasState;
    changeToState(state: InfiniteCanvasState): void;
}