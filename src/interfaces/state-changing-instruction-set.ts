import { InstructionSet } from "./instruction-set";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { StateChangingInstructionSetWithCurrentStateAndArea } from "./state-changing-instruction-set-with-current-state-and-area";
import {StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState} from "./state-changing-instruction-set-with-area-and-current-path";

export interface StateChangingInstructionSet extends InstructionSet{
    readonly initialState: InfiniteCanvasState;
    changeToState(state: InfiniteCanvasState): void;
    setInitialState(newInitialState: InfiniteCanvasState): void;
    changeToStateWithClippedPaths(state: InfiniteCanvasState): void;
    addClippedPath(clippedPath: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState): void;
}