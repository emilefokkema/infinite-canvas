import { Transformation } from "../../../transformation";
import { CssCanvasContextSystem } from "./css-canvas-context-system";
import { ScreenSystem } from "../screen-system";
import { RectangleMeasurement } from "../../rectangle-measurement";
export declare class CssScreenSystem extends ScreenSystem<CssCanvasContextSystem> {
    withScreenTransformation(screenTransformation: Transformation, inverseScreenTransformation: Transformation): CssScreenSystem;
    withUserTransformation(transformation: Transformation, inverseTransformation: Transformation): CssScreenSystem;
    static create(measurement: RectangleMeasurement): CssScreenSystem;
}
