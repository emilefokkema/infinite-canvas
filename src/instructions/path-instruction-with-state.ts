import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { InstructionWithState } from "./instruction-with-state";
import { InstructionUsingInfinity } from "./instruction-using-infinity";
import { Transformation } from "../transformation";
import { ViewboxInfinity } from "../interfaces/viewbox-infinity";
import { CopyableInstructionSet } from "../interfaces/copyable-instruction-set";
import { PathInfinityProvider } from "../interfaces/path-infinity-provider";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export class PathInstructionWithState extends InstructionWithState implements CopyableInstructionSet{
    constructor(initialState: InfiniteCanvasState, private infinity: ViewboxInfinity, state: InfiniteCanvasState, private instruction: InstructionUsingInfinity, stateConversion: Instruction, rectangle: CanvasRectangle){
        super(initialState, state, rectangle);
        this.stateConversion = stateConversion;
    }
    protected executeInstruction(context: CanvasRenderingContext2D, transformation: Transformation): void{
        this.instruction(context, transformation, this.infinity);
    }
    public replaceInstruction(instruction: InstructionUsingInfinity): void{
        this.instruction = instruction;
    }
    public copy(pathInfinityProvider: PathInfinityProvider): PathInstructionWithState{
        return new PathInstructionWithState(this.initialState, pathInfinityProvider.getInfinity(this.state), this.state, this.instruction, this.stateConversion, this.rectangle);
    }
    public static create(initialState: InfiniteCanvasState, infinity: ViewboxInfinity, initialInstruction: InstructionUsingInfinity, rectangle: CanvasRectangle): PathInstructionWithState{
        return new PathInstructionWithState(initialState, infinity, initialState, initialInstruction, () => {}, rectangle);
    }
}