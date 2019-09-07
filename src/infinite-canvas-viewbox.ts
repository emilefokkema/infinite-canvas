import { Transformation } from "./transformation"
import { InfiniteCanvasDrawingInstruction } from "./infinite-canvas-drawing-instruction"
import { ViewBox } from "./viewbox";
import { Rectangle } from "./rectangle";

export class InfiniteCanvasViewBox implements ViewBox{
	private transformation: Transformation;
	private instructions: InfiniteCanvasDrawingInstruction[];
	constructor(private width: number, private height: number, private context: CanvasRenderingContext2D){
		this.instructions = [];
		this.transformation = Transformation.identity();
	}
	public addInstruction<T>(instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => T, rectangle?: Rectangle): T{
		let result: T;
		const newInstruction: InfiniteCanvasDrawingInstruction = {
			apply(context: CanvasRenderingContext2D, transformation: Transformation): void{
				result = instruction(context, transformation);
			},
			rectangle: rectangle
		};
		this.instructions.push(newInstruction);
		this.draw();
		return result;
	}
	public clearRectangle(x: number, y: number, width: number, height: number): void{
		const rectangle: Rectangle = new Rectangle(x, y, width, height);
		let indexContainedInstruction: number;
		while((indexContainedInstruction = this.instructions.findIndex(i => i.rectangle && rectangle.contains(i.rectangle))) > -1){
			this.instructions.splice(indexContainedInstruction, 1);
		}
	}
	private draw(): void{
		this.context.clearRect(0, 0, this.width, this.height);
		for(const instruction of this.instructions){
			instruction.apply(this.context, this.transformation);
		}
	}
}