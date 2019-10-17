import { InfiniteCanvasStateAndInstruction } from "./infinite-canvas-state-and-instruction";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { InfiniteCanvasStateInstance } from "../state/infinite-canvas-state-instance";
import { Instruction } from "./instruction";
import { Transformation } from "../transformation";

export class DefaultInstructionsWithState extends InfiniteCanvasStateAndInstruction{
    private defaultInstruction: Instruction = InfiniteCanvasStateInstance.setDefault;
    constructor(){
        super(InfiniteCanvasState.default);
    }
    public execute(context: CanvasRenderingContext2D, transformation: Transformation){
        this.defaultInstruction(context, transformation);
        super.execute(context, transformation);
    }
}