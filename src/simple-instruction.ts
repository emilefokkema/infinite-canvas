import { Transformation } from "./transformation";
import { Instruction } from "./instruction";

export class SimpleInstruction implements Instruction{
    constructor(private readonly instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => void){

    }
    public apply(context: CanvasRenderingContext2D, transformation: Transformation): void{
        this.instruction(context, transformation);
    }
}