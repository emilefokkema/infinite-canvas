import { Transformation } from "./transformation"
import { DrawingInstruction } from "./drawing-instruction"
import { ViewBox } from "./viewbox";
import { Rectangle } from "./rectangle";
import { InfiniteCanvasState } from "./infinite-canvas-state";
import { InfiniteCanvasDrawingInstruction } from "./infinite-canvas-drawing-instruction";
import { ClearRect } from "./clear-rect";
import { InfiniteCanvasPathInstructionSet } from "./infinite-canvas-path-instruction-set";

export class InfiniteCanvasViewBox implements ViewBox{
	private defaultState: InfiniteCanvasState;
	public state: InfiniteCanvasState;
	private pathInstructions: InfiniteCanvasPathInstructionSet;
	private _transformation: Transformation;
	private instructions: DrawingInstruction[];
	constructor(public width: number, public height: number, private context: CanvasRenderingContext2D){
		this.defaultState = InfiniteCanvasState.default();
		this.state = this.defaultState;
		this.instructions = [];
		this._transformation = Transformation.identity();
	}
	public get transformation(): Transformation{return this._transformation};
	public set transformation(value: Transformation){
		this._transformation = value;
		this.draw();
	}
	public addInstruction(instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => void): void{
		const newInstruction: DrawingInstruction = new InfiniteCanvasDrawingInstruction(instruction, this.state);
		this.addDrawingInstruction(newInstruction);
	}
	public changeState(instruction: (state: InfiniteCanvasState) => InfiniteCanvasState): void{
		this.state = instruction(this.state);
	}
	public beginPath(): void{
		this.pathInstructions = new InfiniteCanvasPathInstructionSet();
	}
	public addToPath(instruction: (instructionSet: InfiniteCanvasPathInstructionSet) => void): void{
		instruction(this.pathInstructions);
	}
	public drawPath(instruction: (context: CanvasRenderingContext2D) => void): void{
		const pathdrawingInstruction: DrawingInstruction = this.pathInstructions;
		const newInstruction: DrawingInstruction = new InfiniteCanvasDrawingInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
			pathdrawingInstruction.apply(context, transformation);
			instruction(context);
		}, this.state, pathdrawingInstruction.area);
		this.addDrawingInstruction(newInstruction);
	}
	public clearArea(x: number, y: number, width: number, height: number): void{
		const rectangle: Rectangle = new Rectangle(x, y, width, height);
		let indexContainedInstruction: number;
		let somethingWasDone: boolean = false;
		while((indexContainedInstruction = this.instructions.findIndex(i => i.area && rectangle.contains(i.area))) > -1){
			somethingWasDone = true;
			this.instructions.splice(indexContainedInstruction, 1);
		}
		if(this.instructions.find(i => i.area && rectangle.intersects(i.area))){
			somethingWasDone = true;
			this.addDrawingInstruction(new ClearRect(x, y, width, height));
		}
		if(somethingWasDone){
			this.draw();
		}
	}

	private addDrawingInstruction(instruction: DrawingInstruction){
		this.instructions.push(instruction);
		this.draw();
	}
	private draw(): void{
		this.context.clearRect(0, 0, this.width, this.height);
		this.defaultState.apply(this.context, this._transformation);
		for(const instruction of this.instructions){
			instruction.apply(this.context, this._transformation);
		}
	}
}