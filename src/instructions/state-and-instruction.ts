import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { Transformation } from "../transformation";
import { InstructionWithState } from "./instruction-with-state";
import { CopyableInstructionSet } from "../interfaces/copyable-instruction-set";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export class StateAndInstruction extends InstructionWithState implements CopyableInstructionSet{
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState, protected instruction: Instruction, stateConversion: Instruction, rectangle: CanvasRectangle){
        super(initialState, state, rectangle);
        this.stateConversion = stateConversion;
    }
    protected executeInstruction(context: CanvasRenderingContext2D, transformation: Transformation): void{
        this.instruction(context, transformation);
    }
    public copy(): StateAndInstruction{
        return new StateAndInstruction(this.initialState, this.state, this.instruction, this.stateConversion, this.rectangle);
    }
    public static create(state: InfiniteCanvasState, instruction: Instruction, rectangle: CanvasRectangle): StateAndInstruction{
        return new StateAndInstruction(state, state, instruction, () => {}, rectangle);
    }
}
