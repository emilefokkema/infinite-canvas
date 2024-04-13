import { Point } from "../../geometry/point";
import { Transformation } from "../../transformation";
import { intersectLines } from "../../geometry/intersect-lines";
import { HalfPlaneLineIntersection } from "./half-plane-line-intersection";
import { PolygonVertex } from "./polygon-vertex";

export class HalfPlane {
    private readonly lengthOfNormal: number;
    constructor(public readonly base: Point, public readonly normalTowardInterior: Point){
        this.lengthOfNormal = normalTowardInterior.mod();
    }
    public getDistanceFromEdge(point: Point): number{
        return point.minus(this.base).dot(this.normalTowardInterior) / this.lengthOfNormal;
    }
    public transform(transformation: Transformation): HalfPlane {
        const baseTransformed: Point = transformation.apply(this.base);
        const otherPointOnBorderTransformed: Point = transformation.apply(this.base.plus(this.normalTowardInterior.getPerpendicular()));
        const pointInInteriorTransformed: Point = transformation.apply(this.base.plus(this.normalTowardInterior));
        return HalfPlane.throughPointsAndContainingPoint(baseTransformed, otherPointOnBorderTransformed, pointInInteriorTransformed);
    }
    public complement(): HalfPlane{
        return new HalfPlane(this.base, this.normalTowardInterior.scale(-1));
    }
    public expandByDistance(distance: number): HalfPlane{
        const newBase: Point = this.base.plus(this.normalTowardInterior.scale(-distance / this.normalTowardInterior.mod()));
        return new HalfPlane(newBase, this.normalTowardInterior);
    }
    public expandToIncludePoint(point: Point): HalfPlane{
        if(this.containsPoint(point)){
            return this;
        }
        return new HalfPlane(point, this.normalTowardInterior);
    }
    public containsPoint(point: Point): boolean {
        return this.getDistanceFromEdge(point) >= 0;
    }
    public interiorContainsPoint(point: Point): boolean{
        return this.getDistanceFromEdge(point) > 0;
    }
    public containsInfinityInDirection(direction: Point): boolean{
        return direction.dot(this.normalTowardInterior) >= 0;
    }
    public isContainedByHalfPlane(halfPlane: HalfPlane): boolean{
        return this.normalTowardInterior.inSameDirectionAs(halfPlane.normalTowardInterior) && halfPlane.getDistanceFromEdge(this.base) >= 0;
    }
    public intersectWithLine(point: Point, direction: Point): HalfPlaneLineIntersection{
        return {
            point:intersectLines(this.base, this.normalTowardInterior.getPerpendicular(), point, direction),
            halfPlane: this
        };
    }
    public isParallelToLine(point: Point, direction: Point): boolean{
        return this.normalTowardInterior.getPerpendicular().cross(direction) === 0;
    }
    public getIntersectionWith(other: HalfPlane): PolygonVertex{
        const halfPlaneLineIntersection: HalfPlaneLineIntersection = this.intersectWithLine(other.base, other.normalTowardInterior.getPerpendicular());
        return PolygonVertex.create(halfPlaneLineIntersection.point, this, other);
    }
    public static throughPointsAndContainingPoint(throughPoint1: Point, throughPoint2: Point, containingPoint: Point): HalfPlane{
        const throughPoints: HalfPlane[] = HalfPlane.withBorderPoints(throughPoint1, throughPoint2);
        for(let halfPlaneThroughPoints of throughPoints){
            if(halfPlaneThroughPoints.containsPoint(containingPoint)){
                return halfPlaneThroughPoints;
            }
        }
    }
    public static withBorderPointAndInfinityInDirection(borderPoint: Point, direction: Point): HalfPlane[]{
        return HalfPlane.withBorderPoints(borderPoint, borderPoint.plus(direction));
    }
    public static withBorderPoints(point1: Point, point2: Point): HalfPlane[]{
        const perpendicular: Point = point2.minus(point1).getPerpendicular();
        return [
            new HalfPlane(point1, perpendicular),
            new HalfPlane(point1, perpendicular.scale(-1))
        ];
    }
}