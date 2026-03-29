import { ViewBox } from "../interfaces/viewbox";
import { sliceImageData } from "./slice-image-data";
import { MinimalInstruction } from "../instructions/instruction";
import { DrawingLock } from "../drawing-lock";
import { TransformationKind } from "../transformation-kind";
import { InfiniteCanvasStateInstance } from "../state/infinite-canvas-state-instance";
import { getRectStrategy } from "../rect/get-rect-strategy";

class PutImageData implements MinimalInstruction {
	constructor(
		private readonly dx: number,
		private readonly dy: number,
		private readonly width: number,
		private readonly height: number,
		public imagePattern: CanvasPattern | undefined,
	){}

	execute(context: CanvasRenderingContext2D): void {
		context.translate(this.dx, this.dy);
		context.fillStyle = this.imagePattern;
		context.fillRect(0, 0, this.width, this.height);
	}
}
export class InfiniteCanvasImageData implements CanvasImageData{
	constructor(private viewBox: ViewBox){

	}
	public createImageData(swOrImageData: number | ImageData, sh?: number): ImageData{return undefined;}
	public getImageData(sx: number, sy: number, sw: number, sh: number): ImageData{return undefined;}
	public putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void{
		imagedata = sliceImageData(imagedata, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
		let lock: DrawingLock = this.viewBox.getDrawingLock();
		const patternPromise: Promise<CanvasPattern> = this.viewBox.createPatternFromImageData(imagedata);
		const instruction = new PutImageData(dx, dy, imagedata.width, imagedata.height, undefined);
		patternPromise.then((resolvedPattern: CanvasPattern) => {
			instruction.imagePattern = resolvedPattern;
			lock.release();
		});
		
		this.viewBox.addDrawing(instruction, getRectStrategy(dx, dy, imagedata.width, imagedata.height).getArea(), TransformationKind.Absolute, false, state => state
			.changeProperty('shadowColor', InfiniteCanvasStateInstance.default.shadowColor)
			.changeProperty('shadowOffset', InfiniteCanvasStateInstance.default.shadowOffset)
			.changeProperty('shadowBlur', InfiniteCanvasStateInstance.default.shadowBlur)
			.changeProperty('globalAlpha', InfiniteCanvasStateInstance.default.globalAlpha)
			.changeProperty('globalCompositeOperation', InfiniteCanvasStateInstance.default.globalCompositeOperation)
			.changeProperty('imageSmoothingEnabled', false)
			.changeProperty('filter', InfiniteCanvasStateInstance.default.filter));
	}
}