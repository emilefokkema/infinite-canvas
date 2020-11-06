import { Transformation } from "../../../transformation";
import { CanvasContextSystem } from "../canvas-context-system";
import { RectangleMeasurement } from "../../rectangle-measurement";
export declare class CssCanvasContextSystem extends CanvasContextSystem {
    withBase(base: Transformation, inverseBase: Transformation): CssCanvasContextSystem;
    withUserTransformation(transformation: Transformation, inverseTransformation: Transformation): CssCanvasContextSystem;
    static create(measurement: RectangleMeasurement): CssCanvasContextSystem;
}
