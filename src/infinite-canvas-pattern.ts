import { InfiniteCanvasFillStrokeStyle } from "./infinite-canvas-fill-stroke-style";
import { Transformation } from "./transformation";
import { Instruction } from "./instructions/instruction";

export class InfiniteCanvasPattern extends InfiniteCanvasFillStrokeStyle implements CanvasPattern{
    constructor(onNoLongerUsed: () => void, public readonly fillStrokeStyle: CanvasPattern){
        super(onNoLongerUsed);
    }
    public update(transformation: Transformation): void{
        
    }
    public setTransform(transform?: DOMMatrix2DInit): void {
        this.fillStrokeStyle.setTransform(transform);
    }
    public createInstruction(fillOrStrokeInstruction: Instruction): Instruction{
        return (context: CanvasRenderingContext2D, transformation: Transformation) => {
            const {a, b, c, d, e, f} = transformation;
            context.save();
            context.transform(a, b, c, d, e, f);
            fillOrStrokeInstruction(context, transformation);
            context.restore();
        };
    }
}