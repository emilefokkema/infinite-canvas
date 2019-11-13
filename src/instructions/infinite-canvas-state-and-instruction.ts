import { Instruction } from "./instruction";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { StateAndInstruction } from "./state-and-instruction";

export class InfiniteCanvasStateAndInstruction extends StateAndInstruction{
    constructor(initialState: InfiniteCanvasState, initialInstruction: Instruction, stateChangeInstruction?: Instruction, currentState?: InfiniteCanvasState){
        super(initialState, initialInstruction, stateChangeInstruction, currentState);
    }
    public copy(): InfiniteCanvasStateAndInstruction{
        return new InfiniteCanvasStateAndInstruction(this.initialState, this.initialInstruction, this.stateChangeInstruction, this.state);
    }
}