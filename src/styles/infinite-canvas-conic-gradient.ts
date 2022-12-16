import { Point } from "../geometry/point";
import { Transformation } from "../transformation";
import { InfiniteCanvasGradient } from "./infinite-canvas-gradient";

export class InfiniteCanvasConicGradient extends InfiniteCanvasGradient{
    constructor(
        private readonly context: CanvasRenderingContext2D,
        private readonly startAngle: number,
        private readonly x: number,
        private readonly y: number){
        super();
    }
    protected createTransformedGradient(transformation: Transformation): CanvasGradient{
        const {x: tx, y: ty} = transformation.apply(new Point(this.x, this.y));
        const angle = transformation.getRotationAngle();
        const gradient: CanvasGradient = this.context.createConicGradient(this.startAngle + angle, tx, ty);
        this.addColorStopsToGradient(gradient);
        return gradient;
    }
    protected createGradient(): CanvasGradient{
        const gradient: CanvasGradient = this.context.createConicGradient(this.startAngle, this.x, this.y);
        this.addColorStopsToGradient(gradient);
        return gradient;
    }
}