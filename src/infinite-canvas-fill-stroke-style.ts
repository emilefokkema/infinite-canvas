import { InstructionBuilder } from "./instruction-builders/instruction-builder";

export abstract class InfiniteCanvasFillStrokeStyle {
    public abstract applyToDrawingInstruction(drawingInstruction: InstructionBuilder, setFillOrStrokeStyle: (context: CanvasRenderingContext2D, fillOrStrokeStyle: string | CanvasGradient | CanvasPattern) => void, transform: boolean): void;
}