import { Point } from "../geometry/point";

export interface DrawnStrokeProperties{
    readonly lineWidth: number;
    readonly lineDashPeriod: number;
    readonly shadowOffsets: Point[];
}