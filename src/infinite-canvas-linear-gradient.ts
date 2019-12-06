import {Transformation} from "./transformation";
import {InfiniteCanvasGradient} from "./infinite-canvas-gradient";

export class InfiniteCanvasLinearGradient extends InfiniteCanvasGradient{
    constructor(
        onNoLongerUsed: () => void,
        private readonly context: CanvasRenderingContext2D,
        private readonly x0: number,
        private readonly y0: number,
        private readonly x1: number,
        private readonly y1: number) {
        super(onNoLongerUsed);
    }
    public update(transformation: Transformation): void{
        const {x: tx0, y: ty0} = transformation.apply({x: this.x0, y: this.y0});
        const {x: tx1, y: ty1} = transformation.apply({x: this.x1, y: this.y1});
        this.gradient = this.context.createLinearGradient(tx0, ty0, tx1, ty1);
        this.addColorStops();
    }
}