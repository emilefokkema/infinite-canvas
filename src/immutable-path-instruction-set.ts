import { Rectangle } from "./rectangle";
import { Transformation } from "./transformation";
import { Point } from "./point";
import { drawRect } from "./infinite-context/draw-rect";
import { SimpleInstruction } from "./simple-instruction";
import { Instruction } from "./instruction";

export class ImmutablePathInstructionSet {

    constructor(private readonly instruction: Instruction, public readonly area?: Rectangle, private readonly predecessor?: ImmutablePathInstructionSet){
        
    }
    private withInstruction(instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => void, toArea?: Point | Rectangle): ImmutablePathInstructionSet{
        let newArea: Rectangle;
        if(this.area){
            newArea = toArea ? this.area.expandToInclude(toArea) : this.area;
        }else if(toArea){
            newArea = Rectangle.create(toArea);
        }
        const newInstruction: Instruction = new SimpleInstruction(instruction);
        return new ImmutablePathInstructionSet(newInstruction, newArea, this);
    }

    public arc(_x: number, _y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): ImmutablePathInstructionSet{
        const area: Rectangle = new Rectangle(_x - radius, _y - radius, 2 * radius, 2 * radius);
        return this.withInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
            const transformationAngle: number = transformation.getRotationAngle();
            const {x, y} = transformation.apply({x:_x,y:_y});
            context.arc(x, y, radius * transformation.scale, startAngle + transformationAngle, endAngle + transformationAngle, anticlockwise);
        }, area);
    }
    public arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): ImmutablePathInstructionSet{
        const p1: Point = {x:x1,y:y1};
        const p2: Point = {x:x2,y:y2};
        const newRectangle: Rectangle = Rectangle.create(p1).expandToInclude(p2);
        return this.withInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
            const tp1: Point = transformation.apply(p1);
            const tp2: Point = transformation.apply(p2);
            context.arcTo(tp1.x, tp1.y, tp2.x, tp2.y, radius * transformation.scale);
        }, newRectangle);
    }
    public bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void{}
    public closePath(): ImmutablePathInstructionSet{
        return this.withInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
            context.closePath();
        });
    }
    public ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void{}
    public lineTo(_x: number, _y: number): ImmutablePathInstructionSet{
        const point: Point = {x: _x, y: _y};
        return this.withInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
			const {x, y} = transformation.apply(point);
			context.lineTo(x, y);
        }, point);
    }
    public moveTo(_x: number, _y: number): ImmutablePathInstructionSet{
        const point: Point = {x: _x, y: _y};
        return this.withInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
			const {x, y} = transformation.apply(point);
			context.moveTo(x, y);
        }, point);
    }
    public quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void{}
    public rect(x: number, y: number, w: number, h: number): ImmutablePathInstructionSet{
        const rectangle: Rectangle = new Rectangle(x, y, w, h);
        return this.withInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
			drawRect(x, y, w, h, context, transformation);
        }, rectangle);
    }
    public getInstructionsComparedTo(predecessor: ImmutablePathInstructionSet): Instruction[]{
        if(predecessor === this){
            return [];
        }
        const thisInstruction: Instruction[] = [this.instruction];
        if(this.predecessor){
            return this.predecessor.getInstructionsComparedTo(predecessor).concat(thisInstruction);
        }
        return thisInstruction;
    }
    public getAllInstructions(): Instruction[]{
        const thisInstruction: Instruction[] = [this.instruction];
        if(this.predecessor){
            return this.predecessor.getAllInstructions().concat(thisInstruction);
        }
        return thisInstruction;
    }
    public static default(): ImmutablePathInstructionSet{
        const beginPathInstruction: Instruction = new SimpleInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
            context.beginPath();
        });
        return new ImmutablePathInstructionSet(beginPathInstruction);
    }
}
