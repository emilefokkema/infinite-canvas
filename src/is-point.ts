import { Point } from "./point";
import { Rectangle } from "./rectangle";

export function isPoint(pointOrRectangle: Point | Rectangle): pointOrRectangle is Point{
    return (pointOrRectangle as Point).x !== undefined;
}