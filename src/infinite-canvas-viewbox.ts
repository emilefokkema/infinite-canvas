import { Transformation } from "./transformation"
import { ViewBox } from "./interfaces/viewbox";
import { Instruction } from "./instructions/instruction";
import { PathInstruction } from "./interfaces/path-instruction";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import {InfiniteCanvasStateInstance} from "./state/infinite-canvas-state-instance";
import {DrawingIterationProvider} from "./interfaces/drawing-iteration-provider";
import {InfiniteCanvasLinearGradient} from "./styles/infinite-canvas-linear-gradient";
import {InfiniteCanvasRadialGradient} from "./styles/infinite-canvas-radial-gradient";
import { DrawingLock } from "./drawing-lock";
import { InfiniteCanvasPattern } from "./styles/infinite-canvas-pattern";
import { TransformationKind } from "./transformation-kind";
import { InfiniteCanvasInstructionSet } from "./infinite-canvas-instruction-set";
import { Area } from "./areas/area";
import { Position } from "./geometry/position"
import {rectangleHasArea} from "./geometry/rectangle-has-area";
import {rectangleIsPlane} from "./geometry/rectangle-is-plane";
import {CanvasRectangle} from "./rectangle/canvas-rectangle";
import { InfiniteCanvasConicGradient } from "./styles/infinite-canvas-conic-gradient";

export class InfiniteCanvasViewBox implements ViewBox{
	private instructionSet: InfiniteCanvasInstructionSet;
	constructor(
		private readonly canvasRectangle: CanvasRectangle,
		private context: CanvasRenderingContext2D,
		private readonly drawingIterationProvider: DrawingIterationProvider,
		private readonly drawLockProvider: () => DrawingLock,
		private readonly isTransforming: () => boolean){
			this.instructionSet = new InfiniteCanvasInstructionSet(() => this.draw(), canvasRectangle);
	}
	public get width(): number{return this.canvasRectangle.viewboxWidth;}
	public get height(): number{return this.canvasRectangle.viewboxHeight;}
	public get state(): InfiniteCanvasState{return this.instructionSet.state;}
	public get transformation(): Transformation{return this.canvasRectangle.transformation};
	public set transformation(value: Transformation){
		this.canvasRectangle.transformation = value;
		this.draw();
	}
	public getDrawingLock(): DrawingLock{
		return this.drawLockProvider();
	}
	public changeState(instruction: (state: InfiniteCanvasStateInstance) => InfiniteCanvasStateInstance): void{
		this.instructionSet.changeState(instruction);
	}
	public measureText(text: string): TextMetrics{
		this.context.save();
		const changeToCurrentState: Instruction = InfiniteCanvasStateInstance.default.getInstructionToConvertToState(this.state.currentlyTransformed(false).current, this.canvasRectangle);
		changeToCurrentState(this.context, Transformation.identity);
		const result: TextMetrics = this.context.measureText(text);
		this.context.restore();
		return result;
	}
	public saveState(): void{
		this.instructionSet.saveState();
	}
	public restoreState(): void{
		this.instructionSet.restoreState();
	}
	public beginPath(): void{
		this.instructionSet.beginPath();
	}
	public async createPatternFromImageData(imageData: ImageData): Promise<CanvasPattern>{
		const bitmap: ImageBitmap = await createImageBitmap(imageData);
		return this.context.createPattern(bitmap, 'no-repeat');
	}
	public addDrawing(instruction: Instruction, area: Area, transformationKind: TransformationKind, takeClippingRegionIntoAccount: boolean): void{
		this.instructionSet.addDrawing(instruction, area, transformationKind, takeClippingRegionIntoAccount);
	}
	public addPathInstruction(pathInstruction: PathInstruction): void{
		this.instructionSet.addPathInstruction(pathInstruction);
	}
	public closePath(): void{
		if(!this.instructionSet.currentSubpathIsClosable()){
			return;
		}
		this.instructionSet.closePath();
	}
	public moveTo(position: Position): void{
		this.instructionSet.moveTo(position);
	}
	public lineTo(position: Position): void{
		if(this.instructionSet.canAddLineTo(position)){
			this.instructionSet.lineTo(position);
		}
	}
	public rect(x: number, y: number, w: number, h: number): void{
		this.instructionSet.rect(x, y, w, h);
	}
	public currentPathCanBeFilled(): boolean{
		return this.instructionSet.allSubpathsAreClosable() && this.instructionSet.currentPathContainsFinitePoint();
	}
	public fillPath(instruction: Instruction): void{
		this.instructionSet.fillPath(instruction);
	}
	public strokePath(): void{
		this.instructionSet.strokePath();
	}
	public fillRect(x: number, y: number, w: number, h: number, instruction: Instruction): void{
		if(!rectangleHasArea(x, y, w, h)){
			return;
		}
		this.instructionSet.fillRect(x, y, w, h, instruction);
	}
	public strokeRect(x: number, y: number, w: number, h: number): void{
		if(!rectangleHasArea(x, y, w, h) || rectangleIsPlane(x, y, w, h)){
			return;
		}
		this.instructionSet.strokeRect(x, y, w, h);
	}
	public clipPath(instruction: Instruction): void{
		this.instructionSet.clipPath(instruction);
	}
	public clearArea(x: number, y: number, width: number, height: number): void{
		this.instructionSet.clearArea(x, y, width, height);
	}
	public createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient{
		return new InfiniteCanvasLinearGradient(this.context, x0, y0, x1, y1);
	}
	public createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient{
		return new InfiniteCanvasRadialGradient(this.context, x0, y0, r0, x1, y1, r1);
	}
	public createConicGradient(startAngle: number, x: number, y: number): CanvasGradient {
		return new InfiniteCanvasConicGradient(this.context, startAngle, x, y);
	}
	public createPattern(image: CanvasImageSource, repetition: string): CanvasPattern{
		let result: InfiniteCanvasPattern;
		result = new InfiniteCanvasPattern(this.context.createPattern(image, repetition));
		return result;
	}
	public draw(): void{
		this.drawingIterationProvider.provideDrawingIteration(() => {
			if(!this.isTransforming()){
				this.canvasRectangle.measure();
			}
			this.context.restore();
			this.context.save();
			this.context.clearRect(0, 0, this.width, this.height);
			this.canvasRectangle.applyInitialTransformation(this.context);
			this.instructionSet.execute(this.context, this.transformation);
		});
	}
}
