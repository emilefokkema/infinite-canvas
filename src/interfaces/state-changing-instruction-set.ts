import { InstructionSet } from "./instruction-set";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";

export interface StateChangingInstructionSet extends InstructionSet{
    readonly initialState: InfiniteCanvasState;
    changeToState(state: InfiniteCanvasState): void;
}