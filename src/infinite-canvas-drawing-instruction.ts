import { Transformation } from "./transformation"

export interface InfiniteCanvasDrawingInstruction{
	apply(context: CanvasRenderingContext2D, transformation: Transformation): void;
}