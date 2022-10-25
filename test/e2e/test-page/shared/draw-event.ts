import { TransformationRepresentation } from "./transformation-representation";

export interface DrawEvent{
    transformation: TransformationRepresentation,
    inverseTransformation: TransformationRepresentation
}