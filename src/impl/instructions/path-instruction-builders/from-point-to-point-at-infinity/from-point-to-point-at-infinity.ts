import { Point } from "../../../geometry/point";
import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { PathShape } from "../path-shape";
import { Transformation } from "../../../transformation";

export class FromPointToPointAtInfinity implements PathShape<FromPointToPointAtInfinity>{
    constructor(
        public readonly initialPoint: Point,
        public readonly currentPosition: PointAtInfinity){}
    public transform(transformation: Transformation): FromPointToPointAtInfinity{
        return new FromPointToPointAtInfinity(
            transformation.apply(this.initialPoint),
            transformation.applyToPointAtInfinity(this.currentPosition));
    }
}