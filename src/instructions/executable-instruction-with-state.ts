import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { ExecutableStateChangingInstructionSet } from "../interfaces/executable-state-changing-instruction-set";
import { InstructionWithState } from "./instruction-with-state";
import { Instruction } from "./instruction";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";
import { Transformation } from "../transformation";

export class ExecutableInstructionWithState extends InstructionWithState implements ExecutableStateChangingInstructionSet{
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState, protected instruction: Instruction, stateConversion: Instruction, rectangle: CanvasRectangle){
        super(initialState, state, rectangle);
        this.stateConversion = stateConversion;
    }
    public execute(context: CanvasRenderingContext2D, transformation: Transformation): void{
        if(this.stateConversion){
            this.stateConversion(context, transformation);
        }
        this.instruction(context, transformation);
    }
    public static create(state: InfiniteCanvasState, instruction: Instruction, rectangle: CanvasRectangle): ExecutableInstructionWithState{
        return new ExecutableInstructionWithState(state, state, instruction, () => {}, rectangle);
    }
}