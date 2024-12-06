import { logInstruction } from "./log-instruction";
import { ExecutableInstruction } from "src/interfaces/executable-instruction";
import { CanvasRectangle } from "src/rectangle/canvas-rectangle";

export function logWithState(withState: ExecutableInstruction): string[]{
    return logInstruction((context: CanvasRenderingContext2D, rectangle: CanvasRectangle) => {withState.execute(context, rectangle);})
}