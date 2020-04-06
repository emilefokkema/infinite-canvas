import { ViewboxInfinity } from "../src/interfaces/viewbox-infinity";
import { Point } from "../src/geometry/point";

export class FakeViewboxInfinity implements ViewboxInfinity{
    clearRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
        
    }
    getInfinityFromPointInDirection(fromPoint: Point, direction: Point): Point {
        throw new Error("Method not implemented.");
    }
    getInfinitiesFromDirectionFromPointToDirection(point: Point, direction1: Point, direction2: Point): Point[] {
        throw new Error("Method not implemented.");
    }

    drawLineFromInfinityFromPointToInfinityFromPoint(context: CanvasRenderingContext2D, point1: Point, point2: Point, direction: Point): void {
    }

    drawLineFromInfinityFromPointToPoint(context: CanvasRenderingContext2D, point: Point, direction: Point): void {
    }

    drawLineToInfinityFromInfinityFromPoint(context: CanvasRenderingContext2D, point: Point, fromDirection: Point, toDirection: Point): void {
    }

    drawLineToInfinityFromPointInDirection(context: CanvasRenderingContext2D, fromPoint: Point, direction: Point): void {
    }

    moveToInfinityFromPointInDirection(context: CanvasRenderingContext2D, fromPoint: Point, direction: Point): void {
    }

}
