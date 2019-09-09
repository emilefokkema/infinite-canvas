import { Transformation } from "./transformation"
import { Rectangle } from "./rectangle";
import { Point } from "./point";

export interface InfiniteCanvasDrawingInstruction{
	apply(context: CanvasRenderingContext2D, transformation: Transformation): void;
	area?: Point | Rectangle;
}