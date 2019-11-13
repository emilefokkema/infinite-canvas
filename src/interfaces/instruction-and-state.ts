import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "../instructions/instruction";

export interface InstructionAndState{
    instruction: Instruction;
    state: InfiniteCanvasState;
}