import { InfiniteCanvasRenderingContext2D } from "api/infinite-canvas-rendering-context-2d"
import { InfiniteCanvasState } from "./infinite-canvas-state"
import { InfiniteCanvasTransform } from "./infinite-canvas-transform"
import { InfiniteCanvasCompositing } from "./infinite-canvas-compositing"
import { InfiniteCanvasImageSmoothing } from "./infinite-canvas-image-smoothing"
import { InfiniteCanvasFillStrokeStyles } from "./infinite-canvas-fill-stroke-styles";
import { InfiniteCanvasShadowStyles } from "./infinite-canvas-shadow-styles"
import { InfinitCanvasFilters } from "./infinite-canvas-filters"
import { InfiniteCanvasRect } from "./infinite-canvas-rect";
import { InfiniteCanvasDrawPath } from "./infinite-canvas-draw-path"
import { InfiniteCanvasUserInterface } from "./infinite-canvas-user-interface"
import { InfiniteCanvasText } from "./infinite-canvas-text"
import { InfiniteCanvasDrawImage } from "./infinite-canvas-draw-image"
import { InfiniteCanvasImageData } from "./infinite-canvas-image-data"
import { InfiniteCanvasPathDrawingStyles } from "./infinite-canvas-path-drawing-styles"
import { InfiniteCanvasTextDrawingStyles } from "./infinite-canvas-text-drawing-styles"
import { InfiniteCanvasPath } from "./infinite-canvas-path"
import { ViewBox } from "../interfaces/viewbox"
import { CssLengthConverterFactory } from "../css-length-converter-factory"

export class InfiniteContext implements InfiniteCanvasRenderingContext2D{
	private canvasState: InfiniteCanvasState;
	private canvasTransform: InfiniteCanvasTransform;
	private canvasCompositing: InfiniteCanvasCompositing;
	private canvasImageSmoothing: InfiniteCanvasImageSmoothing;
	private canvasStrokeStyles: InfiniteCanvasFillStrokeStyles;
	private canvasShadowStyles: InfiniteCanvasShadowStyles;
	private canvasFilters: InfinitCanvasFilters;
	private canvasRect: InfiniteCanvasRect;
	private canvasDrawPath: InfiniteCanvasDrawPath;
	private canvasUserInterface: InfiniteCanvasUserInterface;
	private canvasText: InfiniteCanvasText;
	private canvasDrawImage: InfiniteCanvasDrawImage;
	private canvasImageData: InfiniteCanvasImageData;
	private canvasPathDrawingStyles: InfiniteCanvasPathDrawingStyles;
	private canvasTextDrawingStyles: InfiniteCanvasTextDrawingStyles;
	private canvasPath: InfiniteCanvasPath;
	constructor(public readonly canvas: HTMLCanvasElement, viewBox: ViewBox, cssLengthConverterFactory: CssLengthConverterFactory){
		this.canvasState = new InfiniteCanvasState(viewBox);
		this.canvasTransform = new InfiniteCanvasTransform(viewBox);
		this.canvasCompositing = new InfiniteCanvasCompositing(viewBox);
		this.canvasImageSmoothing = new InfiniteCanvasImageSmoothing(viewBox)
		this.canvasStrokeStyles = new InfiniteCanvasFillStrokeStyles(viewBox);
		this.canvasShadowStyles = new InfiniteCanvasShadowStyles(viewBox);
		this.canvasFilters = new InfinitCanvasFilters(viewBox, cssLengthConverterFactory);
		this.canvasRect = new InfiniteCanvasRect(viewBox);
		this.canvasDrawPath = new InfiniteCanvasDrawPath(viewBox);
		this.canvasUserInterface = new InfiniteCanvasUserInterface();
		this.canvasText = new InfiniteCanvasText(viewBox);
		this.canvasDrawImage = new InfiniteCanvasDrawImage(viewBox);
		this.canvasImageData = new InfiniteCanvasImageData(viewBox);
		this.canvasPathDrawingStyles = new InfiniteCanvasPathDrawingStyles(viewBox);
		this.canvasTextDrawingStyles = new InfiniteCanvasTextDrawingStyles(viewBox);
		this.canvasPath = new InfiniteCanvasPath(viewBox);
	}
	public getContextAttributes(): CanvasRenderingContext2DSettings {
		return this.canvas.getContext('2d').getContextAttributes();
	}
	public save():void{
		this.canvasState.save();
	}
	public restore(): void{
		this.canvasState.restore();
	}
	public reset(): void{
		this.canvasState.reset();
	}
	public getTransform(): DOMMatrix{
		return this.canvasTransform.getTransform();
	}
	public resetTransform(): void{
		this.canvasTransform.resetTransform();
	}
	public rotate(angle: number): void{
		this.canvasTransform.rotate(angle);
	}
	public scale(x: number, y: number): void{
		this.canvasTransform.scale(x, y);
	}
	public setTransform(a: number | DOMMatrix2DInit, b?: number, c?: number, d?: number, e?: number, f?: number): void{
		this.canvasTransform.setTransform(a, b, c, d, e, f);
	}
	public transform(a: number, b: number, c: number, d: number, e: number, f: number): void{
		this.canvasTransform.transform(a, b, c, d, e, f);
	}
	public translate(x: number, y: number): void{
		this.canvasTransform.translate(x, y);
	}
	public set globalAlpha(value: number){
		this.canvasCompositing.globalAlpha = value;
	}
    public set globalCompositeOperation(value: GlobalCompositeOperation){
    	this.canvasCompositing.globalCompositeOperation = value;
    }
    public set imageSmoothingEnabled(value: boolean){
    	this.canvasImageSmoothing.imageSmoothingEnabled = value;
    }
    public set imageSmoothingQuality(value: ImageSmoothingQuality){
    	this.canvasImageSmoothing.imageSmoothingQuality = value;
    }
    public set fillStyle(value: string | CanvasGradient | CanvasPattern){
    	this.canvasStrokeStyles.fillStyle = value;
	}
    public set strokeStyle(value: string | CanvasGradient | CanvasPattern){
    	this.canvasStrokeStyles.strokeStyle = value;
    }
    public createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient{
    	return this.canvasStrokeStyles.createLinearGradient(x0, y0, x1, y1);
    }
    public createPattern(image: CanvasImageSource, repetition: string): CanvasPattern | null{
    	return this.canvasStrokeStyles.createPattern(image, repetition);
    }
    public createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient{
    	return this.canvasStrokeStyles.createRadialGradient(x0, y0, r0, x1, y1, r1);
    }
	public createConicGradient(startAngle: number, x: number, y: number): CanvasGradient {
		return this.canvasStrokeStyles.createConicGradient(startAngle, x, y);
	}
    public set shadowBlur(value: number){
    	this.canvasShadowStyles.shadowBlur = value;
    }
    public set shadowColor(value: string){
    	this.canvasShadowStyles.shadowColor = value;
    }
    public set shadowOffsetX(value: number){
    	this.canvasShadowStyles.shadowOffsetX = value;
    }
    public set shadowOffsetY(value: number){
    	this.canvasShadowStyles.shadowOffsetY = value;
    }
    public set filter(value: string){
    	this.canvasFilters.filter = value;
    }
    public clearRect(x: number, y: number, w: number, h: number): void{
    	this.canvasRect.clearRect(x, y, w, h);
    }
    public fillRect(x: number, y: number, w: number, h: number): void{
    	this.canvasRect.fillRect(x, y, w, h);
    }
    public strokeRect(x: number, y: number, w: number, h: number): void{
    	this.canvasRect.strokeRect(x, y, w, h);
    }
    public beginPath(): void{
    	this.canvasDrawPath.beginPath();
    }
	public clip(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void{
		this.canvasDrawPath.clip(pathOrFillRule, fillRule);
	}
	public fill(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void{
		this.canvasDrawPath.fill(pathOrFillRule, fillRule);
	}
	public isPointInPath(xOrPath: number | Path2D, xOry: number, yOrFillRule: number | CanvasFillRule, fillRule?: CanvasFillRule): boolean{
		return this.canvasDrawPath.isPointInPath(xOrPath, xOry, yOrFillRule, fillRule);
	}
	public isPointInStroke(xOrPath: number | Path2D, xOry: number, y?:number): boolean{
		return this.canvasDrawPath.isPointInStroke(xOrPath, xOry, y);
	}
	public stroke(path?: Path2D): void{
		this.canvasDrawPath.stroke(path);
	}
	public drawFocusIfNeeded(pathOrElement: Path2D | Element, element?: Element): void{
		this.canvasUserInterface.drawFocusIfNeeded(pathOrElement, element);
	}
	public scrollPathIntoView(path?: Path2D): void{
		this.canvasUserInterface.scrollPathIntoView(path);
	}
	public fillText(text: string, x: number, y: number, maxWidth?: number): void{
		this.canvasText.fillText(text, x, y, maxWidth);
	}
	public measureText(text: string): TextMetrics{
		return this.canvasText.measureText(text);
	}
	public strokeText(text: string, x: number, y: number, maxWidth?: number): void{
		this.canvasText.strokeText(text, x, y, maxWidth);
	}
	public drawImage(): void{
		this.canvasDrawImage.drawImage.apply(this.canvasDrawImage, arguments);
	}
	public createImageData(swOrImageData: number | ImageData, sh?: number): ImageData{
		return this.canvasImageData.createImageData(swOrImageData, sh);
	}
	public getImageData(sx: number, sy: number, sw: number, sh: number): ImageData{
		return this.canvasImageData.getImageData(sx, sy, sw, sh);
	}
	public putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void{
		this.canvasImageData.putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
	}
	public set lineCap(value: CanvasLineCap){
		this.canvasPathDrawingStyles.lineCap = value;
	}
	public set lineDashOffset(value: number){
		this.canvasPathDrawingStyles.lineDashOffset = value;
	}
	public set lineJoin(value: CanvasLineJoin){
		this.canvasPathDrawingStyles.lineJoin = value;
	}
	public set lineWidth(value: number){
		this.canvasPathDrawingStyles.lineWidth = value;
	}
	public set miterLimit(value: number){
		this.canvasPathDrawingStyles.miterLimit = value;
	}
	public getLineDash(): number[]{
		return this.canvasPathDrawingStyles.getLineDash();
	}
	public setLineDash(segments: number[]): void{
		this.canvasPathDrawingStyles.setLineDash(segments);
	}
	public set direction(value: CanvasDirection){
		this.canvasTextDrawingStyles.direction = value;
	}
	public set font(value: string){
		this.canvasTextDrawingStyles.font = value;
	}
	public set textAlign(value: CanvasTextAlign){
		this.canvasTextDrawingStyles.textAlign = value;
	}
	public set textBaseline(value: CanvasTextBaseline){
		this.canvasTextDrawingStyles.textBaseline = value;
	}
	public set fontKerning(value: CanvasFontKerning){
		this.canvasTextDrawingStyles.fontKerning = value;
	}
	public arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void{
		this.canvasPath.arc(x, y, radius, startAngle, endAngle, anticlockwise);
	}
	public arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void{
		this.canvasPath.arcTo(x1, y1, x2, y2, radius);
	}
	public bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void{
		this.canvasPath.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
	}
	public closePath(): void{
		this.canvasPath.closePath();
	}
	public ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void{
		this.canvasPath.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
	}
	public lineTo(x: number, y: number): void{
		this.canvasPath.lineTo(x, y);
	}
	public lineToInfinityInDirection(x: number, y: number): void{
		this.canvasPath.lineToInfinityInDirection(x,  y);
	}
	public moveTo(x: number, y: number): void{
		this.canvasPath.moveTo(x, y);
	}
	public moveToInfinityInDirection(x: number, y: number): void{
		this.canvasPath.moveToInfinityInDirection(x, y);
	}
	public quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void{
		this.canvasPath.quadraticCurveTo(cpx, cpy, x, y);
	}
	public rect(x: number, y: number, w: number, h: number): void{
		this.canvasPath.rect(x, y, w, h);
	}
	public roundRect(
		x: number,
		y: number,
		w: number,
		h: number,
		radii?: number | DOMPointInit | Iterable<number | DOMPointInit>
	): void{
		this.canvasPath.roundRect(x, y, w, h, radii);
	}
}
