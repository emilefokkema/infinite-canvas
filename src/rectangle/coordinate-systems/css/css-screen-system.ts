import { Transformation } from "../../../transformation";
import { CssCanvasContextSystem } from "./css-canvas-context-system";
import {ScreenSystem} from "../screen-system";
import { RectangleMeasurement } from "../../rectangle-measurement";

export class CssScreenSystem extends ScreenSystem<CssCanvasContextSystem>{
    public withScreenTransformation(screenTransformation: Transformation, inverseScreenTransformation: Transformation): CssScreenSystem{
        return new CssScreenSystem(screenTransformation, inverseScreenTransformation, this.canvasContextSystem.withBase(inverseScreenTransformation, screenTransformation));
    }
    public withUserTransformation(transformation: Transformation, inverseTransformation: Transformation): CssScreenSystem{
        return new CssScreenSystem(this.base, this.inverseBase, this.canvasContextSystem.withUserTransformation(transformation, inverseTransformation));
    }
    public static create(measurement: RectangleMeasurement): CssScreenSystem{
        return new CssScreenSystem(
            measurement.screenTransformation,
            measurement.inverseScreenTransformation,
            CssCanvasContextSystem.create(measurement));
    }
}
