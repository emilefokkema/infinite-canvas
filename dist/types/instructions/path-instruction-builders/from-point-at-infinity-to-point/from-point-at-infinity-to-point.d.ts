import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { Point } from "../../../geometry/point";
import { Transformation } from "../../../transformation";
import { PathShape } from "../path-shape";
export declare class FromPointAtInfinityToPoint implements PathShape<FromPointAtInfinityToPoint> {
    readonly initialPosition: PointAtInfinity;
    readonly firstFinitePoint: Point;
    currentPosition: Point;
    constructor(initialPosition: PointAtInfinity, firstFinitePoint: Point, currentPosition: Point);
    transform(transformation: Transformation): FromPointAtInfinityToPoint;
}
