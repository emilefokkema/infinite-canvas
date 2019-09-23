import { Transformation } from "./transformation"
import { DrawingInstruction } from "./drawing-instruction"
import { ViewBox } from "./viewbox";
import { Rectangle } from "./rectangle";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { InfiniteCanvasDrawingInstruction } from "./infinite-canvas-drawing-instruction";
import { ClearRect } from "./clear-rect";
import { Instruction } from "./instruction";
import { ImmutablePathInstructionSet } from "./immutable-path-instruction-set";

export class InfiniteCanvasViewBox implements ViewBox{
	public state: InfiniteCanvasState;
	private stateStack: InfiniteCanvasState[];
	private pathInstructions: ImmutablePathInstructionSet;
	private _transformation: Transformation;
	private instructions: DrawingInstruction[];
	private lastInstruction: DrawingInstruction;
	constructor(public width: number, public height: number, private context: CanvasRenderingContext2D){
		this.state = InfiniteCanvasState.default();
		this.instructions = [];
		this._transformation = Transformation.identity();
		this.stateStack = [];
	}
	public get transformation(): Transformation{return this._transformation};
	public set transformation(value: Transformation){
		this._transformation = value;
		this.draw();
	}
	public changeState(instruction: (state: InfiniteCanvasState) => InfiniteCanvasState): void{
		this.state = instruction(this.state);
	}
	public saveState(): void{
		this.stateStack.push(this.state);
	}
	public restoreState(): void{
		if(this.stateStack.length){
			this.state = this.stateStack.pop();
		}
	}
	public beginPath(): void{
		this.pathInstructions = ImmutablePathInstructionSet.default();
	}
	public addToPath(instruction: (instructionSet: ImmutablePathInstructionSet) => ImmutablePathInstructionSet): void{
		this.pathInstructions = instruction(this.pathInstructions);
	}
	public drawPath(instruction: (context: CanvasRenderingContext2D) => void): void{
		const newInstruction: DrawingInstruction = new InfiniteCanvasDrawingInstruction(
			this.state,
			this.pathInstructions,
			instruction
		);
		this.addDrawingInstruction(newInstruction);
		this.draw();
	}
	public clearArea(x: number, y: number, width: number, height: number): void{
		const rectangle: Rectangle = new Rectangle(x, y, width, height);
		let indexContainedInstruction: number;
		let somethingWasDone: boolean = false;
		while((indexContainedInstruction = this.instructions.findIndex(i => i.area && rectangle.contains(i.area))) > -1){
			somethingWasDone = true;
			this.removeInstructionAtIndex(indexContainedInstruction);
		}
		if(this.instructions.find(i => i.area && rectangle.intersects(i.area))){
			somethingWasDone = true;
			this.addDrawingInstruction(new ClearRect(this.state, this.pathInstructions, x, y, width, height));
		}
		if(somethingWasDone){
			this.draw();
		}
	}
	private removeInstructionAtIndex(index: number): void{
		const nextInstruction: DrawingInstruction = index < this.instructions.length - 1 ? this.instructions[index + 1] : undefined;
		if(nextInstruction){
			const previousInstruction: DrawingInstruction = index > 0 ? this.instructions[index - 1] : undefined;
			if(previousInstruction){
				nextInstruction.useLeadingInstructionsFrom(previousInstruction);
			}else{
				nextInstruction.useAllLeadingInstructions();
			}
		}
		this.instructions.splice(index, 1);
		this.lastInstruction = this.instructions.length > 0 ? this.instructions[this.instructions.length - 1] : undefined;
	}
	private addDrawingInstruction(instruction: DrawingInstruction){
		if(this.lastInstruction){
			instruction.useLeadingInstructionsFrom(this.lastInstruction);
		}else{
			instruction.useAllLeadingInstructions();
		}
		this.lastInstruction = instruction;
		this.instructions.push(instruction);
	}
	private draw(): void{
		this.context.clearRect(0, 0, this.width, this.height);
		for(const instruction of this.instructions){
			instruction.apply(this.context, this._transformation);
		}
	}
}