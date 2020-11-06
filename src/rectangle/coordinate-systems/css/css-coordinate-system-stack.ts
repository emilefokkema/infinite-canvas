import { Transformation } from "../../../transformation";
import { RectangleMeasurement } from "../../rectangle-measurement";
import { CoordinateSystems } from "../coordinate-systems";
import { CssCanvasContextSystem } from "./css-canvas-context-system";
import { CssScreenSystem } from "./css-screen-system";
import {CoordinateSystemStack} from "../coordinate-system-stack";

export class CssCoordinateSystemStack extends CoordinateSystemStack<CssScreenSystem, CssCanvasContextSystem> implements CoordinateSystems{
    public withUserTransformation(transformation: Transformation): CssCoordinateSystemStack{
        return new CssCoordinateSystemStack(this.screen.withUserTransformation(transformation, transformation.inverse()));
    }
    public withScreenTransformation(screenTransformation: Transformation, inverseScreenTransformation: Transformation): CssCoordinateSystemStack{
        return new CssCoordinateSystemStack(this.screen.withScreenTransformation(screenTransformation, inverseScreenTransformation));
    }
    public static create(measurement: RectangleMeasurement): CssCoordinateSystemStack{
        return new CssCoordinateSystemStack(
            CssScreenSystem.create(measurement)
            );
    }
}
