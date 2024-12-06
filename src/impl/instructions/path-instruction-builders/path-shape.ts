import { Transformation } from "../../transformation";
import { Position } from "../../geometry/position";

export interface PathShape<TPathShape extends PathShape<TPathShape>>{
    transform(transformation: Transformation): TPathShape;
    readonly currentPosition: Position;
}