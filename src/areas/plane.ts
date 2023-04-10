import { Area } from "./area";
import { ConvexPolygon } from "./polygons/convex-polygon";
import { Point } from "../geometry/point";
import { Transformation } from "../transformation";
import { LineSegment } from "./line/line-segment";
import { Ray } from "./line/ray";
import { Line } from "./line/line";

class Plane implements Area{
    public expandToIncludePoint(point: Point): Area {
        return this;
    }
    public expandToIncludePolygon(polygon: ConvexPolygon): Area {
        return this;
    }
    public expandToIncludeInfinityInDirection(direction: Point): Area{
        return this;
    }
    public expandByDistance(distance: number): Area{
        return this;
    }
    public intersects(area: Area): boolean{
        return true;
    }
    public expandToInclude(area: Area): Area{
        return this;
    }
    public transform(transformation: Transformation): Area{
        return this;
    }
    public intersectWithLineSegment(other: LineSegment): Area{
        return other;
    }
    public contains(other: Area): boolean{
        return true;
    }
    public intersectWith(area: Area): Area {
        return area;
    }
    public join(area: Area): Area{
        return this;
    }
    public intersectWithRay(ray: Ray): Area{
        return ray;
    }
    public intersectWithLine(line: Line): Area{
        return line;
    }
    public intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area {
        return convexPolygon;
    }
    public isContainedByRay(ray: Ray): boolean{
        return false;
    }
    public isContainedByLineSegment(other: LineSegment): boolean{
        return false;
    }
    public isContainedByLine(line: Line): boolean{
        return false;
    }
    public isContainedByConvexPolygon(other: ConvexPolygon): boolean{
        return false;
    }
    public intersectsRay(ray: Ray): boolean{
        return true;
    }
    public intersectsLineSegment(lineSegment: LineSegment): boolean{
        return true;
    }
    public intersectsLine(line: Line): boolean{
        return true;
    }
    public intersectsConvexPolygon(other: ConvexPolygon): boolean{
        return true;
    }
}
export const plane: Plane = new Plane();