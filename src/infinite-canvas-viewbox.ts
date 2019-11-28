import { Transformation } from "./transformation"
import { ViewBox } from "./interfaces/viewbox";
import { Instruction } from "./instructions/instruction";
import { StateChange } from "./state/state-change";
import { PathInstruction } from "./interfaces/path-instruction";
import { InfiniteCanvasInstructionSet } from "./infinite-canvas-instruction-set";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import {InfiniteCanvasStateInstance} from "./state/infinite-canvas-state-instance";
import {InfiniteCanvasLinearGradient} from "./infinite-canvas-linear-gradient";
import {InfiniteCanvasAuxiliaryObject} from "./infinite-canvas-auxiliary-object";
import {InfiniteCanvasRadialGradient} from "./infinite-canvas-radial-gradient";

export class InfiniteCanvasViewBox implements ViewBox{
	private instructionSet: InfiniteCanvasInstructionSet;
	private _transformation: Transformation;
	private _auxiliaryObjects: InfiniteCanvasAuxiliaryObject[] = [];
	constructor(public width: number, public height: number, private context: CanvasRenderingContext2D){
		this.instructionSet = new InfiniteCanvasInstructionSet(() => this.draw());
		this._transformation = Transformation.identity;
	}
	public get state(): InfiniteCanvasState{return this.instructionSet.state;}
	public get transformation(): Transformation{return this._transformation};
	public set transformation(value: Transformation){
		this._transformation = value;
		this.draw();
	}
	public changeState(instruction: (state: InfiniteCanvasStateInstance) => StateChange<InfiniteCanvasStateInstance>): void{
		this.instructionSet.changeState(instruction);
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
	public addPathInstruction(pathInstruction: PathInstruction): void{
		this.instructionSet.addPathInstruction(pathInstruction);
	}
	public drawPath(instruction: Instruction, getFillStrokeStyle: (stateInstance: InfiniteCanvasStateInstance) => string | CanvasGradient | CanvasPattern, pathInstructions?: PathInstruction[]): void{
		const currentFillStyle: string | CanvasGradient | CanvasPattern = getFillStrokeStyle(this.instructionSet.state.current);
		if(currentFillStyle instanceof InfiniteCanvasAuxiliaryObject){
			currentFillStyle.use();
			this.addAuxiliaryObject(currentFillStyle);
			this.instructionSet.drawPath(instruction, pathInstructions, () => currentFillStyle.stopUsing());
		}else{
			this.instructionSet.drawPath(instruction, pathInstructions);
		}
	}
	public clipPath(instruction: Instruction): void{
		this.instructionSet.clipPath(instruction);
	}
	public clearArea(x: number, y: number, width: number, height: number): void{
		this.instructionSet.clearArea(x, y, width, height);
	}
	public createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient{
		let result: InfiniteCanvasLinearGradient;
		result = new InfiniteCanvasLinearGradient(() => this.removeAuxiliaryObject(result), this.context, x0, y0, x1, y1);
		return result;
	}
	public createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient{
		let result: InfiniteCanvasRadialGradient;
		result = new InfiniteCanvasRadialGradient(() => this.removeAuxiliaryObject(result), this.context, x0, y0, r0, x1, y1, r1);
		return result;
	}
	private removeAuxiliaryObject(auxiliaryObject: InfiniteCanvasAuxiliaryObject): void{
		const index: number = this._auxiliaryObjects.indexOf(auxiliaryObject);
		if(index > -1){
			this._auxiliaryObjects.splice(index, 1);
		}
	}
	private addAuxiliaryObject(auxiliaryObject: InfiniteCanvasAuxiliaryObject): void{
		if(this._auxiliaryObjects.indexOf(auxiliaryObject) === -1){
			this._auxiliaryObjects.push(auxiliaryObject);
		}
	}
	private draw(): void{
		for(const auxiliaryObject of this._auxiliaryObjects){
			auxiliaryObject.update(this._transformation);
		}
		this.context.restore();
		this.context.save();
		this.context.clearRect(0, 0, this.width, this.height);
		this.instructionSet.execute(this.context, this._transformation);
	}
}