import {InfiniteCanvasFillStrokeStyle} from "./infinite-canvas-fill-stroke-style";
import { InstructionBuilder } from "./instruction-builders/instruction-builder";
import { Transformation } from "./transformation";

export abstract class InfiniteCanvasGradient extends InfiniteCanvasFillStrokeStyle implements CanvasGradient{
    private colorStops: {offset: number; color: string}[] = [];
    protected addColorStopsToGradient(gradient: CanvasGradient): void{
        for(const colorStop of this.colorStops){
            gradient.addColorStop(colorStop.offset, colorStop.color);
        }
    }
    protected abstract createTransformedGradient(transformation: Transformation): CanvasGradient;
    protected abstract createGradient(): CanvasGradient;
    public addColorStop(offset: number, color: string): void {
        this.colorStops.push({offset, color});
    }
    public applyToDrawingInstruction(drawingInstruction: InstructionBuilder, setFillOrStrokeStyle: (context: CanvasRenderingContext2D, fillOrStrokeStyle: string | CanvasGradient | CanvasPattern) => void, transform: boolean): void{
        if(transform){
            drawingInstruction.prepend((context: CanvasRenderingContext2D, transformation: Transformation) => {
                setFillOrStrokeStyle(context, this.createTransformedGradient(transformation));
            });
        }else{
            drawingInstruction.prepend((context: CanvasRenderingContext2D) => {
                setFillOrStrokeStyle(context, this.createGradient());
            });
        }
    }
}