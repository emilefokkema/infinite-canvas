import { Position } from "./position";
import { PointAtInfinity } from "./point-at-infinity";

export function isPointAtInfinity(position: Position): position is PointAtInfinity{
    return (position as any).direction !== undefined;
}