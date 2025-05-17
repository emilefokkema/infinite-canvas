import { SubsetOfLineAtInfinity } from "./subset-of-line-at-infinity";
import { Point } from "../../geometry/point";
import { Area } from "../area";
import { Ray } from "../line/ray";
import { LineSegmentAtInfinity } from "./line-segment-at-infinity";
import { TwoOppositePointsOnLineAtInfinity } from "./two-opposite-points-on-line-at-infinity";

export class PointAtInfinity implements SubsetOfLineAtInfinity{
    constructor(private direction: Point){}
    public addPointAtInfinity(direction: Point): SubsetOfLineAtInfinity{
        if(direction.inSameDirectionAs(this.direction)){
            return this;
        }
        if(direction.cross(this.direction) === 0){
            return new TwoOppositePointsOnLineAtInfinity(this.direction);
        }
        return new LineSegmentAtInfinity(this.direction, direction);
    }
    public addPoint(point: Point): Area{
        return new Ray(point, this.direction);
    }
    public addArea(area: Area): Area{
        return area.expandToIncludeInfinityInDirection(this.direction);
    }
}