import {Point} from "../geometry/point";
import { Transformation } from "../transformation";

export interface ViewboxInfinity{
    drawLineToInfinityFromPointInDirection(context: CanvasRenderingContext2D, transformation: Transformation, fromPoint: Point, direction: Point): void;
    moveToInfinityFromPointInDirection(context: CanvasRenderingContext2D, transformation: Transformation, fromPoint: Point, direction: Point): void;
    drawLineFromInfinityFromPointToPoint(context: CanvasRenderingContext2D, transformation: Transformation, point: Point, direction: Point): void;
    drawLineFromInfinityFromPointToInfinityFromPoint(context: CanvasRenderingContext2D, transformation: Transformation, point1: Point, point2: Point, direction: Point): void;
    drawLineToInfinityFromInfinityFromPoint(context: CanvasRenderingContext2D, transformation: Transformation, point: Point, fromDirection: Point, toDirection: Point): void;
    clearRect(context: CanvasRenderingContext2D, transformation: Transformation, x: number, y: number, width: number, height: number): void;
    addPathAroundViewbox(context: CanvasRenderingContext2D): void;
}
