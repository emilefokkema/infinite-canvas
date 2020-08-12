import { SubsetOfLineAtInfinity } from "./subset-of-line-at-infinity";
import { Point } from "../../geometry/point";
import { Area } from "../area";
declare class LineAtInfinity implements SubsetOfLineAtInfinity {
    addPoint(point: Point): Area;
    addPointAtInfinity(direction: Point): SubsetOfLineAtInfinity;
    addArea(area: Area): Area;
}
export declare const lineAtInfinity: LineAtInfinity;
export {};
