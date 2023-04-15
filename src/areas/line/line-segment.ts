import { Area } from "../area";
import { ConvexPolygon } from "../polygons/convex-polygon";
import { Point } from "../../geometry/point";
import { Transformation } from "../../transformation";
import { empty } from "../empty";
import { HalfPlaneLineIntersection } from "../polygons/half-plane-line-intersection";
import { SubsetOfLine } from "./subset-of-line";
import { Ray } from "./ray";
import { Line } from "./line";
import { HalfPlane } from '../polygons/half-plane';

export class LineSegment extends SubsetOfLine implements Area{
    constructor(public point1: Point, public point2: Point){
        super(point1, point2.minus(point1));
    }
    public getVertices(): Point[]{
        return [this.point1, this.point2]
    }
    public join(area: Area): Area{
        return area.expandToIncludePoint(this.point1).expandToIncludePoint(this.point2)
    }
    public intersectWith(area: Area): Area {
        return area.intersectWithLineSegment(this);
    }
    public intersectWithLineSegment(other: LineSegment): Area{
        if(this.isContainedByLineSegment(other)){
            return this;
        }
        if(other.isContainedByLineSegment(this)){
            return other;
        }
        if(!this.lineSegmentIsOnSameLine(other)){
            return empty;
        }
        let {point1: otherPoint1, point2: otherPoint2} = this.getPointsInSameDirection(other.point1, other.point2);
        if(this.comesBefore(otherPoint2, this.point1) || this.comesBefore(this.point2, otherPoint1)){
            return empty;
        }
        if(this.comesBefore(this.point1, otherPoint1)){
            return new LineSegment(otherPoint1, this.point2);
        }
        return new LineSegment(this.point1, otherPoint2);
    }
    public intersectWithRay(ray: Ray): Area{
        return ray.intersectWithLineSegment(this);
    }
    public intersectWithLine(line: Line): Area{
        return line.intersectWithLineSegment(this);
    }
    public isContainedByRay(ray: Ray): boolean{
        return ray.containsPoint(this.point1) && ray.containsPoint(this.point2);
    }
    public isContainedByLine(line: Line): boolean{
        return line.intersectsSubsetOfLine(this);
    }
    public isContainedByLineSegment(other: LineSegment): boolean{
        return other.containsPoint(this.point1) && other.containsPoint(this.point2);
    }
    public intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area {
        if(!this.intersectsConvexPolygon(convexPolygon)){
            return empty;
        }
        if(this.isContainedByConvexPolygon(convexPolygon)){
            return this;
        }
        const intersections: HalfPlaneLineIntersection[] = convexPolygon.getIntersectionsWithLine(this.point1, this.direction);
        let point1: Point = this.point1;
        let point2: Point = this.point2;
        for(let intersection of intersections){
            if(this.pointIsBetweenPoints(intersection.point, point1, point2)){
                if(intersection.halfPlane.normalTowardInterior.dot(this.direction) > 0){
                    point1 = intersection.point;
                }else{
                    point2 = intersection.point;
                }
            }
        }
        return new LineSegment(point1, point2);
    }
    public isContainedByConvexPolygon(other: ConvexPolygon): boolean {
        return other.containsPoint(this.point1) && other.containsPoint(this.point2);
    }
    public contains(other: Area): boolean {
        return other.isContainedByLineSegment(this);
    }
    private pointIsStrictlyBetweenPoints(point: Point, one: Point, other: Point): boolean{
        return point.minus(one).dot(this.direction) * point.minus(other).dot(this.direction) < 0;
    }
    private containsPoint(point: Point): boolean{
        return this.pointIsOnSameLine(point) && this.pointIsBetweenPoints(point, this.point1, this.point2)
    }
    protected interiorContainsPoint(point: Point): boolean{
        return this.pointIsOnSameLine(point) && this.pointIsStrictlyBetweenPoints(point, this.point1, this.point2);
    }
    public intersectsRay(ray: Ray): boolean{
        return ray.intersectsLineSegment(this);
    }
    public intersectsLineSegment(other: LineSegment): boolean{
        if(this.isContainedByLineSegment(other) || other.isContainedByLineSegment(this)){
            return true;
        }
        if(!this.lineSegmentIsOnSameLine(other)){
            return false;
        }
        const {point1, point2} = this.getPointsInSameDirection(other.point1, other.point2);
        return !this.comesBefore(point2, this.point1) && !this.comesBefore(this.point2, point1);
    }
    public intersectsLine(line: Line): boolean{
        return line.intersectsSubsetOfLine(this);
    }
    public intersects(other: Area): boolean {
        return other.intersectsLineSegment(this);
    }
    public expandByDistance(distance: number): ConvexPolygon{
        const expandedLine = this.expandLineByDistance(distance);
        const expandedLimitingHalfPlane1 = new HalfPlane(this.base, this.direction).expandByDistance(distance);
        const expandedLimitingHalfPlane2 = new HalfPlane(this.point2, this.direction.scale(-1)).expandByDistance(distance);
        return expandedLine.intersectWithConvexPolygon(new ConvexPolygon([expandedLimitingHalfPlane1, expandedLimitingHalfPlane2]));
    }
    public expandToIncludePoint(point: Point): Area {
        if(this.containsPoint(point)){
            return this;
        }
        if(this.pointIsOnSameLine(point)){
            if(this.comesBefore(point, this.point1)){
                return new LineSegment(point, this.point2);
            }
            return new LineSegment(this.point1, point);
        }
        return ConvexPolygon.createTriangle(this.point1, point, this.point2);
    }
    public expandToIncludeInfinityInDirection(direction: Point): Area{
        if(direction.inSameDirectionAs(this.direction)){
            return new Ray(this.point1, direction);
        }
        if(direction.cross(this.direction) === 0){
            return new Ray(this.point2, direction);
        }
        return ConvexPolygon.createTriangleWithInfinityInDirection(this.point1, this.point2, direction);
    }
    public transform(transformation: Transformation): Area {
        return new LineSegment(transformation.apply(this.point1), transformation.apply(this.point2));
    }
}
