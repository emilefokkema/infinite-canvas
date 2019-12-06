import { Instruction } from "./instruction";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { StateAndInstruction } from "./state-and-instruction";

export class InfiniteCanvasStateAndInstruction extends StateAndInstruction{
    constructor(initialState: InfiniteCanvasState, initialInstruction: Instruction, stateChangeInstruction: Instruction, currentState: InfiniteCanvasState, initialStateChangeInstruction: Instruction, stateForInstruction: InfiniteCanvasState){
        super(initialState, initialInstruction, stateChangeInstruction, currentState, initialStateChangeInstruction, stateForInstruction);
    }
    public copy(): InfiniteCanvasStateAndInstruction{
        return new InfiniteCanvasStateAndInstruction(this.initialState, this.initialInstruction, this.stateChangeInstruction, this.state, this.initialStateChangeInstruction, this.stateForInstruction);
    }
    public static create(initialState: InfiniteCanvasState, initialInstruction: Instruction): InfiniteCanvasStateAndInstruction{
        return new InfiniteCanvasStateAndInstruction(initialState, initialInstruction, undefined, initialState, undefined, initialState);
    }
}