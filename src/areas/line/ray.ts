import { Point } from "../../geometry/point";
import { Area } from "../area";
import { Transformation } from "../../transformation";
import { ConvexPolygon } from "../polygons/convex-polygon";
import { LineSegment } from "./line-segment";
import { SubsetOfLine } from "./subset-of-line";
import { empty } from "../empty";
import { HalfPlaneLineIntersection } from "../polygons/half-plane-line-intersection";
import { Line } from "./line";
import { HalfPlane } from "../polygons/half-plane";

export class Ray extends SubsetOfLine implements Area{
    public intersectWith(area: Area): Area {
        return area.intersectWithRay(this);
    }
    public intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area {
        if(!this.intersectsConvexPolygon(convexPolygon)){
            return empty;
        }
        if(this.isContainedByConvexPolygon(convexPolygon)){
            return this;
        }
        const intersections: HalfPlaneLineIntersection[] = convexPolygon.getIntersectionsWithLine(this.base, this.direction);
        let point1: Point = this.base;
        let point2: Point;
        for(let intersection of intersections){
            if(!point2 && this.comesBefore(point1, intersection.point) || point2 && this.pointIsBetweenPoints(intersection.point, point1, point2)){
                if(intersection.halfPlane.normalTowardInterior.dot(this.direction) > 0){
                    point1 = intersection.point;
                }else{
                    point2 = intersection.point;
                }
            }
        }
        if(point2){
            return new LineSegment(point1, point2);
        }
        return new Ray(point1, this.direction);
    }
    public intersectWithRay(ray: Ray): Area{
        if(this.isContainedByRay(ray)){
            return this;
        }
        if(ray.isContainedByRay(this)){
            return ray;
        }
        if(!this.interiorContainsPoint(ray.base)){
            return empty;
        }
        return new LineSegment(this.base, ray.base);
    }
    public intersectWithLine(line: Line): Area{
        return line.intersectWithRay(this);
    }
    public intersectWithLineSegment(lineSegment: LineSegment): Area {
        if(lineSegment.isContainedByRay(this)){
            return lineSegment;
        }
        if(!this.lineSegmentIsOnSameLine(lineSegment)){
            return empty;
        }
        let {point2: otherPoint2} = this.getPointsInSameDirection(lineSegment.point1, lineSegment.point2);
        if(this.comesBefore(otherPoint2, this.base)){
            return empty;
        }
        return new LineSegment(this.base, otherPoint2);
    }
    public isContainedByConvexPolygon(other: ConvexPolygon): boolean {
        return other.containsPoint(this.base) && other.containsInfinityInDirection(this.direction);
    }
    public isContainedByRay(ray: Ray): boolean{
        return ray.containsPoint(this.base) && ray.containsInfinityInDirection(this.direction);
    }
    public isContainedByLine(line: Line): boolean{
        return line.intersectsSubsetOfLine(this);
    }
    public isContainedByLineSegment(lineSegment: LineSegment): boolean {
        return false;
    }
    public contains(other: Area): boolean {
        return other.isContainedByRay(this);
    }
    public intersectsRay(ray: Ray): boolean{
        return this.isContainedByRay(ray) || ray.isContainedByRay(this) || this.interiorContainsPoint(ray.base);
    }
    public intersectsLine(line: Line): boolean{
        return line.intersectsSubsetOfLine(this);
    }
    public intersectsLineSegment(lineSegment: LineSegment): boolean {
        if(lineSegment.isContainedByRay(this)){
            return true;
        }
        if(!this.lineSegmentIsOnSameLine(lineSegment)){
            return false;
        }
        let {point2: otherPoint2} = this.getPointsInSameDirection(lineSegment.point1, lineSegment.point2);
        if(this.comesBefore(otherPoint2, this.base)){
            return false;
        }
        return true;
    }
    public intersects(other: Area): boolean {
        return other.intersectsRay(this);
    }
    public expandToIncludePoint(point: Point): Area {
        if(this.containsPoint(point)){
            return this;
        }
        if(this.pointIsOnSameLine(point)){
            return new Ray(point, this.direction);
        }
        return ConvexPolygon.createTriangleWithInfinityInDirection(this.base, point, this.direction);
    }
    public expandToIncludeInfinityInDirection(direction: Point): Area{
        if(direction.inSameDirectionAs(this.direction)){
            return this;
        }
        const cross: number = this.direction.cross(direction);
        if(cross === 0){
            return new Line(this.base, this.direction);
        }
        return ConvexPolygon.createTriangleWithInfinityInTwoDirections(this.base, this.direction, direction);
    }
    public transform(transformation: Transformation): Area {
        const baseTransformed: Point = transformation.apply(this.base);
        return new Ray(baseTransformed, transformation.apply(this.base.plus(this.direction)).minus(baseTransformed));
    }
    protected interiorContainsPoint(point: Point): boolean{
        return this.pointIsOnSameLine(point) && !this.comesBefore(point, this.base);
    }
    public containsInfinityInDirection(direction: Point): boolean{
        return this.direction.inSameDirectionAs(direction);
    }
    public containsPoint(point: Point): boolean{
        return this.pointIsOnSameLine(point) && this.comesBefore(this.base, point);
    }
}
