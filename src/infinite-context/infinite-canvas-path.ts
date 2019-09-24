import { ViewBox } from "../viewbox";

export class InfiniteCanvasPath implements CanvasPath{
	constructor(private viewBox: ViewBox){}
	public arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void{
		this.viewBox.addToPath(path => path.arc(x, y, radius, startAngle, endAngle, anticlockwise));
	}
	public arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void{
		this.viewBox.addToPath(path => path.arcTo(x1, y1, x2, y2, radius));
	}
	public bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void{}
	public closePath(): void{
		this.viewBox.addToPath(path => path.closePath());
	}
	public ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void{}
	public lineTo(_x: number, _y: number): void{
		this.viewBox.addToPath(path => path.lineTo(_x, _y));
	}
	public moveTo(_x: number, _y: number): void{
		this.viewBox.addToPath(path => path.moveTo(_x, _y));
	}
	public quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void{}

	public rect(x: number, y: number, w: number, h: number): void{
		this.viewBox.addToPath(path => path.rect(x, y, w, h));
	}
}