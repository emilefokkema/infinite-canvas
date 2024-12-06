import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { PathShape } from "../path-shape";
import { Transformation } from "../../../transformation";

export class AtInfinity implements PathShape<AtInfinity>{
    constructor(
        public readonly initialPosition: PointAtInfinity,
        public readonly surroundsFinitePoint: boolean,
        public readonly positionsSoFar: PointAtInfinity[],
        public readonly currentPosition: PointAtInfinity){}
    public transform(transformation: Transformation){
        return new AtInfinity(
            transformation.applyToPointAtInfinity(this.initialPosition),
            this.surroundsFinitePoint,
            this.positionsSoFar.map(p => transformation.applyToPointAtInfinity(p)),
            transformation.applyToPointAtInfinity(this.currentPosition)
        );
    }
}