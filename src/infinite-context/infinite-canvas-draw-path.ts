import { ViewBox } from "../interfaces/viewbox";

export class InfiniteCanvasDrawPath implements CanvasDrawPath{
	constructor(private viewBox: ViewBox){}
	public beginPath(): void{
		this.viewBox.beginPath();
	}
	public clip(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void{
		this.viewBox.clipPath((context: CanvasRenderingContext2D) => {
			context.clip();
		});
	}
	public fill(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void{
		this.viewBox.drawPath((context: CanvasRenderingContext2D) => {
			context.fill();
		}, state => state.fillStyle);
	}
	public isPointInPath(xOrPath: number | Path2D, xOry: number, yOrFillRule: number | CanvasFillRule, fillRule?: CanvasFillRule): boolean{return true;}
	public isPointInStroke(xOrPath: number | Path2D, xOry: number, y?:number): boolean{return true;}
	public stroke(path?: Path2D): void{
		this.viewBox.drawPath((context: CanvasRenderingContext2D) => {
			context.stroke();
		}, state => state.strokeStyle);
	}
}