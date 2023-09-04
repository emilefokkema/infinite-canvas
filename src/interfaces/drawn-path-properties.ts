import { Point } from "../geometry/point";

export interface DrawnPathProperties{
    readonly lineWidth: number;
    readonly lineDashPeriod: number;
    readonly shadowOffsets: Point[];
}