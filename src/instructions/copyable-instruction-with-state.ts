import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { CopyableInstructionSet } from "../interfaces/copyable-instruction-set";
import { InstructionWithState } from "./instruction-with-state";
import { Instruction } from "./instruction";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";
import { ExecutableStateChangingInstructionSet } from "../interfaces/executable-state-changing-instruction-set";
import { ExecutableInstructionWithState } from "./executable-instruction-with-state";

export class CopyableInstructionWithState extends InstructionWithState implements CopyableInstructionSet{
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState, protected instruction: Instruction, stateConversion: Instruction, rectangle: CanvasRectangle){
        super(initialState, state, rectangle);
        this.stateConversion = stateConversion;
    }
    public copy(): CopyableInstructionWithState{
        return new CopyableInstructionWithState(this.initialState, this.state, this.instruction, this.stateConversion, this.rectangle);
    }
    public makeExecutable(): ExecutableStateChangingInstructionSet{
        return new ExecutableInstructionWithState(this.initialState, this.state, this.instruction, this.stateConversion, this.rectangle);
    }
    public static create(state: InfiniteCanvasState, instruction: Instruction, rectangle: CanvasRectangle): CopyableInstructionWithState{
        return new CopyableInstructionWithState(state, state, instruction, () => {}, rectangle);
    }
}