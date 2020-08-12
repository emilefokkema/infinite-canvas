import { Point } from "../../geometry/point";
import { Transformation } from "../../transformation";
import { HalfPlaneLineIntersection } from "./half-plane-line-intersection";
import { PolygonVertex } from "./polygon-vertex";
export declare class HalfPlane {
    readonly base: Point;
    readonly normalTowardInterior: Point;
    private readonly lengthOfNormal;
    constructor(base: Point, normalTowardInterior: Point);
    getDistanceFromEdge(point: Point): number;
    transform(transformation: Transformation): HalfPlane;
    complement(): HalfPlane;
    expandByDistance(distance: number): HalfPlane;
    expandToIncludePoint(point: Point): HalfPlane;
    containsPoint(point: Point): boolean;
    interiorContainsPoint(point: Point): boolean;
    containsInfinityInDirection(direction: Point): boolean;
    isContainedByHalfPlane(halfPlane: HalfPlane): boolean;
    intersectWithLine(point: Point, direction: Point): HalfPlaneLineIntersection;
    isParallelToLine(point: Point, direction: Point): boolean;
    getIntersectionWith(other: HalfPlane): PolygonVertex;
    static throughPointsAndContainingPoint(throughPoint1: Point, throughPoint2: Point, containingPoint: Point): HalfPlane;
    static withBorderPointAndInfinityInDirection(borderPoint: Point, direction: Point): HalfPlane[];
    static withBorderPoints(point1: Point, point2: Point): HalfPlane[];
}
