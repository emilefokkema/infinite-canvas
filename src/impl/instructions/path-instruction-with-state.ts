import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { InstructionWithState } from "./instruction-with-state";
import { InstructionUsingInfinity } from "./instruction-using-infinity";
import { PreExecutableInstructionSet } from "../interfaces/pre-executable-instruction-set";
import { PathInfinityProvider } from "../interfaces/path-infinity-provider";
import { ExecutableStateChangingInstructionSet } from "../interfaces/executable-state-changing-instruction-set";
import { ExecutableInstructionWithState } from "./executable-instruction-with-state";

export class PathInstructionWithState extends InstructionWithState implements PreExecutableInstructionSet{
    constructor(initialState: InfiniteCanvasState, state: InfiniteCanvasState, private instruction: InstructionUsingInfinity, stateConversion: Instruction){
        super(initialState, state);
        this.stateConversion = stateConversion;
    }
    public replaceInstruction(instruction: InstructionUsingInfinity): void{
        this.instruction = instruction;
    }
    public makeExecutable(infinityProvider: PathInfinityProvider): ExecutableStateChangingInstructionSet{
        const infinity = infinityProvider.getInfinity(this.state);
        const oldInstruction = this.instruction;
        const newInstruction: Instruction = (ctx, rectangle) => oldInstruction(ctx, rectangle, infinity);
        return new ExecutableInstructionWithState(this.initialState, this.state, newInstruction, this.stateConversion);
    }
    public static create(initialState: InfiniteCanvasState, initialInstruction: InstructionUsingInfinity): PathInstructionWithState{
        return new PathInstructionWithState(initialState, initialState, initialInstruction, () => {});
    }
}