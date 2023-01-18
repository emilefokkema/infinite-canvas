import { TransformationRepresentation, transformationShape } from "./transformation-representation";

export interface TransformationEvent{
    transformation: TransformationRepresentation,
    inverseTransformation: TransformationRepresentation,
    type: string
}

export const transformationEventShape: TransformationEvent = {
    transformation: transformationShape,
    inverseTransformation: transformationShape,
    type: ''
}
