import { StateChangingInstructionSet } from "../interfaces/state-changing-instruction-set";
import { Instruction } from "./instruction";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { StateChangingInstructionSetWithAreaAndCurrentPath } from "../interfaces/state-changing-instruction-set-with-area-and-current-path";
import { Transformation } from "../transformation";
export declare abstract class InstructionWithState implements StateChangingInstructionSet {
    initialState: InfiniteCanvasState;
    state: InfiniteCanvasState;
    protected stateConversion: Instruction;
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState);
    protected abstract executeInstruction(context: CanvasRenderingContext2D, transformation: Transformation): void;
    setInitialState(previousState: InfiniteCanvasState): void;
    get stateOfFirstInstruction(): InfiniteCanvasState;
    addClippedPath(clippedPath: StateChangingInstructionSetWithAreaAndCurrentPath): void;
    setInitialStateWithClippedPaths(previousState: InfiniteCanvasState): void;
    execute(context: CanvasRenderingContext2D, transformation: Transformation): void;
}
