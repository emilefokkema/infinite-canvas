import { ViewBox } from "../viewbox";
import { Transformation } from "../transformation";
import { drawRect } from "./draw-rect";
import { Rectangle } from "../rectangle";

export class InfiniteCanvasRect implements CanvasRect{
    constructor(private viewBox: ViewBox){}
	public clearRect(x: number, y: number, w: number, h: number): void{
        this.viewBox.clearArea(x, y, w, h);
        this.viewBox.addInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
            context.save();
            context.setTransform(
                transformation.a,
                transformation.b,
                transformation.c,
                transformation.d,
                transformation.e,
                transformation.f
            );
            context.clearRect(x, y, w, h);
            context.restore();
        });
    }
    public fillRect(x: number, y: number, w: number, h: number): void{
        this.viewBox.addInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
            context.beginPath();
            drawRect(x, y, w, h, context, transformation);
            context.fill();
        }, new Rectangle(x, y, w, h));
    }
    public strokeRect(x: number, y: number, w: number, h: number): void{
        this.viewBox.addInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
            context.beginPath();
            drawRect(x, y, w, h, context, transformation);
            context.stroke();
        }, new Rectangle(x, y, w, h));
    }
}