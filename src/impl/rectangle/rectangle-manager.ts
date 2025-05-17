import { CanvasRectangle } from "./canvas-rectangle";
import { TransformationRepresentation } from "api/transformation-representation";

export interface RectangleManager{
    rectangle: CanvasRectangle
    setTransformation(transformation: TransformationRepresentation): void;
    measure(): void;
}