import { ViewBox } from "../interfaces/viewbox";
import { PathInstructions } from "../instructions/path-instructions";
import { Point } from "../geometry/point";

export class InfiniteCanvasPath implements CanvasPath{
	constructor(private viewBox: ViewBox){}
	public arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void{
		this.viewBox.addPathInstruction(PathInstructions.arc(x, y, radius, startAngle, endAngle, anticlockwise))
	}
	public arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void{
		this.viewBox.addPathInstruction(PathInstructions.arcTo(x1, y1, x2, y2, radius));
	}
	public bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void{}
	public closePath(): void{
		this.viewBox.closePath();
	}
	public ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void{
		this.viewBox.addPathInstruction(PathInstructions.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise));
	}
	public lineTo(_x: number, _y: number): void{
		this.viewBox.lineTo(new Point(_x, _y));
	}
	public lineToInfinityInDirection(x: number, y: number): void{
		this.viewBox.lineTo({direction: new Point(x, y)});
	}
	public moveTo(_x: number, _y: number): void{
		this.viewBox.moveTo(new Point(_x, _y));
	}
	public moveToInfinityInDirection(x: number, y: number): void{
		this.viewBox.moveTo({direction: new Point(x, y)});
	}
	public quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void{
		this.viewBox.addPathInstruction(PathInstructions.quadraticCurveTo(cpx, cpy, x, y));
	}

	public rect(x: number, y: number, w: number, h: number): void{
		this.viewBox.rect(x, y, w, h);
	}
}