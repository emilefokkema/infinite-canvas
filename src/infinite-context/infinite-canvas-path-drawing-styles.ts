import { ViewBox } from "../viewbox";
import { Transformation } from "../transformation";

export class InfiniteCanvasPathDrawingStyles implements CanvasPathDrawingStyles{
	constructor(private viewBox: ViewBox){}
	public lineCap: CanvasLineCap;
	public lineDashOffset: number;
	public lineJoin: CanvasLineJoin;
	public get lineWidth(): number{
		return this.viewBox.lineWidth;
	}
	public set lineWidth(value: number){
		this.viewBox.lineWidth = value;
		this.viewBox.addInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
			context.lineWidth = value * transformation.scale;
		});
	}
	public miterLimit: number;
	public getLineDash(): number[]{return this.viewBox.lineDash;}
	public setLineDash(segments: number[]): void{
		this.viewBox.lineDash = segments;
		this.viewBox.addInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
			context.setLineDash(segments.map(s => s * transformation.scale));
		});
	}
}