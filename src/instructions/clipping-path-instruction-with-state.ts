import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { PathInstructionWithState } from "./path-instruction-with-state";

export class ClippingPathInstructionWithState extends PathInstructionWithState{
    public copy(): ClippingPathInstructionWithState{
        return new ClippingPathInstructionWithState(this.initialState, this.state, this.instruction, this.combinedInstruction);
    }
    public static create(initialState: InfiniteCanvasState, initialInstruction: Instruction): ClippingPathInstructionWithState{
        return new ClippingPathInstructionWithState(initialState, initialState, initialInstruction, initialInstruction);
    }
}