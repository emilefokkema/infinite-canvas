import { ViewBox } from "../interfaces/viewbox";
import { lineWidth } from "../state/dimensions/line-width";
import { lineDash } from "../state/dimensions/line-dash";
import { lineDashOffset } from "../state/dimensions/line-dash-offset";

export class InfiniteCanvasPathDrawingStyles implements CanvasPathDrawingStyles{
	constructor(private viewBox: ViewBox){}
	public lineCap: CanvasLineCap;
	public get lineDashOffset(): number{
		return this.viewBox.state.current.lineDashOffset;
	}
	public set lineDashOffset(value: number){
		this.viewBox.changeState(state => lineDashOffset.changeInstanceValue(state, value));
	}
	public lineJoin: CanvasLineJoin;
	public get lineWidth(): number{
		return this.viewBox.state.current.lineWidth;
	}
	public set lineWidth(value: number){
		this.viewBox.changeState(state => lineWidth.changeInstanceValue(state, value));
	}
	public miterLimit: number;
	public getLineDash(): number[]{return this.viewBox.state.current.lineDash;}
	public setLineDash(segments: number[]): void{
		this.viewBox.changeState(state => lineDash.changeInstanceValue(state, segments));
	}
}