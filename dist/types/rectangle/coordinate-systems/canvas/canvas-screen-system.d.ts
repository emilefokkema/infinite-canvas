import { Transformation } from "../../../transformation";
import { CanvasCanvasContextSystem } from "./canvas-canvas-context-system";
import { ScreenSystem } from "../screen-system";
import { RectangleMeasurement } from "../../rectangle-measurement";
export declare class CanvasScreenSystem extends ScreenSystem<CanvasCanvasContextSystem> {
    withBase(base: Transformation, inverseBase: Transformation): CanvasScreenSystem;
    withUserTransformation(newUserTransformation: Transformation, newInverseUserTransformation: Transformation): CanvasScreenSystem;
    static create(measurement: RectangleMeasurement): CanvasScreenSystem;
}
