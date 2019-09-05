import { Transformation } from "./transformation";

export interface ViewBox{
    addInstruction<T>(instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => T): T;
}