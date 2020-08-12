import { InfiniteCanvasGradient } from "./infinite-canvas-gradient";
import { Transformation } from "../transformation";
export declare class InfiniteCanvasRadialGradient extends InfiniteCanvasGradient {
    private readonly context;
    private readonly x0;
    private readonly y0;
    private readonly r0;
    private readonly x1;
    private readonly y1;
    private readonly r1;
    constructor(context: CanvasRenderingContext2D, x0: number, y0: number, r0: number, x1: number, y1: number, r1: number);
    protected createTransformedGradient(transformation: Transformation): CanvasGradient;
    protected createGradient(): CanvasGradient;
}
