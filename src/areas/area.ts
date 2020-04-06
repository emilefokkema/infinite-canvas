import { Point } from "../geometry/point";
import { ConvexPolygon } from "./polygons/convex-polygon";
import { Transformation } from "../transformation";
import { LineSegment } from "./line/line-segment";
import { Ray } from "./line/ray";
import { Line } from "./line/line";

export interface Area{
    intersectWith(area: Area): Area;
    intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area;
    intersectWithLineSegment(lineSegment: LineSegment): Area;
    intersectWithRay(ray: Ray): Area;
    intersectWithLine(line: Line): Area;
    isContainedByConvexPolygon(other: ConvexPolygon): boolean;
    isContainedByLineSegment(lineSegment: LineSegment): boolean;
    isContainedByRay(ray: Ray): boolean;
    isContainedByLine(line: Line): boolean;
    contains(other: Area): boolean;
    intersectsConvexPolygon(other: ConvexPolygon): boolean;
    intersectsLineSegment(lineSegment: LineSegment): boolean;
    intersectsRay(ray: Ray): boolean;
    intersectsLine(line: Line): boolean;
    intersects(other: Area): boolean;
    expandToIncludePoint(point: Point): Area;
    expandToIncludeInfinityInDirection(direction: Point): Area;
    transform(transformation: Transformation): Area;
}
