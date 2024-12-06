import { Point } from "../../geometry/point";
import { SubsetOfLineAtInfinity } from "./subset-of-line-at-infinity";
import { Line } from "../line/line";
import { Area } from "../area";
import { HalfLineAtInfinity } from "./half-line-at-infinity";

export class TwoOppositePointsOnLineAtInfinity implements SubsetOfLineAtInfinity{
    constructor(private direction: Point){}
    public addPoint(point: Point): Area{
        return new Line(point, this.direction);
    }
    public addPointAtInfinity(direction: Point): SubsetOfLineAtInfinity{
        if(direction.cross(this.direction) === 0){
            return this;
        }
        return new HalfLineAtInfinity(direction.projectOn(this.direction.getPerpendicular()));
    }
    public addArea(area: Area): Area{
        return area.expandToIncludeInfinityInDirection(this.direction).expandToIncludeInfinityInDirection(this.direction.scale(-1));
    }
}