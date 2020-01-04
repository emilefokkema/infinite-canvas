import { ViewBox } from "../interfaces/viewbox";

export class InfiniteCanvasTextDrawingStyles implements CanvasTextDrawingStyles{
	constructor(private readonly viewBox: ViewBox){}
	public set direction(value: CanvasDirection){
		this.viewBox.changeState(s => s.setDirection(value));
	}
	public set font(value: string){
		this.viewBox.changeState(s => s.setFont(value));
	}
	public set textAlign(value: CanvasTextAlign){
		this.viewBox.changeState(s => s.setTextAlign(value));
	}
	public set textBaseline(value: CanvasTextBaseline){
		this.viewBox.changeState(s => s.setTextBaseline(value));
	}
}