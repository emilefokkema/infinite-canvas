import { SubsetOfLine } from "./subset-of-line";
import { Area } from "../area";
import { Transformation } from "../../transformation";
import { ConvexPolygon } from "../polygons/convex-polygon";
import { Point } from "../../geometry/point";
import { LineSegment } from "./line-segment";
import { Ray } from "./ray";
import { empty } from "../empty";
import { HalfPlaneLineIntersection } from "../polygons/half-plane-line-intersection";
import { HalfPlane } from "../polygons/half-plane";

export class Line extends SubsetOfLine implements Area{
    public getVertices(): Point[]{
        return []
    }
    public intersectWith(area: Area): Area {
        return area.intersectWithLine(this);
    }
    public join(area: Area): Area{
        return area.expandToIncludeInfinityInDirection(this.direction).expandToIncludeInfinityInDirection(this.direction.scale(-1))
    }
    public intersectWithConvexPolygon(convexPolygon: ConvexPolygon): Area {
        if(!this.intersectsConvexPolygon(convexPolygon)){
            return empty;
        }
        if(this.isContainedByConvexPolygon(convexPolygon)){
            return this;
        }
        const intersections: HalfPlaneLineIntersection[] = convexPolygon.getIntersectionsWithLine(this.base, this.direction);
        let point1: Point;
        let point2: Point;
        for(let intersection of intersections){
            if(!point1 && !point2 || 
                !point1 && this.comesBefore(intersection.point, point2) ||
                !point2 && this.comesBefore(point1, intersection.point) ||
                point1 && point2 && this.pointIsBetweenPoints(intersection.point, point1, point2)){
                    if(intersection.halfPlane.normalTowardInterior.dot(this.direction) > 0){
                        point1 = intersection.point;
                    }else{
                        point2 = intersection.point;
                    }
            }
        }
        if(point1 && point2){
            return new LineSegment(point1, point2);
        }
        if(point1){
            return new Ray(point1, this.direction);
        }
        return new Ray(point2, this.direction.scale(-1));
    }
    public intersectWithLine(line: Line): Area{
        if(!this.intersectsLine(line)){
            return empty;
        }
        return this;
    }
    public intersectWithLineSegment(lineSegment: LineSegment): Area {
        if(!this.lineSegmentIsOnSameLine(lineSegment)){
            return empty;
        }
        return lineSegment;
    }
    public intersectWithRay(ray: Ray): Area {
        if(!this.intersectsRay(ray)){
            return empty;
        }
        return ray;
    }
    public isContainedByConvexPolygon(other: ConvexPolygon): boolean{
        return other.containsPoint(this.base) && other.containsInfinityInDirection(this.direction) && other.containsInfinityInDirection(this.direction.scale(-1));
    }
    public isContainedByLine(line: Line): boolean{
        return this.intersectsSubsetOfLine(line);
    }
    public isContainedByLineSegment(lineSegment: LineSegment): boolean {
        return false;
    }
    public isContainedByRay(ray: Ray): boolean {
        return false;
    }
    public contains(other: Area): boolean {
        return other.isContainedByLine(this);
    }
    public intersectsLine(line: Line): boolean{
        return this.intersectsSubsetOfLine(line);
    }
    public intersectsSubsetOfLine(subset: SubsetOfLine): boolean{
        return this.pointIsOnSameLine(subset.base) && this.direction.cross(subset.direction) === 0;
    }
    public intersectsLineSegment(lineSegment: LineSegment): boolean {
        return this.lineSegmentIsOnSameLine(lineSegment);
    }
    public intersectsRay(ray: Ray): boolean {
        return this.intersectsSubsetOfLine(ray);
    }
    public intersects(other: Area): boolean {
        return other.intersectsLine(this);
    }
    public expandToIncludePoint(point: Point): Area {
        if(this.pointIsOnSameLine(point)){
            return this;
        }
        return ConvexPolygon.createTriangleWithInfinityInDirection(this.base, point, this.direction).expandToIncludeInfinityInDirection(this.direction.scale(-1))
    }
    public expandByDistance(distance: number): ConvexPolygon{
        return this.expandLineByDistance(distance);
    }
    public expandToIncludeInfinityInDirection(direction: Point): Area{
        const cross: number = direction.cross(this.direction);
        const perpendicular: Point = this.direction.getPerpendicular();
        if(cross === 0){
            return this;
        }
        if(cross > 0){
            return ConvexPolygon.createFromHalfPlane(new HalfPlane(this.base, perpendicular.scale(-1)));
        }
        return ConvexPolygon.createFromHalfPlane(new HalfPlane(this.base, perpendicular));
    }
    public transform(transformation: Transformation): Area {
        const baseTransformed: Point = transformation.apply(this.base);
        return new Line(baseTransformed, transformation.apply(this.base.plus(this.direction)).minus(baseTransformed));
    }
    protected interiorContainsPoint(point: Point): boolean{
        return this.pointIsOnSameLine(point);
    }

}
