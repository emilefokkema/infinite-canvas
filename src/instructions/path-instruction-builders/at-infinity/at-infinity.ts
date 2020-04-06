import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { PathShape } from "../path-shape";
import { Transformation } from "../../../transformation";

export class AtInfinity implements PathShape<AtInfinity>{
    constructor(
        public readonly initialPosition: PointAtInfinity,
        public readonly containsFinitePoint: boolean,
        public readonly positionsSoFar: PointAtInfinity[],
        public readonly currentPosition: PointAtInfinity){}
    public transform(transformation: Transformation){
        return new AtInfinity(
            transformation.applyToPointAtInfinity(this.initialPosition),
            this.containsFinitePoint,
            this.positionsSoFar.map(p => transformation.applyToPointAtInfinity(p)),
            transformation.applyToPointAtInfinity(this.currentPosition)
        );
    }
}