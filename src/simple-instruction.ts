import { Transformation } from "./transformation";
import { Instruction } from "./instruction";

export class SimpleInstruction implements Instruction{
    constructor(private readonly instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => void){

    }
    public apply(context: CanvasRenderingContext2D, transformation: Transformation): void{
        this.instruction(context, transformation);
    }
    public after(other: Instruction): SimpleInstruction{
        return new SimpleInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
            other.apply(context, transformation);
            this.instruction(context, transformation);
        });
    }
    public before(other: Instruction): SimpleInstruction{
        return new SimpleInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
            this.instruction(context, transformation);
            other.apply(context, transformation);
        });
    }
}