import {Transformation} from "../transformation";
import {TransformationRepresentation} from "../api-surface/transformation-representation";

export function representTransformation(transformation: Transformation): TransformationRepresentation{
    const {a, b, c, d, e, f} = transformation;
    return {a, b, c, d, e, f};
}
