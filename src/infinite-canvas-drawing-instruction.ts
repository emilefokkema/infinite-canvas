import { Transformation } from "./transformation";
import { Point } from "./point";
import { Rectangle } from "./rectangle";
import { DrawingInstruction } from "./drawing-instruction";

export class InfiniteCanvasDrawingInstruction implements DrawingInstruction{
    constructor(
        private readonly instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => void,
        private readonly predecessor?: DrawingInstruction,
        public area?: Point | Rectangle){
    }
    public apply(context: CanvasRenderingContext2D, transformation: Transformation): void{
        if(this.predecessor){
            this.predecessor.apply(context, transformation);
        }
        this.instruction(context, transformation);
    }
}