import { Point } from "../../geometry/point";
import { SubsetOfLineAtInfinity } from "./subset-of-line-at-infinity";
import { Area } from "../area";
export declare class LineSegmentAtInfinity implements SubsetOfLineAtInfinity {
    private direction1;
    private direction2;
    constructor(direction1: Point, direction2: Point);
    addPoint(point: Point): Area;
    addPointAtInfinity(direction: Point): SubsetOfLineAtInfinity;
    addArea(area: Area): Area;
}
