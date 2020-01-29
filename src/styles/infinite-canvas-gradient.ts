import {InfiniteCanvasFillStrokeStyle} from "./infinite-canvas-fill-stroke-style";
import { Transformation } from "../transformation";
import { Instruction } from "../instructions/instruction";

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
    public getInstructionToSetTransformed(propName: "fillStyle" | "strokeStyle"): Instruction{
        return (context: CanvasRenderingContext2D, transformation: Transformation) => {
            context[propName] = this.createTransformedGradient(transformation);
        };
    }
    public getInstructionToSetUntransformed(propName: "fillStyle" | "strokeStyle"): Instruction{
        return (context: CanvasRenderingContext2D) => {
            context[propName] = this.createGradient();
        };
    }
}