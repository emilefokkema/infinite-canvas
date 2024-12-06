import { Point } from "../../../geometry/point";
import { PathShape } from "../path-shape";
import { Transformation } from "../../../transformation";

export class FromPointToPoint implements PathShape<FromPointToPoint>{
    constructor(
        public readonly initialPoint: Point,
        public readonly currentPosition: Point){}
    public transform(transformation: Transformation): FromPointToPoint{
        return new FromPointToPoint(
            transformation.apply(this.initialPoint),
            transformation.apply(this.currentPosition));
    }
}