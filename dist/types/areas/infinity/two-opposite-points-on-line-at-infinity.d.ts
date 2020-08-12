import { Point } from "../../geometry/point";
import { SubsetOfLineAtInfinity } from "./subset-of-line-at-infinity";
import { Area } from "../area";
export declare class TwoOppositePointsOnLineAtInfinity implements SubsetOfLineAtInfinity {
    private direction;
    constructor(direction: Point);
    addPoint(point: Point): Area;
    addPointAtInfinity(direction: Point): SubsetOfLineAtInfinity;
    addArea(area: Area): Area;
}
