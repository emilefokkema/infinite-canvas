import { StateChangingInstructionSequence } from "./state-changing-instruction-sequence";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { StateAndInstruction } from "./state-and-instruction";

export class InfiniteCanvasStatesAndInstructions extends StateChangingInstructionSequence<StateAndInstruction>{
    constructor(initiallyWithState: StateAndInstruction){
        super(initiallyWithState);
    }
    public static create(initialState: InfiniteCanvasState, initialInstruction: Instruction): InfiniteCanvasStatesAndInstructions{
        return new InfiniteCanvasStatesAndInstructions(StateAndInstruction.create(initialState, initialInstruction));
    }
}