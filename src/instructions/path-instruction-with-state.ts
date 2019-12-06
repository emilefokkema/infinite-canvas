import {StateAndInstruction} from "./state-and-instruction";
import {InfiniteCanvasState} from "../state/infinite-canvas-state";
import {Instruction} from "./instruction";

export class PathInstructionWithState extends StateAndInstruction{
    constructor(
        initialState: InfiniteCanvasState,
        initialInstruction: Instruction,
        stateChangeInstruction: Instruction,
        currentState: InfiniteCanvasState,
        initialStateChangeInstruction: Instruction,
        stateForInstruction: InfiniteCanvasState){
        super(initialState, initialInstruction, stateChangeInstruction, currentState, initialStateChangeInstruction, stateForInstruction);
    }

    public copy(): PathInstructionWithState{
        return new PathInstructionWithState(this.initialState, this.initialInstruction, this.stateChangeInstruction, this.state, this.initialStateChangeInstruction, this.stateForInstruction);
    }
    public static create(initialState: InfiniteCanvasState, initialInstruction: Instruction): PathInstructionWithState{
        return new PathInstructionWithState(initialState, initialInstruction, undefined, initialState, undefined, initialState);
    }
}