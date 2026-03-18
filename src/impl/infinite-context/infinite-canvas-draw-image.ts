import { ViewBox } from "../interfaces/viewbox";
import { Instruction } from "../instructions/instruction";
import { MinimalInstruction } from "../instructions/instruction";
import { TransformationKind } from "../transformation-kind";
import {Area} from "../areas/area";
import { getRectStrategy } from "../rect/get-rect-strategy";

class DrawImage1 implements MinimalInstruction {
	constructor(
		private readonly image: CanvasImageSource,
		private readonly dx: number,
		private readonly dy: number,
	){}

	execute(context: CanvasRenderingContext2D): void {
		context.drawImage(this.image, this.dx, this.dy);
	}
}

class DrawImage2 implements MinimalInstruction {
	constructor(
		private readonly image: CanvasImageSource,
		private readonly dx: number,
		private readonly dy: number,
		private readonly dw: number,
		private readonly dh: number
	){}

	execute(context: CanvasRenderingContext2D): void {
		context.drawImage(this.image, this.dx, this.dy, this.dw, this.dh);
	}
}

class DrawImage3 implements MinimalInstruction {
	constructor(
		private readonly image: CanvasImageSource,
		private readonly sx: number,
		private readonly sy: number,
		private readonly sw: number,
		private readonly sh: number,
		private readonly dx: number,
		private readonly dy: number,
		private readonly dw: number,
		private readonly dh: number
	){}

	execute(context: CanvasRenderingContext2D): void {
		context.drawImage(this.image, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
	}
}

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
		const drawingInstruction = this.getDrawImageInstruction(arguments.length, image, sx, sy, sw, sh, dx, dy, dw, dh);
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
		dh: number): Instruction {
			switch(numberOfArguments){
				case 3: return new DrawImage1(image, dx, dy);
				case 5: return new DrawImage2(image, dx, dy, dw, dh);
				case 9: return new DrawImage3(image, sx, sy, sw, sh, dx, dy, dw, dh);
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