import { logInstruction } from "./log-instruction";
import { Transformation } from "../src/transformation";
import { WithStateAndInstruction } from "../src/instructions/with-state-and-instruction";

export function logWithState(withState: WithStateAndInstruction): string[]{
    return logInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {withState.execute(context, transformation);})
}