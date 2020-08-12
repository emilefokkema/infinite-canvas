import { Transformation } from "../transformation";
import { InfiniteCanvasGradient } from "./infinite-canvas-gradient";
export declare class InfiniteCanvasLinearGradient extends InfiniteCanvasGradient {
    private readonly context;
    private readonly x0;
    private readonly y0;
    private readonly x1;
    private readonly y1;
    constructor(context: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number);
    protected createTransformedGradient(transformation: Transformation): CanvasGradient;
    protected createGradient(): CanvasGradient;
}
