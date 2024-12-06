import { ViewBox } from "../interfaces/viewbox";
import { Instruction } from "../instructions/instruction";
import { TransformationKind } from "../transformation-kind";
import {Area} from "../areas/area";
import { getRectStrategy } from "../rect/get-rect-strategy";

export class InfiniteCanvasText implements CanvasText{
	constructor(private readonly viewBox: ViewBox){}
	public fillText(text: string, x: number, y: number, maxWidth?: number): void{
		let drawingInstruction: Instruction = maxWidth === undefined ? (context: CanvasRenderingContext2D) => {
			context.fillText(text, x, y);
		}: (context: CanvasRenderingContext2D) => {
			context.fillText(text, x, y, maxWidth);
		};
		this.viewBox.addDrawing(drawingInstruction, this.getDrawnRectangle(x, y, text), TransformationKind.Relative, true);
	}
	public measureText(text: string): TextMetrics{return this.viewBox.measureText(text);}
	public strokeText(text: string, x: number, y: number, maxWidth?: number): void{
		let drawingInstruction: Instruction = maxWidth === undefined ? (context: CanvasRenderingContext2D) => {
			context.strokeText(text, x, y);
		}: (context: CanvasRenderingContext2D) => {
			context.strokeText(text, x, y, maxWidth);
		};
		this.viewBox.addDrawing(drawingInstruction, this.getDrawnRectangle(x, y, text), TransformationKind.Relative, true);
	}
	private getDrawnRectangle(x: number, y: number, text: string): Area{
		const measured: TextMetrics = this.viewBox.measureText(text);
		let width: number;
		if(measured.actualBoundingBoxRight !== undefined){
			width = Math.abs(measured.actualBoundingBoxRight - measured.actualBoundingBoxLeft);
		}else{
			width = measured.width;
		}
		const height: number = measured.actualBoundingBoxAscent !== undefined ? measured.actualBoundingBoxAscent + measured.actualBoundingBoxDescent : 1;
		const ascent: number = measured.actualBoundingBoxAscent !== undefined ? measured.actualBoundingBoxAscent : 0;
		return getRectStrategy(x, y - ascent, width, height).getArea();
	}
}