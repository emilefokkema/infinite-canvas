import { StateAndInstruction } from "./state-and-instruction";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";

export class PathInstructionWithState extends StateAndInstruction{
    public copy(): PathInstructionWithState{
        return new PathInstructionWithState(this.initialState, this.state, this.instruction, this.combinedInstruction);
    }
    public static create(initialState: InfiniteCanvasState, initialInstruction: Instruction): PathInstructionWithState{
        return new PathInstructionWithState(initialState, initialState, initialInstruction, initialInstruction);
    }
}