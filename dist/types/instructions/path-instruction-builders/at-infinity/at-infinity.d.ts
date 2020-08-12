import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { PathShape } from "../path-shape";
import { Transformation } from "../../../transformation";
export declare class AtInfinity implements PathShape<AtInfinity> {
    readonly initialPosition: PointAtInfinity;
    readonly containsFinitePoint: boolean;
    readonly positionsSoFar: PointAtInfinity[];
    readonly currentPosition: PointAtInfinity;
    constructor(initialPosition: PointAtInfinity, containsFinitePoint: boolean, positionsSoFar: PointAtInfinity[], currentPosition: PointAtInfinity);
    transform(transformation: Transformation): AtInfinity;
}
