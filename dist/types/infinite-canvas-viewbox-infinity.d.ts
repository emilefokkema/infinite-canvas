import { ViewboxInfinity } from "./interfaces/viewbox-infinity";
import { Point } from "./geometry/point";
import { Transformation } from "./transformation";
import { CanvasRectangle } from "./rectangle/canvas-rectangle";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
export declare class InfiniteCanvasViewboxInfinity implements ViewboxInfinity {
    private readonly rectangle;
    private readonly state;
    private readonly getLineDashPeriod;
    private readonly getDrawnLineWidth;
    constructor(rectangle: CanvasRectangle, state: InfiniteCanvasState, getLineDashPeriod: () => number, getDrawnLineWidth: () => number);
    addPathAroundViewbox(context: CanvasRenderingContext2D): void;
    private getTransformedViewbox;
    clearRect(context: CanvasRenderingContext2D, transformation: Transformation, x: number, y: number, width: number, height: number): void;
    moveToInfinityFromPointInDirection(context: CanvasRenderingContext2D, transformation: Transformation, fromPoint: Point, direction: Point): void;
    drawLineToInfinityFromInfinityFromPoint(context: CanvasRenderingContext2D, transformation: Transformation, point: Point, fromDirection: Point, toDirection: Point): void;
    drawLineFromInfinityFromPointToInfinityFromPoint(context: CanvasRenderingContext2D, transformation: Transformation, point1: Point, point2: Point, direction: Point): void;
    drawLineFromInfinityFromPointToPoint(context: CanvasRenderingContext2D, transformation: Transformation, point: Point, direction: Point): void;
    drawLineToInfinityFromPointInDirection(context: CanvasRenderingContext2D, transformation: Transformation, fromPoint: Point, direction: Point): void;
    private ensureDistanceCoveredIsMultipleOfLineDashPeriod;
    private lineToTransformed;
    private moveToTransformed;
    private getDistanceLeft;
}
