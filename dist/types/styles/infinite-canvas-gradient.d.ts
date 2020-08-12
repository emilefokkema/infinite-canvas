import { InfiniteCanvasFillStrokeStyle } from "./infinite-canvas-fill-stroke-style";
import { Transformation } from "../transformation";
import { Instruction } from "../instructions/instruction";
export declare abstract class InfiniteCanvasGradient extends InfiniteCanvasFillStrokeStyle implements CanvasGradient {
    private colorStops;
    protected addColorStopsToGradient(gradient: CanvasGradient): void;
    protected abstract createTransformedGradient(transformation: Transformation): CanvasGradient;
    protected abstract createGradient(): CanvasGradient;
    addColorStop(offset: number, color: string): void;
    getInstructionToSetTransformed(propName: "fillStyle" | "strokeStyle"): Instruction;
    getInstructionToSetUntransformed(propName: "fillStyle" | "strokeStyle"): Instruction;
}
