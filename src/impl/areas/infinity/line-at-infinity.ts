import { SubsetOfLineAtInfinity } from "./subset-of-line-at-infinity";
import { Point } from "../../geometry/point";
import { plane } from "../plane";
import { Area } from "../area";

class LineAtInfinity implements SubsetOfLineAtInfinity{
    public addPoint(point: Point): Area{
        return plane;
    }
    public addPointAtInfinity(direction: Point): SubsetOfLineAtInfinity{
        return this;
    }
    public addArea(area: Area): Area{
        return plane;
    }
}
export const lineAtInfinity: LineAtInfinity = new LineAtInfinity();