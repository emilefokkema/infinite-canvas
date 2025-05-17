import { ViewBox } from "../interfaces/viewbox";
import { shadowColor } from "../state/dimensions/shadow-color";
import { Point } from "../geometry/point";
import { shadowOffset } from "../state/dimensions/shadow-offset";
import { shadowBlur } from "../state/dimensions/shadow-blur";

export class InfiniteCanvasShadowStyles implements CanvasShadowStyles{
    constructor(private readonly viewBox: ViewBox){}
    public get shadowBlur(): number{
		return this.viewBox.state.current.shadowBlur;
	}
	public set shadowBlur(value: number){
		this.viewBox.changeState(state => shadowBlur.changeInstanceValue(state, value));
    }
    public get shadowOffsetX(): number{
		return this.viewBox.state.current.shadowOffset.x;
	}
	public set shadowOffsetX(value: number){
		const newShadowOffset: Point = new Point(value, this.viewBox.state.current.shadowOffset.y);
		this.viewBox.changeState(state => shadowOffset.changeInstanceValue(state, newShadowOffset));
    }
    public get shadowOffsetY(): number{
		return this.viewBox.state.current.shadowOffset.y;
	}
	public set shadowOffsetY(value: number){
		const newShadowOffset: Point = new Point(this.viewBox.state.current.shadowOffset.x, value);
		this.viewBox.changeState(state => shadowOffset.changeInstanceValue(state, newShadowOffset));
	}
	public get shadowColor(): string{
		return this.viewBox.state.current.shadowColor;
	}
	public set shadowColor(value: string){
		this.viewBox.changeState(state => shadowColor.changeInstanceValue(state, value));
	}
}