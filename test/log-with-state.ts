import { logInstruction } from "./log-instruction";
import { Transformation } from "../src/transformation";
import { InstructionSet } from "../src/interfaces/instruction-set";

export function logWithState(withState: InstructionSet): string[]{
    return logInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {withState.execute(context, transformation);})
}