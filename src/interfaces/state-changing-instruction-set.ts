import { InstructionSet } from "./instruction-set";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { StateChangingInstructionSetWithCurrentPath } from "./state-changing-instruction-set-with-current-path";

export interface StateChangingInstructionSet extends InstructionSet{
    state: InfiniteCanvasState;
    initialState: InfiniteCanvasState;
    stateOfFirstInstruction: InfiniteCanvasState;
    setInitialState(previousState: InfiniteCanvasState): void;
    setInitialStateWithClippedPaths(previousState: InfiniteCanvasState): void;
    addClippedPath(clippedPath: StateChangingInstructionSetWithCurrentPath): void;
}
