import { Transformation } from "../../transformation";
export declare class CoordinateSystem {
    readonly base: Transformation;
    inverseBase: Transformation;
    constructor(base: Transformation, inverseBase: Transformation);
    representTransformation(transformation: Transformation): Transformation;
    inverseRepresentTransformation(transformation: Transformation): Transformation;
    static identity: CoordinateSystem;
}
