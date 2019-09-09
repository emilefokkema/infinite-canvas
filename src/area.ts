import { InfiniteCanvasDrawingInstruction } from "./infinite-canvas-drawing-instruction";
import { Rectangle } from "./rectangle";
import { Point } from "./point";

export class Area{
    private instructions: InfiniteCanvasDrawingInstruction[];
    private rectangle: Rectangle;
    constructor(){
        this.instructions = [];
        this.rectangle = new Rectangle(0, 0, 0, 0);
    }
    public addInstruction(instruction: InfiniteCanvasDrawingInstruction){
        this.instructions.push(instruction);
        if(instruction.area){
            this.rectangle = this.rectangle.expandToInclude(instruction.area);
        }
        for(const instruction of this.instructions){
            instruction.area = this.rectangle;
        }
    }
}