import { ViewBox } from "../interfaces/viewbox";
import { sliceImageData } from "./slice-image-data";
import { DrawingLock } from "../drawing-lock";
import { TransformationKind } from "../transformation-kind";
import { InfiniteCanvasStateInstance } from "../state/infinite-canvas-state-instance";
import { getRectStrategy } from "../rect/get-rect-strategy";

export class InfiniteCanvasImageData implements CanvasImageData{
	constructor(private viewBox: ViewBox){

	}
	public createImageData(swOrImageData: number | ImageData, sh?: number): ImageData{return undefined;}
	public getImageData(sx: number, sy: number, sw: number, sh: number): ImageData{return undefined;}
	public putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void{
		imagedata = sliceImageData(imagedata, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
		let pattern: CanvasPattern;
		let lock: DrawingLock = this.viewBox.getDrawingLock();
		const patternPromise: Promise<CanvasPattern> = this.viewBox.createPatternFromImageData(imagedata);
		patternPromise.then((resolvedPattern: CanvasPattern) => {
			pattern = resolvedPattern;
			lock.release();
		});
		this.viewBox.addDrawing((context: CanvasRenderingContext2D) => {
			context.translate(dx, dy);
			context.fillStyle = pattern;
			context.fillRect(0, 0, imagedata.width, imagedata.height);
		}, getRectStrategy(dx, dy, imagedata.width, imagedata.height).getArea(), TransformationKind.Absolute, false, state => state
			.changeProperty('shadowColor', InfiniteCanvasStateInstance.default.shadowColor)
			.changeProperty('shadowOffset', InfiniteCanvasStateInstance.default.shadowOffset)
			.changeProperty('shadowBlur', InfiniteCanvasStateInstance.default.shadowBlur)
			.changeProperty('globalAlpha', InfiniteCanvasStateInstance.default.globalAlpha)
			.changeProperty('globalCompositeOperation', InfiniteCanvasStateInstance.default.globalCompositeOperation)
			.changeProperty('imageSmoothingEnabled', false)
			.changeProperty('filter', InfiniteCanvasStateInstance.default.filter));
	}
}