import { Point } from "../../geometry/point";
import { HalfPlane } from "./half-plane";
export declare class PolygonVertex {
    readonly point: Point;
    halfPlane1: HalfPlane;
    halfPlane2: HalfPlane;
    readonly normal1: Point;
    readonly normal2: Point;
    constructor(point: Point, halfPlane1: HalfPlane, halfPlane2: HalfPlane);
    isExpandableToContainPoint(point: Point): boolean;
    isInSameHalfPlaneAs(point: Point): boolean;
    getHalfPlaneContaining(point: Point): HalfPlane;
    expandToContainPoint(point: Point): {
        newHalfPlane: HalfPlane;
        newVertex: PolygonVertex;
    };
    isContainedByHalfPlaneWithNormal(normal: Point): boolean;
    containsPoint(point: Point): boolean;
    containsLineSegmentWithDirection(direction: Point): boolean;
    isContainedByVertex(other: PolygonVertex): boolean;
}
