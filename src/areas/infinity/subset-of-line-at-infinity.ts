import { Point } from "../../geometry/point";
import { Area } from "../area";

export interface SubsetOfLineAtInfinity{
    addPointAtInfinity(direction: Point): SubsetOfLineAtInfinity;
    addPoint(point: Point): Area;
    addArea(area: Area): Area;
}