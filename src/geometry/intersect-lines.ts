import { Point } from "./point";

export function intersectLines(p1: Point, d1: Point, p2: Point, d2: Point): Point{
    const q: Point = p2.minus(p1);
    const det: number = d2.cross(d1);
    const s: number = d2.getPerpendicular().dot(q) / det;
    return p1.plus(d1.scale(s));
}