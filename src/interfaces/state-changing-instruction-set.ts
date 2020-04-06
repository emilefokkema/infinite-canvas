import { InstructionSet } from "./instruction-set";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { StateChangingInstructionSetWithAreaAndCurrentPath } from "./state-changing-instruction-set-with-area-and-current-path";

export interface StateChangingInstructionSet extends InstructionSet{
    state: InfiniteCanvasState;
    initialState: InfiniteCanvasState;
    stateOfFirstInstruction: InfiniteCanvasState;
    setInitialState(previousState: InfiniteCanvasState): void;
    setInitialStateWithClippedPaths(previousState: InfiniteCanvasState): void;
    addClippedPath(clippedPath: StateChangingInstructionSetWithAreaAndCurrentPath): void;
}
