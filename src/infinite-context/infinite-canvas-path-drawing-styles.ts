import { lineCap } from "../state/dimensions/line-cap";
import { lineJoin } from '../state/dimensions/line-join';
import { miterLimit } from '../state/dimensions/miter-limit';
import { ViewBox } from "../interfaces/viewbox";
import { lineWidth, lineDashOffset } from "../state/dimensions/infinite-canvas-transformable-scalar-state-instance-dimension";
import { lineDash } from "../state/dimensions/line-dash";

export class InfiniteCanvasPathDrawingStyles implements CanvasPathDrawingStyles{
	constructor(private viewBox: ViewBox){}
	public get lineCap(): CanvasLineCap{
		return this.viewBox.state.current.lineCap;
	}
	public set lineCap(value: CanvasLineCap){
		this.viewBox.changeState(state => lineCap.changeInstanceValue(state, value))
	}
	public get lineDashOffset(): number{
		return this.viewBox.state.current.lineDashOffset;
	}
	public set lineDashOffset(value: number){
		this.viewBox.changeState(state => lineDashOffset.changeInstanceValue(state, value));
	}
	public get lineJoin(): CanvasLineJoin{
		return this.viewBox.state.current.lineJoin;
	}
	public set lineJoin(value: CanvasLineJoin){
		this.viewBox.changeState(state => lineJoin.changeInstanceValue(state, value))
	}
	public get lineWidth(): number{
		return this.viewBox.state.current.lineWidth;
	}
	public set lineWidth(value: number){
		this.viewBox.changeState(state => lineWidth.changeInstanceValue(state, value));
	}
	public get miterLimit(): number{
		return this.viewBox.state.current.miterLimit;
	}
	public set miterLimit(value: number){
		this.viewBox.changeState(state => miterLimit.changeInstanceValue(state, value));
	}
	public getLineDash(): number[]{return this.viewBox.state.current.lineDash;}
	public setLineDash(segments: number[]): void{
		if(segments.length % 2 === 1){
			segments = segments.concat(segments);
		}
		this.viewBox.changeState(state => lineDash.changeInstanceValue(state, segments));
	}
}
