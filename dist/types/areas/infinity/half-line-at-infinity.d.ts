import { SubsetOfLineAtInfinity } from "./subset-of-line-at-infinity";
import { Point } from "../../geometry/point";
import { Area } from "../area";
export declare class HalfLineAtInfinity implements SubsetOfLineAtInfinity {
    private towardsMiddle;
    constructor(towardsMiddle: Point);
    addPoint(point: Point): Area;
    addPointAtInfinity(direction: Point): SubsetOfLineAtInfinity;
    addArea(area: Area): Area;
}
