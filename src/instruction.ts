import { Transformation } from "./transformation";

export interface Instruction{
    apply(context: CanvasRenderingContext2D, transformation: Transformation): void;
}