import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";
import { StateAndInstruction } from "./state-and-instruction";

export class PathInstructionWithState extends StateAndInstruction{
    constructor(initialState: InfiniteCanvasState, initialInstruction: Instruction, public drawsPath: boolean, public clipsPath: boolean, stateChangeInstruction?: Instruction, currentState?: InfiniteCanvasState){
        super(initialState, initialInstruction, stateChangeInstruction, currentState);
    }
    public copy(): PathInstructionWithState{
        return new PathInstructionWithState(this.initialState, this.initialInstruction, this.drawsPath, this.clipsPath, this.stateChangeInstruction, this.state);
    }
}