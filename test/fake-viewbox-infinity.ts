import { ViewboxInfinity } from "../src/interfaces/viewbox-infinity";
import { Point } from "../src/geometry/point";
import { Transformation } from "../src/transformation";

export class FakeViewboxInfinity implements ViewboxInfinity{
    clearRect(context: CanvasRenderingContext2D, transformation: Transformation, x: number, y: number, width: number, height: number): void {
        
    }

    drawLineFromInfinityFromPointToInfinityFromPoint(context: CanvasRenderingContext2D, transformation: Transformation, point1: Point, point2: Point, direction: Point): void {
    }

    drawLineFromInfinityFromPointToPoint(context: CanvasRenderingContext2D, transformation: Transformation, point: Point, direction: Point): void {
    }

    drawLineToInfinityFromInfinityFromPoint(context: CanvasRenderingContext2D, transformation: Transformation, point: Point, fromDirection: Point, toDirection: Point): void {
    }

    drawLineToInfinityFromPointInDirection(context: CanvasRenderingContext2D, transformation: Transformation, fromPoint: Point, direction: Point): void {
    }

    moveToInfinityFromPointInDirection(context: CanvasRenderingContext2D, transformation: Transformation, fromPoint: Point, direction: Point): void {
    }

    addPathAroundViewbox(context: CanvasRenderingContext2D): void{}
}
