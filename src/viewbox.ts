import { Transformation } from "./transformation";
import { Rectangle } from "./rectangle";

export interface ViewBox{
    addInstruction<T>(instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => T, rectangle?: Rectangle): T;
}