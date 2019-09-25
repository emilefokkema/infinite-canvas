import { DrawingInstruction } from "./drawing-instruction";
import { Rectangle } from "./rectangle";
import { Transformation } from "./transformation";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { ImmutablePathInstructionSet } from "./immutable-path-instruction-set";
import { Instruction } from "./instruction";
import { InfiniteCanvasDrawingInstruction } from "./infinite-canvas-drawing-instruction";

export class ClearRect implements DrawingInstruction{
    public area: Rectangle;
    constructor(
        public state: InfiniteCanvasState,
        public pathInstructions: ImmutablePathInstructionSet,
        private readonly x: number,
        private readonly y: number,
        private readonly width: number,
        private readonly height: number){
            this.area = new Rectangle(x, y, width, height);
    }
    public apply(context: CanvasRenderingContext2D, transformation: Transformation): void{
        context.save();
        context.setTransform(
            transformation.a,
            transformation.b,
            transformation.c,
            transformation.d,
            transformation.e,
            transformation.f
        );
        context.clearRect(this.x, this.y, this.width, this.height);
        context.restore();
    }
    public useLeadingInstructionsFrom(previousInstruction: DrawingInstruction): void{
        
    }
    public useAllLeadingInstructions(): void{
        
    }
}