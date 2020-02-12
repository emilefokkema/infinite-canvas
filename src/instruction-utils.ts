import { Instruction } from "./instructions/instruction";
import { Transformation } from "./transformation";

export function transformInstructionAbsolutely(instruction: Instruction): Instruction{
    return (context: CanvasRenderingContext2D, transformation: Transformation) => {
        const {a, b, c, d, e, f} = transformation;
        context.save();
        context.setTransform(a, b, c, d, e, f);
        instruction(context, transformation);
        context.restore();
    };
}

export function transformInstructionRelatively(instruction: Instruction): Instruction{
    return (context: CanvasRenderingContext2D, transformation: Transformation) => {
        const {a, b, c, d, e, f} = transformation;
        context.save();
        context.transform(a, b, c, d, e, f);
        instruction(context, transformation);
        context.restore();
    };
}

export function prependToInstruction(toPrepend: Instruction, toInstruction: Instruction){
    if(!toPrepend){
        return toInstruction;
    }
    return (context: CanvasRenderingContext2D, transformation: Transformation) => {
        toPrepend(context, transformation);
        toInstruction(context, transformation);
    };
}