import {PathInstructionWithState} from "./path-instruction-with-state";
import {InfiniteCanvasState} from "../state/infinite-canvas-state";
import {Instruction} from "./instruction";
import {Rectangle} from "../rectangle";

export class DrawingPathInstructionWithState extends PathInstructionWithState{
    constructor(
        initialState: InfiniteCanvasState,
        initialInstruction: Instruction,
        stateChangeInstruction: Instruction,
        currentState: InfiniteCanvasState,
        initialStateChangeInstruction: Instruction,
        stateForInstruction: InfiniteCanvasState,
        public drawnArea: Rectangle,
        private onDestroy?: () => void) {
        super(initialState, initialInstruction, stateChangeInstruction, currentState, initialStateChangeInstruction, stateForInstruction);
    }
    public destroy(): void {
        super.destroy();
        if(this.onDestroy){
            this.onDestroy();
        }
    }
    public copy(): DrawingPathInstructionWithState{
        return new DrawingPathInstructionWithState(this.initialState, this.initialInstruction, this.stateChangeInstruction, this.state, this.initialStateChangeInstruction, this.stateForInstruction, this.drawnArea, this.onDestroy);
    }
    public static createDrawing(initialState: InfiniteCanvasState, initialInstruction: Instruction, drawnArea: Rectangle, onDestroy?: () => void): DrawingPathInstructionWithState{
        return new DrawingPathInstructionWithState(initialState, initialInstruction, undefined, initialState, undefined, initialState, drawnArea, onDestroy);
    }
}