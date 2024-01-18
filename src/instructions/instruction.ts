import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export type Instruction = (context: CanvasRenderingContext2D, rectangle: CanvasRectangle) => void;
export type MinimalInstruction = (context: CanvasRenderingContext2D) => void

export const noopInstruction: MinimalInstruction = () => {}