import { Point } from "./geometry/point";
import { PointAtInfinity } from "./geometry/point-at-infinity";
export declare class Transformation {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    scale: number;
    constructor(a: number, b: number, c: number, d: number, e: number, f: number);
    getMaximumLineWidthScale(): number;
    getRotationAngle(): number;
    applyToPointAtInfinity(pointAtInfinity: PointAtInfinity): PointAtInfinity;
    apply(point: Point): Point;
    untranslated(): Transformation;
    before(other: Transformation): Transformation;
    equals(other: Transformation): boolean;
    inverse(): Transformation;
    static translation(dx: number, dy: number): Transformation;
    static scale(scale: number): Transformation;
    static identity: Transformation;
    static zoom(centerX: number, centerY: number, scale: number, translateX?: number, translateY?: number): Transformation;
    static translateZoom(s1x: number, s1y: number, s2x: number, s2y: number, d1x: number, d1y: number, d2x: number, d2y: number): Transformation;
    static rotation(centerX: number, centerY: number, radians: number): Transformation;
    static translateRotateZoom(s1x: number, s1y: number, s2x: number, s2y: number, d1x: number, d1y: number, d2x: number, d2y: number): Transformation;
}
