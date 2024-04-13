import { Point } from "../../geometry/point";
import { HalfPlane } from "./half-plane";

export class PolygonVertex{
    private readonly leftNormal: Point;
    private readonly rightNormal: Point;
    constructor(public readonly point: Point, public readonly leftHalfPlane: HalfPlane, public readonly rightHalfPlane: HalfPlane){
        this.leftNormal = leftHalfPlane.normalTowardInterior;
        this.rightNormal = rightHalfPlane.normalTowardInterior;
    }
    public replaceLeftHalfPlane(newLeftHalfPlane: HalfPlane): PolygonVertex{
        return new PolygonVertex(this.point, newLeftHalfPlane, this.rightHalfPlane)
    }
    public replaceRightHalfPlane(newRightHalfPlane: HalfPlane): PolygonVertex{
        return new PolygonVertex(this.point, this.leftHalfPlane, newRightHalfPlane)
    }
    public isContainedByHalfPlaneWithNormal(normal: Point): boolean{
        return normal.isInSmallerAngleBetweenPoints(this.leftNormal, this.rightNormal);
    }
    public containsPoint(point: Point): boolean{
        return this.leftHalfPlane.containsPoint(point) && this.rightHalfPlane.containsPoint(point);
    }
    public containsLineSegmentWithDirection(direction: Point): boolean{
        return this.containsPoint(this.point.plus(direction)) || this.containsPoint(this.point.minus(direction));
    }
    public isContainedByVertex(other: PolygonVertex): boolean{
        return this.isContainedByHalfPlaneWithNormal(other.leftNormal) && this.isContainedByHalfPlaneWithNormal(other.rightNormal);
    }
    public getContainingHalfPlaneThroughPoint(point: Point): HalfPlane{
        let newNormal = point.minus(this.point).getPerpendicular();
        if(newNormal.cross(this.leftHalfPlane.normalTowardInterior) === 0){
            return this.leftHalfPlane;
        }
        if(newNormal.cross(this.rightHalfPlane.normalTowardInterior) === 0){
            return this.rightHalfPlane;
        }
        const betweenNormals = this.leftNormal.plus(this.rightNormal)
        if(newNormal.dot(betweenNormals) <= 0){
            newNormal = newNormal.scale(-1);
        }
        return new HalfPlane(point, newNormal);
    }
    public static create(point: Point, halfPlane1: HalfPlane, halfPlane2: HalfPlane): PolygonVertex{
        const cross = halfPlane1.normalTowardInterior.cross(halfPlane2.normalTowardInterior);
        if(cross >= 0){
            return new PolygonVertex(point, halfPlane1, halfPlane2)
        }else{
            return new PolygonVertex(point, halfPlane2, halfPlane1)
        }
    }
}