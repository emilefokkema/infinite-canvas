import {Point} from "../geometry/point";

export interface ViewboxInfinity{
    drawLineToInfinityFromPointInDirection(context: CanvasRenderingContext2D, fromPoint: Point, direction: Point): void;
    moveToInfinityFromPointInDirection(context: CanvasRenderingContext2D, fromPoint: Point, direction: Point): void;
    drawLineFromInfinityFromPointToPoint(context: CanvasRenderingContext2D, point: Point, direction: Point): void;
    drawLineFromInfinityFromPointToInfinityFromPoint(context: CanvasRenderingContext2D, point1: Point, point2: Point, direction: Point): void;
    drawLineToInfinityFromInfinityFromPoint(context: CanvasRenderingContext2D, point: Point, fromDirection: Point, toDirection: Point): void;
    clearRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void;
}
