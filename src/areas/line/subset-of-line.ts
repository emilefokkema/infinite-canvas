import { Point } from "../../geometry/point";
import { LineSegment } from "./line-segment";
import { ConvexPolygon } from "../polygons/convex-polygon";
import { HalfPlaneLineIntersection } from "../polygons/half-plane-line-intersection";

export abstract class SubsetOfLine{
    constructor(public base: Point, public direction: Point){}
    protected pointIsOnSameLine(point: Point): boolean{
        return point.minus(this.base).cross(this.direction) === 0;
    }
    protected comesBefore(point1: Point, point2: Point): boolean{
        return point2.minus(point1).dot(this.direction) >= 0;
    }
    protected lineSegmentIsOnSameLine(other: LineSegment): boolean{
        return this.direction.cross(other.direction) === 0 && this.pointIsOnSameLine(other.point1)
    }
    protected getPointsInSameDirection(point1: Point, point2: Point): {point1: Point, point2: Point}{
        if(this.comesBefore(point2, point1)){
            return {point1: point2, point2: point1};
        }
        return {point1, point2};
    }
    protected pointIsBetweenPoints(point: Point, one: Point, other: Point): boolean{
        return point.minus(one).dot(this.direction) * point.minus(other).dot(this.direction) <= 0;
    }
    protected abstract interiorContainsPoint(point: Point): boolean;
    public abstract isContainedByConvexPolygon(other: ConvexPolygon): boolean;
    public intersectsConvexPolygon(other: ConvexPolygon): boolean {
        if(this.isContainedByConvexPolygon(other)){
            return true;
        }
        const intersections: HalfPlaneLineIntersection[] = other.getIntersectionsWithLine(this.base, this.direction);
        for(let intersection of intersections){
            if(this.interiorContainsPoint(intersection.point)){
                return true;
            }
        }
        return false;
    }
}