import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { PreExecutableInstructionSet } from "../interfaces/pre-executable-instruction-set";
import { InstructionWithState } from "./instruction-with-state";
import { Instruction } from "./instruction";
import { ExecutableStateChangingInstructionSet } from "../interfaces/executable-state-changing-instruction-set";
import { ExecutableInstructionWithState } from "./executable-instruction-with-state";

export class PreExecutableInstructionWithState extends InstructionWithState implements PreExecutableInstructionSet{
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState, protected instruction: Instruction, stateConversion: Instruction){
        super(initialState, state);
        this.stateConversion = stateConversion;
    }
    public makeExecutable(): ExecutableStateChangingInstructionSet{
        return new ExecutableInstructionWithState(this.initialState, this.state, this.instruction, this.stateConversion);
    }
    public static create(state: InfiniteCanvasState, instruction: Instruction): PreExecutableInstructionWithState{
        return new PreExecutableInstructionWithState(state, state, instruction, () => {});
    }
}