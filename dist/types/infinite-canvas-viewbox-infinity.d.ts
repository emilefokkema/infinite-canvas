import { ViewboxInfinity } from "./interfaces/viewbox-infinity";
import { Point } from "./geometry/point";
import { Transformation } from "./transformation";
import { ConvexPolygon } from "./areas/polygons/convex-polygon";
export declare class InfiniteCanvasViewboxInfinity implements ViewboxInfinity {
    private readonly getTransformedViewbox;
    private readonly getViewBoxTransformation;
    private readonly getLineDashPeriod;
    constructor(getTransformedViewbox: () => ConvexPolygon, getViewBoxTransformation: () => Transformation, getLineDashPeriod: () => number);
    clearRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void;
    moveToInfinityFromPointInDirection(context: CanvasRenderingContext2D, fromPoint: Point, direction: Point): void;
    drawLineToInfinityFromInfinityFromPoint(context: CanvasRenderingContext2D, point: Point, fromDirection: Point, toDirection: Point): void;
    drawLineFromInfinityFromPointToInfinityFromPoint(context: CanvasRenderingContext2D, point1: Point, point2: Point, direction: Point): void;
    drawLineFromInfinityFromPointToPoint(context: CanvasRenderingContext2D, point: Point, direction: Point): void;
    drawLineToInfinityFromPointInDirection(context: CanvasRenderingContext2D, fromPoint: Point, direction: Point): void;
    private ensureDistanceCoveredIsMultipleOfLineDashPeriod;
    private lineToTransformed;
    private moveToTransformed;
    private getDistanceLeft;
}
