import { logInstruction } from "./log-instruction";
import { Transformation } from "../src/transformation";
import { ExecutableInstruction } from "../src/interfaces/executable-instruction";

export function logWithState(withState: ExecutableInstruction): string[]{
    return logInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {withState.execute(context, transformation);})
}