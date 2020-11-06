import { Transformation } from "../../../transformation";
import { RectangleMeasurement } from "../../rectangle-measurement";
import { CoordinateSystems } from "../coordinate-systems";
import { CssCanvasContextSystem } from "./css-canvas-context-system";
import { CssScreenSystem } from "./css-screen-system";
import { CoordinateSystemStack } from "../coordinate-system-stack";
export declare class CssCoordinateSystemStack extends CoordinateSystemStack<CssScreenSystem, CssCanvasContextSystem> implements CoordinateSystems {
    withUserTransformation(transformation: Transformation): CssCoordinateSystemStack;
    withScreenTransformation(screenTransformation: Transformation, inverseScreenTransformation: Transformation): CssCoordinateSystemStack;
    static create(measurement: RectangleMeasurement): CssCoordinateSystemStack;
}
