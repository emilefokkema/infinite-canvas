import { Transformation } from "./transformation"
import { ViewBox } from "./interfaces/viewbox";
import { Instruction } from "./instructions/instruction";
import { StateChange } from "./state/state-change";
import { PathInstruction } from "./interfaces/path-instruction";
import { InfiniteCanvasInstructionSet } from "./infinite-canvas-instruction-set";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import {InfiniteCanvasStateInstance} from "./state/infinite-canvas-state-instance";

export class InfiniteCanvasViewBox implements ViewBox{
	private instructionSet: InfiniteCanvasInstructionSet;
	private _transformation: Transformation;
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
	public drawPath(instruction: Instruction, pathInstructions?: PathInstruction[]): void{
		this.instructionSet.drawPath(instruction, pathInstructions);
	}
	public clipPath(instruction: Instruction): void{
		this.instructionSet.clipPath(instruction);
	}
	public clearArea(x: number, y: number, width: number, height: number): void{
		this.instructionSet.clearArea(x, y, width, height);
	}

	private draw(): void{
		this.context.restore();
		this.context.save();
		this.context.clearRect(0, 0, this.width, this.height);
		this.instructionSet.execute(this.context, this._transformation);
	}
}