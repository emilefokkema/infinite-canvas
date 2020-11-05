import { Transformation } from "./transformation";
import { InstructionUsingInfinity } from "./instructions/instruction-using-infinity";
import { ViewboxInfinity } from "./interfaces/viewbox-infinity";

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