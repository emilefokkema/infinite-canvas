import { ViewBox } from "../interfaces/viewbox";
import { Rectangle } from "../rectangle";
import { Instruction } from "../instructions/instruction";
import { TransformationKind } from "../transformation-kind";

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
		const drawnWidth: number = this.getDrawnLength(image.width, sx, sw, dw);
		const drawnHeight: number = this.getDrawnLength(image.height, sy, sh, dh);
		const drawnRectangle: Rectangle = new Rectangle(dx, dy, drawnWidth, drawnHeight);
		const drawingInstruction: Instruction = this.getDrawImageInstruction(arguments.length, image, sx, sy, sw, sh, dx, dy, dw, dh);
		this.viewBox.addDrawing(drawingInstruction, drawnRectangle, TransformationKind.Relative);
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