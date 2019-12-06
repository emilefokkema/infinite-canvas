import {InfiniteCanvasState} from "../state/infinite-canvas-state";
import {Instruction} from "./instruction";
import {PathInstructionWithState} from "./path-instruction-with-state";

export class ClippingPathInstructionWithState extends PathInstructionWithState{
    constructor(initialState: InfiniteCanvasState, initialInstruction: Instruction, stateChangeInstruction: Instruction, currentState: InfiniteCanvasState, initialStateChangeInstruction: Instruction, stateForInstruction: InfiniteCanvasState) {
        super(initialState, initialInstruction, stateChangeInstruction, currentState, initialStateChangeInstruction, stateForInstruction);
    }
    public copy(): ClippingPathInstructionWithState{
        return new ClippingPathInstructionWithState(this.initialState, this.initialInstruction, this.stateChangeInstruction, this.state, this.initialStateChangeInstruction, this.stateForInstruction);
    }
    public static create(initialState: InfiniteCanvasState, initialInstruction: Instruction): ClippingPathInstructionWithState{
        return new ClippingPathInstructionWithState(initialState, initialInstruction, undefined, initialState, undefined, initialState);
    }
}