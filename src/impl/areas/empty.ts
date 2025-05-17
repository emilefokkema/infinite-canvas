import { Area } from "./area";
import { ConvexPolygon } from "./polygons/convex-polygon";
import { Point } from "../geometry/point";
import { Transformation } from "../transformation";
import { LineSegment } from "./line/line-segment";
import { Ray } from "./line/ray";
import { Line } from "./line/line";

class Empty implements Area{
    public getVertices(): Point[]{
        return []
    }
    public intersectWith(area: Area): Area {
        return this;
    }
    public join(area: Area): Area{
        return area;
    }
    public intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area {
        return this;
    }
    public intersects(area: Area): boolean{
        return false;
    }
    public intersectWithLineSegment(other: LineSegment): Area{
        return this;
    }
    public intersectWithRay(ray: Ray): Area{
        return this;
    }
    public intersectWithLine(line: Line): Area{
        return this;
    }
    public expandToInclude(area: Area): Area{
        return area;
    }
    public transform(transformation: Transformation): Area{
        return this;
    }
    public contains(other: Area): boolean{
        return false;
    }
    public isContainedByConvexPolygon(other: ConvexPolygon): boolean{
        return true;
    }
    public isContainedByRay(ray: Ray): boolean{
        return true;
    }
    public isContainedByLineSegment(other: LineSegment): boolean{
        return true;
    }
    public isContainedByLine(line: Line): boolean{
        return true;
    }
    public intersectsRay(ray: Ray): boolean{
        return false;
    }
    public intersectsConvexPolygon(other: ConvexPolygon): boolean{
        return false;
    }
    public intersectsLineSegment(lineSegment: LineSegment): boolean{
        return false;
    }
    public intersectsLine(line: Line): boolean{
        return false;
    }
    public expandByDistance(distance: number): Area{
        return this;
    }
    public expandToIncludePoint(point: Point): Area {
        return this;
    }
    public expandToIncludeInfinityInDirection(direction: Point): Area{
        return this;
    }
    public expandToIncludePolygon(polygon: ConvexPolygon): Area {
        return polygon;
    }
}
export const empty: Empty = new Empty();