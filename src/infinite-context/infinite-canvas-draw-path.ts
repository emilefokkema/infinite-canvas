import { ViewBox } from "../interfaces/viewbox";
import {Instruction} from "../instructions/instruction";

export class InfiniteCanvasDrawPath implements CanvasDrawPath{
	constructor(private viewBox: ViewBox){}
	private isFillRule(pathOrFillRule: Path2D | CanvasFillRule): pathOrFillRule is CanvasFillRule{
		return pathOrFillRule === "evenodd" || pathOrFillRule === "nonzero";
	}
	public beginPath(): void{
		this.viewBox.beginPath();
	}
	public clip(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void{
		let instruction: Instruction = this.isFillRule(pathOrFillRule) ?
			(context: CanvasRenderingContext2D) => {
				context.clip(pathOrFillRule);
			} :
			(context: CanvasRenderingContext2D) => {
				context.clip();
			};
		this.viewBox.clipPath(instruction);
	}
	public fill(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void{
		let instruction: Instruction = this.isFillRule(pathOrFillRule) ?
			(context: CanvasRenderingContext2D) => {
				context.fill(pathOrFillRule);
			} :
			(context: CanvasRenderingContext2D) => {
				context.fill();
			};
		this.viewBox.drawPath(instruction);
	}
	public isPointInPath(xOrPath: number | Path2D, xOry: number, yOrFillRule: number | CanvasFillRule, fillRule?: CanvasFillRule): boolean{return true;}
	public isPointInStroke(xOrPath: number | Path2D, xOry: number, y?:number): boolean{return true;}
	public stroke(path?: Path2D): void{
		let instruction: Instruction = (context: CanvasRenderingContext2D) => {
			context.stroke();
		};
		this.viewBox.drawPath(instruction);
	}
}