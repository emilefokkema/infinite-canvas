import { SubsetOfLineAtInfinity } from "./subset-of-line-at-infinity";
import { Point } from "../../geometry/point";
import { Area } from "../area";
export declare class PointAtInfinity implements SubsetOfLineAtInfinity {
    private direction;
    constructor(direction: Point);
    addPointAtInfinity(direction: Point): SubsetOfLineAtInfinity;
    addPoint(point: Point): Area;
    addArea(area: Area): Area;
}
