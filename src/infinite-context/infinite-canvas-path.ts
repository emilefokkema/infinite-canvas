import { ViewBox } from "../viewbox";
import { Transformation } from "../transformation";
import { drawRect } from "./draw-rect";
import { Rectangle } from "../rectangle";
import { Point } from "../point";

export class InfiniteCanvasPath implements CanvasPath{
	constructor(private viewBox: ViewBox){}
	public arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void{}
	public arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void{}
	public bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void{}
	public closePath(): void{
		this.viewBox.closeArea();
		this.viewBox.addInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
			context.closePath();
		});
	}
	public ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void{}
	public lineTo(_x: number, _y: number): void{
		const point: Point = {x: _x, y: _y};
		this.viewBox.addInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
			const {x, y} = transformation.apply(point);
			context.lineTo(x, y);
		}, point);
	}
	public moveTo(_x: number, _y: number): void{
		const point: Point = {x: _x, y: _y};
		this.viewBox.addInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
			const {x, y} = transformation.apply(point);
			context.moveTo(x, y);
		}, point);
	}
	public quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void{}

	public rect(x: number, y: number, w: number, h: number): void{
		this.viewBox.addInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
			drawRect(x, y, w, h, context, transformation);
		}, new Rectangle(x, y, w, h));
	}
}