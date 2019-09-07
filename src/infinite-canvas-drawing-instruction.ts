import { Transformation } from "./transformation"
import { Rectangle } from "./rectangle";

export interface InfiniteCanvasDrawingInstruction{
	apply(context: CanvasRenderingContext2D, transformation: Transformation): void;
	rectangle?: Rectangle;
}