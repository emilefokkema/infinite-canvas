import { StateChangingInstructionSequence } from "./state-changing-instruction-sequence";
import { InfiniteCanvasStateAndInstruction } from "./infinite-canvas-state-and-instruction";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";

export class InfiniteCanvasStatesAndInstructions extends StateChangingInstructionSequence<InfiniteCanvasStateAndInstruction>{
    constructor(initiallyWithState: InfiniteCanvasStateAndInstruction){
        super(initiallyWithState);
    }
    public static create(initialState: InfiniteCanvasState, initialInstruction: Instruction): InfiniteCanvasStatesAndInstructions{
        return new InfiniteCanvasStatesAndInstructions(new InfiniteCanvasStateAndInstruction(initialState, initialInstruction));
    }
}