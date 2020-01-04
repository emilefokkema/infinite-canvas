import {InfiniteCanvasGradient} from "./infinite-canvas-gradient";
import {Transformation} from "./transformation";

export class InfiniteCanvasRadialGradient extends InfiniteCanvasGradient{
    constructor(
        private readonly context: CanvasRenderingContext2D,
        private readonly x0: number,
        private readonly y0: number,
        private readonly r0: number,
        private readonly x1: number,
        private readonly y1: number,
        private readonly r1: number) {
        super();
    }
    protected createTransformedGradient(transformation: Transformation): CanvasGradient{
        const {x: tx0, y: ty0} = transformation.apply({x: this.x0, y: this.y0});
        const {x: tx1, y: ty1} = transformation.apply({x: this.x1, y: this.y1});
        const tr0: number = this.r0 * transformation.scale;
        const tr1: number = this.r1 * transformation.scale;
        const gradient: CanvasGradient = this.context.createRadialGradient(tx0, ty0, tr0, tx1, ty1, tr1);
        this.addColorStopsToGradient(gradient);
        return gradient;
    }
    protected createGradient(): CanvasGradient{
        const gradient: CanvasGradient = this.context.createRadialGradient(this.x0, this.y0, this.r0, this.x1, this.y1, this.r1);
        this.addColorStopsToGradient(gradient);
        return gradient;
    }
}