import { Point } from "../../../geometry/point";
import { PathShape } from "../path-shape";
import { Transformation } from "../../../transformation";
export declare class FromPointToPoint implements PathShape<FromPointToPoint> {
    readonly initialPoint: Point;
    readonly currentPosition: Point;
    constructor(initialPoint: Point, currentPosition: Point);
    transform(transformation: Transformation): FromPointToPoint;
}
