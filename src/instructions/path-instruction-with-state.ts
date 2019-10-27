import { InfiniteCanvasStateAndInstruction } from "./infinite-canvas-state-and-instruction";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { Instruction } from "./instruction";

export class PathInstructionWithState extends InfiniteCanvasStateAndInstruction{
    constructor(initialState: InfiniteCanvasState, initialInstruction: Instruction, public drawsPath: boolean){
        super(initialState, initialInstruction);
    }
    public copy(): PathInstructionWithState{
        const result: PathInstructionWithState = new PathInstructionWithState(this.initialState, this.initialInstruction, this.drawsPath);
        result.changeToState(this.state);
        return result;
    }
}