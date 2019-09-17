import { ViewBox } from "../viewbox";
import { Transformation } from "../transformation";

export class InfiniteCanvasDrawPath implements CanvasDrawPath{
	constructor(private viewBox: ViewBox){}
	public beginPath(): void{
		this.viewBox.beginArea();
		this.viewBox.addInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
			context.beginPath();
		});
	}
	public clip(pathOrFillRule: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void{}
	public fill(pathOrFillRule: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void{
		this.viewBox.addInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
			context.fill();
		});
	}
	public isPointInPath(xOrPath: number | Path2D, xOry: number, yOrFillRule: number | CanvasFillRule, fillRule?: CanvasFillRule): boolean{return true;}
	public isPointInStroke(xOrPath: number | Path2D, xOry: number, y?:number): boolean{return true;}
	public stroke(path?: Path2D): void{
		this.viewBox.addInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
			context.stroke();
		});
	}
}