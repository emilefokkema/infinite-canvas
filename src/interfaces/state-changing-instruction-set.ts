import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { InstructionsToClip } from "./instructions-to-clip";
import { StateChange } from "./state-change";

export interface StateChangingInstructionSet extends StateChange{
    stateOfFirstInstruction: InfiniteCanvasState;
    setInitialState(previousState: InfiniteCanvasState): void;
    setInitialStateWithClippedPaths(previousState: InfiniteCanvasState): void;
    addClippedPath(clippedPath: InstructionsToClip): void;
}