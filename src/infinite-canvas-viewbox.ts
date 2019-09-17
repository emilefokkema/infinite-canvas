import { Transformation } from "./transformation"
import { InfiniteCanvasDrawingInstruction } from "./infinite-canvas-drawing-instruction"
import { ViewBox } from "./viewbox";
import { Rectangle } from "./rectangle";
import { Point } from "./point";
import { Area } from "./area";

export class InfiniteCanvasViewBox implements ViewBox{
	public lineWidth: number;
	private _transformation: Transformation;
	private currentArea: Area;
	private instructions: InfiniteCanvasDrawingInstruction[];
	constructor(public width: number, public height: number, private context: CanvasRenderingContext2D){
		this.lineWidth = 1;
		this.instructions = [];
		this._transformation = Transformation.identity();
		this.currentArea = undefined;
	}
	public get transformation(): Transformation{return this._transformation};
	public set transformation(value: Transformation){
		this._transformation = value;
		this.draw();
	}
	public addInstruction<T>(instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => T, area?: Point | Rectangle): T{
		let result: T;
		const newInstruction: InfiniteCanvasDrawingInstruction = {
			apply(context: CanvasRenderingContext2D, transformation: Transformation): void{
				result = instruction(context, transformation);
			},
			area: area
		};
		this.instructions.push(newInstruction);
		if(this.currentArea){
			this.currentArea.addInstruction(newInstruction);
		}
		this.draw();
		return result;
	}
	public beginArea(): void{
		this.currentArea = new Area();
	}
	public closeArea(): void{
		this.currentArea = undefined;
	}
	public clearArea(x: number, y: number, width: number, height: number): void{
		const rectangle: Rectangle = new Rectangle(x, y, width, height);
		let indexContainedInstruction: number;
		while((indexContainedInstruction = this.instructions.findIndex(i => i.area && rectangle.contains(i.area))) > -1){
			this.instructions.splice(indexContainedInstruction, 1);
		}
	}
	private draw(): void{
		this.context.clearRect(0, 0, this.width, this.height);
		this.context.lineWidth = this.transformation.scale;
		for(const instruction of this.instructions){
			instruction.apply(this.context, this._transformation);
		}
	}
}