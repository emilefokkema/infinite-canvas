import { Point } from "../../geometry/point";
import { Area } from "../area";
import { Transformation } from "../../transformation";
import { ConvexPolygon } from "../polygons/convex-polygon";
import { LineSegment } from "./line-segment";
import { SubsetOfLine } from "./subset-of-line";
import { Line } from "./line";
export declare class Ray extends SubsetOfLine implements Area {
    intersectWith(area: Area): Area;
    intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area;
    intersectWithRay(ray: Ray): Area;
    intersectWithLine(line: Line): Area;
    intersectWithLineSegment(lineSegment: LineSegment): Area;
    isContainedByConvexPolygon(other: ConvexPolygon): boolean;
    isContainedByRay(ray: Ray): boolean;
    isContainedByLine(line: Line): boolean;
    isContainedByLineSegment(lineSegment: LineSegment): boolean;
    contains(other: Area): boolean;
    intersectsRay(ray: Ray): boolean;
    intersectsLine(line: Line): boolean;
    intersectsLineSegment(lineSegment: LineSegment): boolean;
    intersects(other: Area): boolean;
    expandToIncludePoint(point: Point): Area;
    expandToIncludeInfinityInDirection(direction: Point): Area;
    transform(transformation: Transformation): Area;
    protected interiorContainsPoint(point: Point): boolean;
    containsInfinityInDirection(direction: Point): boolean;
    containsPoint(point: Point): boolean;
}
