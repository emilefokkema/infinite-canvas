import {Point} from "../geometry/point";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export interface ViewboxInfinity{
    drawLineToInfinityFromPointInDirection(context: CanvasRenderingContext2D, rectangle: CanvasRectangle, fromPoint: Point, direction: Point): void;
    moveToInfinityFromPointInDirection(context: CanvasRenderingContext2D, rectangle: CanvasRectangle, fromPoint: Point, direction: Point): void;
    drawLineFromInfinityFromPointToPoint(context: CanvasRenderingContext2D, rectangle: CanvasRectangle, point: Point, direction: Point): void;
    drawLineFromInfinityFromPointToInfinityFromPoint(context: CanvasRenderingContext2D, rectangle: CanvasRectangle, point1: Point, point2: Point, direction: Point): void;
    drawLineToInfinityFromInfinityFromPoint(context: CanvasRenderingContext2D, rectangle: CanvasRectangle, point: Point, fromDirection: Point, toDirection: Point): void;
    clearRect(context: CanvasRenderingContext2D, rectangle: CanvasRectangle, x: number, y: number, width: number, height: number): void;
    addPathAroundViewbox(context: CanvasRenderingContext2D, rectangle: CanvasRectangle): void;
}
