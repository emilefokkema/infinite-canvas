import { Point } from "../../geometry/point";
import { HalfPlane } from "./half-plane";

export class PolygonVertex{
    public readonly normal1: Point;
    public readonly normal2: Point;
    constructor(public readonly point: Point, public halfPlane1: HalfPlane, public halfPlane2: HalfPlane){
        this.normal1 = halfPlane1.normalTowardInterior;
        this.normal2 = halfPlane2.normalTowardInterior;
    }
    public isExpandableToContainPoint(point: Point): boolean{
        return this.halfPlane1.interiorContainsPoint(point) || this.halfPlane2.interiorContainsPoint(point);
    }
    public isInSameHalfPlaneAs(point: Point): boolean{
        return this.halfPlane1.containsPoint(point) || this.halfPlane2.containsPoint(point);
    }
    public getHalfPlaneContaining(point: Point): HalfPlane{
        return this.halfPlane1.containsPoint(point) ? this.halfPlane1 : this.halfPlane2;
    }
    public expandToContainPoint(point: Point): {newHalfPlane: HalfPlane, newVertex: PolygonVertex}{
        const halfPlaneToKeep: HalfPlane = this.halfPlane1.interiorContainsPoint(point) ? this.halfPlane1 : this.halfPlane2;
        let directionOfNewHalfPlane: Point = point.minus(this.point).getPerpendicular();
        if(!this.isContainedByHalfPlaneWithNormal(directionOfNewHalfPlane)){
            directionOfNewHalfPlane = directionOfNewHalfPlane.scale(-1);
        }
        const newHalfPlane: HalfPlane = new HalfPlane(this.point, directionOfNewHalfPlane);
        return {
            newHalfPlane: newHalfPlane,
            newVertex: new PolygonVertex(this.point, halfPlaneToKeep, newHalfPlane)
        };

    }
    public isContainedByHalfPlaneWithNormal(normal: Point): boolean{
        return normal.isInSmallerAngleBetweenPoints(this.normal1, this.normal2);
    }
    public containsPoint(point: Point): boolean{
        return this.halfPlane1.containsPoint(point) && this.halfPlane2.containsPoint(point);
    }
    public containsLineSegmentWithDirection(direction: Point): boolean{
        return this.containsPoint(this.point.plus(direction)) || this.containsPoint(this.point.minus(direction));
    }
    public isContainedByVertex(other: PolygonVertex): boolean{
        return this.isContainedByHalfPlaneWithNormal(other.normal1) && this.isContainedByHalfPlaneWithNormal(other.normal2);
    }
}