import { Dimension } from "./dimension";
import { CanvasState } from "../canvas-state";
import { Instruction } from "../instruction";
import { SimpleInstruction } from "../simple-instruction";
import { Transformation } from "../transformation";

export class LineDash implements Dimension{
    constructor(private readonly value: number[]){

    }
    public hasSameValueAs(other: CanvasState): boolean{
        if(this.value.length !== other.lineDash.length){
            return false;
        }
        for(let i=0; i<this.value.length;i++){
            if(this.value[i] !== other.lineDash[i]){
                return false;
            }
        }
        return true;
    }
    public getInstruction(): Instruction{
        return new SimpleInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
            context.setLineDash(this.value.map(s => s * transformation.scale))
        });
    }
}