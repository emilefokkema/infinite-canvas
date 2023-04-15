import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { InstructionWithState } from "./instruction-with-state";
import { InstructionUsingInfinity } from "./instruction-using-infinity";
import { CopyableInstructionSet } from "../interfaces/copyable-instruction-set";
import { PathInfinityProvider } from "../interfaces/path-infinity-provider";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";
import { ExecutableStateChangingInstructionSet } from "../interfaces/executable-state-changing-instruction-set";
import { ExecutableInstructionWithState } from "./executable-instruction-with-state";

export class PathInstructionWithState extends InstructionWithState implements CopyableInstructionSet{
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState, private instruction: InstructionUsingInfinity, stateConversion: Instruction, rectangle: CanvasRectangle){
        super(initialState, state, rectangle);
        this.stateConversion = stateConversion;
    }
    public replaceInstruction(instruction: InstructionUsingInfinity): void{
        this.instruction = instruction;
    }
    public copy(): PathInstructionWithState {
        return new PathInstructionWithState(this.initialState, this.state, this.instruction, this.stateConversion, this.rectangle);
    }
    public makeExecutable(infinityProvider: PathInfinityProvider): ExecutableStateChangingInstructionSet{
        const infinity = infinityProvider.getInfinity(this.state);
        const oldInstruction = this.instruction;
        const newInstruction: Instruction = (ctx, transformation) => oldInstruction(ctx, transformation, infinity);
        return new ExecutableInstructionWithState(this.initialState, this.state, newInstruction, this.stateConversion, this.rectangle);
    }
    public static create(initialState: InfiniteCanvasState, initialInstruction: InstructionUsingInfinity, rectangle: CanvasRectangle): PathInstructionWithState{
        return new PathInstructionWithState(initialState, initialState, initialInstruction, () => {}, rectangle);
    }
}