import { Point } from "../../geometry/point";
import { LineSegment } from "./line-segment";
import { ConvexPolygon } from "../polygons/convex-polygon";
export declare abstract class SubsetOfLine {
    base: Point;
    direction: Point;
    constructor(base: Point, direction: Point);
    protected pointIsOnSameLine(point: Point): boolean;
    protected comesBefore(point1: Point, point2: Point): boolean;
    protected lineSegmentIsOnSameLine(other: LineSegment): boolean;
    protected getPointsInSameDirection(point1: Point, point2: Point): {
        point1: Point;
        point2: Point;
    };
    protected pointIsBetweenPoints(point: Point, one: Point, other: Point): boolean;
    protected abstract interiorContainsPoint(point: Point): boolean;
    abstract isContainedByConvexPolygon(other: ConvexPolygon): boolean;
    intersectsConvexPolygon(other: ConvexPolygon): boolean;
}
