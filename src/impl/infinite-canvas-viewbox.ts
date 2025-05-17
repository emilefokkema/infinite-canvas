import { Transformation } from "./transformation"
import { ViewBox } from "./interfaces/viewbox";
import { Instruction, MinimalInstruction } from "./instructions/instruction";
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
import { RectangleManager } from "./rectangle/rectangle-manager";
import { InfiniteCanvasConicGradient } from "./styles/infinite-canvas-conic-gradient";
import { textDrawingStylesDimensions } from "./state/dimensions/all-dimensions";
import { getRectStrategy } from "./rect/get-rect-strategy";

export class InfiniteCanvasViewBox implements ViewBox{
	private instructionSet: InfiniteCanvasInstructionSet;
	constructor(
		private readonly rectangleManager: RectangleManager,
		private context: CanvasRenderingContext2D,
		private readonly drawingIterationProvider: DrawingIterationProvider,
		private readonly drawLockProvider: () => DrawingLock,
		private readonly isTransforming: () => boolean){
			this.instructionSet = new InfiniteCanvasInstructionSet(() => this.draw());
	}
	private get width(): number{return this.rectangleManager.rectangle.viewboxWidth;}
	private get height(): number{return this.rectangleManager.rectangle.viewboxHeight;}
	public get state(): InfiniteCanvasState{return this.instructionSet.state;}
	public get transformation(): Transformation{return this.rectangleManager.rectangle.userTransformation};
	public set transformation(value: Transformation){
		this.rectangleManager.setTransformation(value);
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
		const changeToCurrentState: MinimalInstruction = InfiniteCanvasStateInstance.default.getInstructionToConvertToStateOnDimensions(this.state.currentlyTransformed(false).current, textDrawingStylesDimensions);
		changeToCurrentState(this.context);
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
	public resetState(): void{
		this.instructionSet.resetState();
	}
	public beginPath(): void{
		this.instructionSet.beginPath();
	}
	public async createPatternFromImageData(imageData: ImageData): Promise<CanvasPattern>{
		const bitmap: ImageBitmap = await createImageBitmap(imageData);
		return this.context.createPattern(bitmap, 'no-repeat');
	}
	public addDrawing(instruction: Instruction, area: Area, transformationKind: TransformationKind, takeClippingRegionIntoAccount: boolean, tempStateFn?: (state: InfiniteCanvasStateInstance) => InfiniteCanvasStateInstance): void{
		this.instructionSet.addDrawing(instruction, area, transformationKind, takeClippingRegionIntoAccount, tempStateFn);
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
		const rectStrategy = getRectStrategy(x, y, w, h)
		this.instructionSet.rect(rectStrategy);
	}
	public roundRect(
		x: number,
		y: number,
		w: number,
		h: number,
		radii?: number | DOMPointInit | Iterable<number | DOMPointInit>
	): void{
		const rectStrategy = getRectStrategy(x, y, w, h)
		this.instructionSet.roundRect(rectStrategy, radii)
	}
	public currentPathCanBeFilled(): boolean{
		return this.instructionSet.allSubpathsAreClosable() && this.instructionSet.currentPathSurroundsFinitePoint();
	}
	public fillPath(instruction: Instruction): void{
		this.instructionSet.fillPath(instruction);
	}
	public strokePath(): void{
		this.instructionSet.strokePath();
	}
	public fillRect(x: number, y: number, w: number, h: number, instruction: Instruction): void{
		const rectStrategy = getRectStrategy(x, y, w, h)
		this.instructionSet.fillRect(rectStrategy, instruction);
	}
	public strokeRect(x: number, y: number, w: number, h: number): void{
		const rectStrategy = getRectStrategy(x, y, w, h)
		this.instructionSet.strokeRect(rectStrategy);
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
				this.rectangleManager.measure();
			}
			if(!this.rectangleManager.rectangle){
				return false;
			}
			this.context.restore();
			this.context.save();
			this.context.clearRect(0, 0, this.width, this.height);
			this.setInitialTransformation();
			this.instructionSet.execute(this.context, this.rectangleManager.rectangle);
			return true;
		});
	}
	private setInitialTransformation(): void{
		const initialTransformation = this.rectangleManager.rectangle.initialBitmapTransformation;
		if(initialTransformation.equals(Transformation.identity)){
			return;
		}
		const {a, b, c, d, e, f} = initialTransformation;
		this.context.setTransform(a, b, c, d, e, f);
	}
}
