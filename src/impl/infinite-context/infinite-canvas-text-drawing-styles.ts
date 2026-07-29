import { ViewBox } from "../interfaces/viewbox";
import { direction } from "../state/dimensions/direction";
import { font } from "../state/dimensions/font";
import { fontKerning } from "../state/dimensions/font-kerning";
import { fontStretch } from "../state/dimensions/font-stretch";
import { fontVariantCaps } from "../state/dimensions/font-variant-caps";
import { letterSpacing } from "../state/dimensions/letter-spacing";
import { textAlign } from "../state/dimensions/text-align";
import { textBaseline } from "../state/dimensions/text-baseline";
import { textRendering } from "../state/dimensions/text-rendering";
import { wordSpacing } from "../state/dimensions/word-spacing";

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
	public set fontStretch(value: CanvasFontStretch) {
		this.viewBox.changeState(s => fontStretch.changeInstanceValue(s, value))
	}
	public set fontVariantCaps(value: CanvasFontVariantCaps) {
		this.viewBox.changeState(s => fontVariantCaps.changeInstanceValue(s, value))
	}
	public set letterSpacing(value: string) {
		this.viewBox.changeState(s => letterSpacing.changeInstanceValue(s, value))
	}
	public set textRendering(value: CanvasTextRendering) {
		this.viewBox.changeState(s => textRendering.changeInstanceValue(s, value))
	}
	public set wordSpacing(value: string) {
		this.viewBox.changeState(s => wordSpacing.changeInstanceValue(s, value))
	}
}