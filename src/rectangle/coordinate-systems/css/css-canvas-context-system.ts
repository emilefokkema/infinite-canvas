import { Transformation } from "../../../transformation";
import {CoordinateSystem} from "../coordinate-system";
import {CanvasContextSystem} from "../canvas-context-system";
import { RectangleMeasurement } from "../../rectangle-measurement";

export class CssCanvasContextSystem extends CanvasContextSystem{
    public withBase(base: Transformation, inverseBase: Transformation): CssCanvasContextSystem{
        return new CssCanvasContextSystem(base, inverseBase, this.infiniteCanvasContext);
    }
    public withUserTransformation(transformation: Transformation, inverseTransformation: Transformation): CssCanvasContextSystem{
        return new CssCanvasContextSystem(this.base, this.inverseBase, new CoordinateSystem(transformation, inverseTransformation));
    }
    public static create(measurement: RectangleMeasurement): CssCanvasContextSystem{
        return new CssCanvasContextSystem(
            measurement.inverseScreenTransformation,
            measurement.screenTransformation,
            CoordinateSystem.identity
        );
    }
}
