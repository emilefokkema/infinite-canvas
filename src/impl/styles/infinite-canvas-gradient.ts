import {InfiniteCanvasFillStrokeStyle} from "./infinite-canvas-fill-stroke-style";
import { Transformation } from "../transformation";
import { Instruction, MinimalInstruction } from "../instructions/instruction";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

class SetTransformedGradient implements Instruction {
    constructor(
        private readonly propName: "fillStyle" | "strokeStyle",
        private readonly gradient: InfiniteCanvasGradient){}

   execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle): void {
        const transformation = rectangle.userTransformation;
        context[this.propName] = this.gradient.createTransformedGradient(transformation);
   }
}

class SetUntransformedGradient implements MinimalInstruction {
    constructor(
        private readonly propName: "fillStyle" | "strokeStyle",
        private readonly gradient: InfiniteCanvasGradient){}

   execute(context: CanvasRenderingContext2D): void {
        context[this.propName] = this.gradient.createGradient();
   }
}

export abstract class InfiniteCanvasGradient extends InfiniteCanvasFillStrokeStyle implements CanvasGradient{
    private colorStops: {offset: number; color: string}[] = [];
    protected addColorStopsToGradient(gradient: CanvasGradient): void{
        for(const colorStop of this.colorStops){
            gradient.addColorStop(colorStop.offset, colorStop.color);
        }
    }
    public abstract createTransformedGradient(transformation: Transformation): CanvasGradient;
    public abstract createGradient(): CanvasGradient;
    public addColorStop(offset: number, color: string): void {
        this.colorStops.push({offset, color});
    }
    public getInstructionToSetTransformed(propName: "fillStyle" | "strokeStyle"): Instruction{
        return new SetTransformedGradient(propName, this);
    }
    public getInstructionToSetUntransformed(propName: "fillStyle" | "strokeStyle"): Instruction{
        return new SetUntransformedGradient(propName, this);
    }
}