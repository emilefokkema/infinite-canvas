import { DrawingInstruction } from "./drawing-instruction";
import { Rectangle } from "./rectangle";
import { Transformation } from "./transformation";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { ImmutablePathInstructionSet } from "./immutable-path-instruction-set";
import { Instruction } from "./instruction";
import { InfiniteCanvasDrawingInstruction } from "./infinite-canvas-drawing-instruction";

export class ClearRect extends InfiniteCanvasDrawingInstruction{
    public area: Rectangle;
    constructor(
        state: InfiniteCanvasState,
        pathInstructions: ImmutablePathInstructionSet,
        private readonly x: number,
        private readonly y: number,
        private readonly width: number,
        private readonly height: number){
            super(state, pathInstructions, (context: CanvasRenderingContext2D, transformation: Transformation) => {
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
            });
            this.area = new Rectangle(x, y, width, height);
    }
}