import { SubsetOfLine } from "./subset-of-line";
import { Area } from "../area";
import { Transformation } from "../../transformation";
import { ConvexPolygon } from "../polygons/convex-polygon";
import { Point } from "../../geometry/point";
import { LineSegment } from "./line-segment";
import { Ray } from "./ray";
export declare class Line extends SubsetOfLine implements Area {
    intersectWith(area: Area): Area;
    intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area;
    intersectWithLine(line: Line): Area;
    intersectWithLineSegment(lineSegment: LineSegment): Area;
    intersectWithRay(ray: Ray): Area;
    isContainedByConvexPolygon(other: ConvexPolygon): boolean;
    isContainedByLine(line: Line): boolean;
    isContainedByLineSegment(lineSegment: LineSegment): boolean;
    isContainedByRay(ray: Ray): boolean;
    contains(other: Area): boolean;
    intersectsLine(line: Line): boolean;
    intersectsSubsetOfLine(subset: SubsetOfLine): boolean;
    intersectsLineSegment(lineSegment: LineSegment): boolean;
    intersectsRay(ray: Ray): boolean;
    intersects(other: Area): boolean;
    expandToIncludePoint(point: Point): Area;
    expandToIncludeInfinityInDirection(direction: Point): Area;
    transform(transformation: Transformation): Area;
    protected interiorContainsPoint(point: Point): boolean;
}
