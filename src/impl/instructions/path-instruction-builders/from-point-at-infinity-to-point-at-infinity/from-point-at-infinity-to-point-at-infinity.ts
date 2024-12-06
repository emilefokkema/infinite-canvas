import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { Point } from "../../../geometry/point";
import { PathShape } from "../path-shape";
import { Transformation } from "../../../transformation";

export class FromPointAtInfinityToPointAtInfinity implements PathShape<FromPointAtInfinityToPointAtInfinity>{
    constructor(
        public readonly initialPosition: PointAtInfinity,
        public readonly firstFinitePoint: Point,
        public readonly lastFinitePoint: Point,
        public readonly currentPosition: PointAtInfinity){}
    public transform(transformation: Transformation): FromPointAtInfinityToPointAtInfinity{
        return new FromPointAtInfinityToPointAtInfinity(
            transformation.applyToPointAtInfinity(this.initialPosition),
            transformation.apply(this.firstFinitePoint),
            transformation.apply(this.lastFinitePoint),
            transformation.applyToPointAtInfinity(this.currentPosition));
    }
}