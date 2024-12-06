import { ViewBox } from "../interfaces/viewbox";
import { Instruction } from "../instructions/instruction";
import { TransformationKind } from "../transformation-kind";
import {Area} from "../areas/area";
import { getRectStrategy } from "../rect/get-rect-strategy";

function isVideoFrame(image: CanvasImageSource): image is VideoFrame{
	return typeof (image as VideoFrame).duration !== 'undefined'
}

function getWidthAndHeight(image: CanvasImageSource): {width: number | SVGAnimatedLength, height: number| SVGAnimatedLength}{
	if(isVideoFrame(image)){
		return {
			width: image.displayWidth,
			height: image.displayHeight
		}
	}
	return {
		width: image.width,
		height: image.height
	}
}

export class InfiniteCanvasDrawImage implements CanvasDrawImage{
	constructor(private readonly viewBox: ViewBox){}
	public drawImage(): void{
		const argumentsArray = Array.prototype.slice.apply(arguments);
		let image: CanvasImageSource;
		let sx: number;
		let sy: number;
		let sw: number;
		let sh: number;
		let dx: number;
		let dy: number;
		let dw: number;
		let dh: number;
		if(arguments.length <= 5){
			[image, dx, dy, dw, dh] = argumentsArray;
		}else{
			[image, sx, sy, sw, sh, dx, dy, dw, dh] = argumentsArray;
		}
		const { width, height } = getWidthAndHeight(image)
		const drawnWidth: number = this.getDrawnLength(width, sx, sw, dw);
		const drawnHeight: number = this.getDrawnLength(height, sy, sh, dh);
		const drawnRectangle: Area = getRectStrategy(dx, dy, drawnWidth, drawnHeight).getArea()
		const drawingInstruction: Instruction = this.getDrawImageInstruction(arguments.length, image, sx, sy, sw, sh, dx, dy, dw, dh);
		this.viewBox.addDrawing(drawingInstruction, drawnRectangle, TransformationKind.Relative, true);
	}
	private getDrawImageInstruction(
		numberOfArguments: number,
		image: CanvasImageSource,
		sx: number,
		sy: number,
		sw: number,
		sh: number,
		dx: number,
		dy: number,
		dw: number,
		dh: number): Instruction{
			switch(numberOfArguments){
				case 3: return (context: CanvasRenderingContext2D) => {context.drawImage(image, dx, dy);};
				case 5: return (context: CanvasRenderingContext2D) => {context.drawImage(image, dx, dy, dw, dh);};
				case 9: return (context: CanvasRenderingContext2D) => {context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);};
				default:
					throw new TypeError(`Failed to execute 'drawImage' on 'CanvasRenderingContext2D': Valid arities are: [3, 5, 9], but ${numberOfArguments} arguments provided.`)
			}
	}
	private getDrawnLength(imageLength: number | SVGAnimatedLength, sOrigin: number, sLength: number, dLength: number): number{
		const imageLengthNumber: number = this.getLength(imageLength);
		return dLength !== undefined 
		? dLength 
		: sOrigin !== undefined
			? sLength !== undefined
				? sLength
				: imageLengthNumber - sOrigin
			: imageLengthNumber;
	}
	private getLength(length: number | SVGAnimatedLength): number{
		if(typeof length === "number"){
			return length;
		}
		return length.baseVal.value;
	}
}