import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { Point } from "../../../geometry/point";
import { PathShape } from "../path-shape";
import { Transformation } from "../../../transformation";
export declare class FromPointAtInfinityToPointAtInfinity implements PathShape<FromPointAtInfinityToPointAtInfinity> {
    readonly initialPosition: PointAtInfinity;
    readonly firstFinitePoint: Point;
    readonly lastFinitePoint: Point;
    readonly currentPosition: PointAtInfinity;
    constructor(initialPosition: PointAtInfinity, firstFinitePoint: Point, lastFinitePoint: Point, currentPosition: PointAtInfinity);
    transform(transformation: Transformation): FromPointAtInfinityToPointAtInfinity;
}
