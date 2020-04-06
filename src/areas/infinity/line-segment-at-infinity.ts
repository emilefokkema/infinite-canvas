import { Point } from "../../geometry/point";
import { SubsetOfLineAtInfinity } from "./subset-of-line-at-infinity";
import { Area } from "../area";
import { ConvexPolygon } from "../polygons/convex-polygon";
import { HalfLineAtInfinity } from "./half-line-at-infinity";
import { lineAtInfinity } from "./line-at-infinity";

export class LineSegmentAtInfinity implements SubsetOfLineAtInfinity{
    constructor(private direction1: Point, private direction2: Point){}
    public addPoint(point: Point): Area{
        return ConvexPolygon.createTriangleWithInfinityInTwoDirections(point, this.direction1, this.direction2);
    }
    public addPointAtInfinity(direction: Point): SubsetOfLineAtInfinity{
        if(direction.isInSmallerAngleBetweenPoints(this.direction1, this.direction2)){
            return this;
        }
        if(direction.cross(this.direction1) === 0){
            return new HalfLineAtInfinity(this.direction2.projectOn(this.direction1.getPerpendicular()));
        }
        if(direction.cross(this.direction2) === 0){
            return new HalfLineAtInfinity(this.direction1.projectOn(this.direction2.getPerpendicular()));
        }
        if(this.direction1.isInSmallerAngleBetweenPoints(direction, this.direction2)){
            return new LineSegmentAtInfinity(direction, this.direction2);
        }
        if(this.direction2.isInSmallerAngleBetweenPoints(direction, this.direction1)){
            return new LineSegmentAtInfinity(direction, this.direction1);
        }
        return lineAtInfinity;
    }
    public addArea(area: Area): Area{
        return area.expandToIncludeInfinityInDirection(this.direction1).expandToIncludeInfinityInDirection(this.direction2);
    }
}