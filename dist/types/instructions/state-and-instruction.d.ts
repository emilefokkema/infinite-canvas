import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { Transformation } from "../transformation";
import { InstructionWithState } from "./instruction-with-state";
import { CopyableInstructionSet } from "../interfaces/copyable-instruction-set";
export declare class StateAndInstruction extends InstructionWithState implements CopyableInstructionSet {
    protected instruction: Instruction;
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState, instruction: Instruction, stateConversion: Instruction);
    protected executeInstruction(context: CanvasRenderingContext2D, transformation: Transformation): void;
    copy(): StateAndInstruction;
    static create(state: InfiniteCanvasState, instruction: Instruction): StateAndInstruction;
}
