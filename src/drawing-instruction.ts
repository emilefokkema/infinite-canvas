import { Transformation } from "./transformation"
import { Rectangle } from "./rectangle";
import { Point } from "./point";

export interface DrawingInstruction{
	apply(context: CanvasRenderingContext2D, transformation: Transformation): void;
	area?: Point | Rectangle;
}