import { ViewBox } from "../interfaces/viewbox";
import { direction } from "../state/dimensions/direction";
import { font } from "../state/dimensions/font";
import { fontKerning } from "../state/dimensions/font-kerning";
import { textAlign } from "../state/dimensions/text-align";
import { textBaseline } from "../state/dimensions/text-baseline";

export class InfiniteCanvasTextDrawingStyles implements CanvasTextDrawingStyles{
	constructor(private readonly viewBox: ViewBox){}
	public set direction(value: CanvasDirection){
		this.viewBox.changeState(s => direction.changeInstanceValue(s, value));
	}
	public set font(value: string){
		this.viewBox.changeState(s => font.changeInstanceValue(s, value));
	}
	public set textAlign(value: CanvasTextAlign){
		this.viewBox.changeState(s => textAlign.changeInstanceValue(s, value));
	}
	public set textBaseline(value: CanvasTextBaseline){
		this.viewBox.changeState(s => textBaseline.changeInstanceValue(s, value));
	}
	public set fontKerning(value: CanvasFontKerning){
		this.viewBox.changeState(s => fontKerning.changeInstanceValue(s, value))
	}
}