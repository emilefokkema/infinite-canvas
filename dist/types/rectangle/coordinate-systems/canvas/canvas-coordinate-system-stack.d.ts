import { Transformation } from "../../../transformation";
import { RectangleMeasurement } from "../../rectangle-measurement";
import { CoordinateSystems } from "../coordinate-systems";
import { CanvasCanvasContextSystem } from "./canvas-canvas-context-system";
import { CanvasScreenSystem } from "./canvas-screen-system";
import { CoordinateSystemStack } from "../coordinate-system-stack";
export declare class CanvasCoordinateSystemStack extends CoordinateSystemStack<CanvasScreenSystem, CanvasCanvasContextSystem> implements CoordinateSystems {
    withUserTransformation(transformation: Transformation): CanvasCoordinateSystemStack;
    withScreenTransformation(screenTransformation: Transformation, inverseScreenTransformation: Transformation): CanvasCoordinateSystemStack;
    static create(measurement: RectangleMeasurement): CanvasCoordinateSystemStack;
}
