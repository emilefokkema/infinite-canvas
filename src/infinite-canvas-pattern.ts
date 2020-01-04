import { InfiniteCanvasFillStrokeStyle } from "./infinite-canvas-fill-stroke-style";
import { InstructionBuilder } from "./instruction-builders/instruction-builder";

export class InfiniteCanvasPattern extends InfiniteCanvasFillStrokeStyle implements CanvasPattern{
    constructor(private readonly fillStrokeStyle: CanvasPattern){
        super();
    }
    public setTransform(transform?: DOMMatrix2DInit): void {
        this.fillStrokeStyle.setTransform(transform);
    }
    public applyToDrawingInstruction(drawingInstruction: InstructionBuilder, setFillOrStrokeStyle: (context: CanvasRenderingContext2D, fillOrStrokeStyle: string | CanvasGradient | CanvasPattern) => void, transform: boolean): void{
        drawingInstruction.prepend((context: CanvasRenderingContext2D) => {
            setFillOrStrokeStyle(context, this.fillStrokeStyle);
        });
        if(transform){
            drawingInstruction.transformRelative();
        }
    }
}