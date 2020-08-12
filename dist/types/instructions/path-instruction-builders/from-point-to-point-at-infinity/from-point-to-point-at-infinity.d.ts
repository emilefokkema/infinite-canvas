import { Point } from "../../../geometry/point";
import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { PathShape } from "../path-shape";
import { Transformation } from "../../../transformation";
export declare class FromPointToPointAtInfinity implements PathShape<FromPointToPointAtInfinity> {
    readonly initialPoint: Point;
    readonly currentPosition: PointAtInfinity;
    constructor(initialPoint: Point, currentPosition: PointAtInfinity);
    transform(transformation: Transformation): FromPointToPointAtInfinity;
}
