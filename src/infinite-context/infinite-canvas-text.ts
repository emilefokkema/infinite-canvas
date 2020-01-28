import { ViewBox } from "../interfaces/viewbox";
import { Rectangle } from "../rectangle";
import { Instruction } from "../instructions/instruction";
import { TransformationKind } from "../transformation-kind";

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
	private getDrawnRectangle(x: number, y: number, text: string): Rectangle{
		const measured: TextMetrics = this.viewBox.measureText(text);
		const width: number = Math.abs(measured.actualBoundingBoxRight - measured.actualBoundingBoxLeft);
		const height: number = measured.actualBoundingBoxAscent + measured.actualBoundingBoxDescent;
		return new Rectangle(x, y - measured.actualBoundingBoxAscent, width, height);
	}
}