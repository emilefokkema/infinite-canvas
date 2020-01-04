import { Instruction } from "../instructions/instruction";
import { Transformation } from "../transformation";

export class InstructionBuilder{
    constructor(protected instruction: Instruction){}
    public build(): Instruction{
        return this.instruction;
    }
    public transformAbsolute(): void{
        const previous: Instruction = this.instruction;
        this.instruction = (context: CanvasRenderingContext2D, transformation: Transformation) => {
            const {a, b, c, d, e, f} = transformation;
            context.save();
            context.setTransform(a, b, c, d, e, f);
            previous(context, transformation);
            context.restore();
        };
    }
    public transformRelative(): void{
        const previous: Instruction = this.instruction;
        this.instruction = (context: CanvasRenderingContext2D, transformation: Transformation) => {
            const {a, b, c, d, e, f} = transformation;
            context.save();
            context.transform(a, b, c, d, e, f);
            previous(context, transformation);
            context.restore();
        };
    }
    public prepend(instructionToPrepend: Instruction): void{
        const previous: Instruction = this.instruction;
        this.instruction = (context: CanvasRenderingContext2D, transformation: Transformation) => {
            instructionToPrepend(context, transformation);
            previous(context, transformation);
        };
    }
}