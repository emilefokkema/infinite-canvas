import { Transformation } from "../../../transformation";
import { CanvasContextSystem } from "../canvas-context-system";
export declare class CanvasCanvasContextSystem extends CanvasContextSystem {
    changeUserTransformation(userTransformationChange: Transformation, newUserTransformation: Transformation, newInverseUserTransformation: Transformation): CanvasCanvasContextSystem;
    static create(): CanvasCanvasContextSystem;
}
