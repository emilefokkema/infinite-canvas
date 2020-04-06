import { Instruction } from "./instructions/instruction";
import { Transformation } from "./transformation";
import { InstructionUsingInfinity } from "./instructions/instruction-using-infinity";
import { ViewboxInfinity } from "./interfaces/viewbox-infinity";

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
export function combineInstructions(instructions: InstructionUsingInfinity[]): InstructionUsingInfinity{
    return (context: CanvasRenderingContext2D, transformation: Transformation, infinity: ViewboxInfinity) => {
        for(const instruction of instructions){
            instruction(context, transformation, infinity);
        }
    };
}
export function instructionSequence(...instructions: InstructionUsingInfinity[]): InstructionUsingInfinity{
    return (context: CanvasRenderingContext2D, transformation: Transformation, infinity: ViewboxInfinity) => {
        for(const instruction of instructions){
            instruction(context, transformation, infinity);
        }
    };
}