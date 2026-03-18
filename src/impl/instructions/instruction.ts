import { ViewboxInfinity } from "../interfaces/viewbox-infinity"
import { CanvasRectangle } from "../rectangle/canvas-rectangle"

export interface MinimalInstruction {
    execute(context: CanvasRenderingContext2D): void
}

export interface Instruction {
    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle): void
}

export interface InstructionUsingInfinity {
    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle, infinity: ViewboxInfinity): void
}

export const noopInstruction: MinimalInstruction = { execute(){}}