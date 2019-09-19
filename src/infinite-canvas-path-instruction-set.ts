import { DrawingInstruction } from "./drawing-instruction";
import { Rectangle } from "./rectangle";
import { Transformation } from "./transformation";
import { Point } from "./point";
import { drawRect } from "./infinite-context/draw-rect";
import { InfiniteCanvasDrawingInstruction } from "./infinite-canvas-drawing-instruction";

export class InfiniteCanvasPathInstructionSet implements CanvasPath, DrawingInstruction{
    private instructions: DrawingInstruction[];
    public area: Rectangle;
    constructor(){
        this.instructions = [];
    }
    private updateOrCreateArea(area: Point | Rectangle){
        this.area = this.area ? this.area.expandToInclude(area) : Rectangle.create(area);
    }
    public arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void{}
    public arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void{}
    public bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void{}
    public closePath(): void{
        const instruction: DrawingInstruction = new InfiniteCanvasDrawingInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
			context.closePath();
        });
        this.instructions.push(instruction);
    }
    public ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void{}
    public lineTo(_x: number, _y: number): void{
        const point: Point = {x: _x, y: _y};
        const instruction: DrawingInstruction = new InfiniteCanvasDrawingInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
			const {x, y} = transformation.apply(point);
			context.lineTo(x, y);
        });
        this.updateOrCreateArea(point);
        this.instructions.push(instruction);
    }
    public moveTo(_x: number, _y: number): void{
        const point: Point = {x: _x, y: _y};
        const instruction: DrawingInstruction = new InfiniteCanvasDrawingInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
			const {x, y} = transformation.apply(point);
			context.moveTo(x, y);
        });
        this.updateOrCreateArea(point);
        this.instructions.push(instruction);
    }
    public quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void{}
    public rect(x: number, y: number, w: number, h: number): void{
        const instruction: DrawingInstruction = new InfiniteCanvasDrawingInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
			drawRect(x, y, w, h, context, transformation);
        });
        this.updateOrCreateArea(new Rectangle(x, y, w, h));
        this.instructions.push(instruction);
	}
    public apply(context: CanvasRenderingContext2D, transformation: Transformation): void{
        context.beginPath();
        for(const instruction of this.instructions){
            instruction.apply(context, transformation);
        }
    }
}