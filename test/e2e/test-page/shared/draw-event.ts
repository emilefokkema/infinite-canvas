import { TransformationRepresentation, transformationShape } from "./transformation-representation";

export interface DrawEvent{
    transformation: TransformationRepresentation,
    inverseTransformation: TransformationRepresentation
}

export const drawEventShape: DrawEvent = {
    transformation: transformationShape,
    inverseTransformation: transformationShape
};