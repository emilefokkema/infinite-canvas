import { ViewBox } from "../interfaces/viewbox";
import { Fill } from "./fill";
import { Clip } from "./clip";

export class InfiniteCanvasDrawPath implements CanvasDrawPath{
	constructor(private viewBox: ViewBox){}
	private isFillRule(pathOrFillRule: Path2D | CanvasFillRule): pathOrFillRule is CanvasFillRule{
		return pathOrFillRule === "evenodd" || pathOrFillRule === "nonzero";
	}
	public beginPath(): void{
		this.viewBox.beginPath();
	}
	public clip(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void{
		const instruction = this.isFillRule(pathOrFillRule) ?
			Clip.create(pathOrFillRule) :
			Clip.create();
		this.viewBox.clipPath(instruction);
	}
	public fill(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void{
		if((!pathOrFillRule || this.isFillRule(pathOrFillRule)) && !this.viewBox.currentPathCanBeFilled()){
			return;
		}
		const instruction = this.isFillRule(pathOrFillRule) ?
			Fill.create(pathOrFillRule) :
			Fill.create();
		this.viewBox.fillPath(instruction);
	}
	public isPointInPath(xOrPath: number | Path2D, xOry: number, yOrFillRule: number | CanvasFillRule, fillRule?: CanvasFillRule): boolean{return true;}
	public isPointInStroke(xOrPath: number | Path2D, xOry: number, y?:number): boolean{return true;}
	public stroke(path?: Path2D): void{
		this.viewBox.strokePath();
	}
}
