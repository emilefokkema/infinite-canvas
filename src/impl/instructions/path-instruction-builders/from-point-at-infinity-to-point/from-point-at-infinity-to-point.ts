import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { Point } from "../../../geometry/point";
import { Transformation } from "../../../transformation";
import { PathShape } from "../path-shape";

export class FromPointAtInfinityToPoint implements PathShape<FromPointAtInfinityToPoint>{
    constructor(
        public readonly initialPosition: PointAtInfinity,
        public readonly firstFinitePoint: Point,
        public currentPosition: Point){}
    public transform(transformation: Transformation): FromPointAtInfinityToPoint{
        return new FromPointAtInfinityToPoint(
            transformation.applyToPointAtInfinity(this.initialPosition),
            transformation.apply(this.firstFinitePoint),
            transformation.apply(this.currentPosition)
        );
    }
}