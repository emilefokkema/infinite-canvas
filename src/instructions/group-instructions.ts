import { Instruction } from "./instruction";
import { Transformation } from "../transformation";

export function groupInstructions(instructions: Instruction[]): Instruction{
    return (context: CanvasRenderingContext2D, transformation: Transformation) => {
        for(const instruction of instructions){
            instruction(context, transformation);
        }
    };
}