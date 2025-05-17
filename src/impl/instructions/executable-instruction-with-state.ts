import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { ExecutableStateChangingInstructionSet } from "../interfaces/executable-state-changing-instruction-set";
import { InstructionWithState } from "./instruction-with-state";
import { Instruction } from "./instruction";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export class ExecutableInstructionWithState extends InstructionWithState implements ExecutableStateChangingInstructionSet{
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState, protected instruction: Instruction, stateConversion: Instruction){
        super(initialState, state);
        this.stateConversion = stateConversion;
    }
    public execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle): void{
        if(this.stateConversion){
            this.stateConversion(context, rectangle);
        }
        this.instruction(context, rectangle);
    }
    public static create(state: InfiniteCanvasState, instruction: Instruction): ExecutableInstructionWithState{
        return new ExecutableInstructionWithState(state, state, instruction, () => {});
    }
}