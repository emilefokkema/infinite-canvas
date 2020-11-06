import { Transformation } from "../../../transformation";
import { RectangleMeasurement } from "../../rectangle-measurement";
import { CoordinateSystems } from "../coordinate-systems";
import { CanvasCanvasContextSystem } from "./canvas-canvas-context-system";
import { CanvasScreenSystem } from "./canvas-screen-system";
import {CoordinateSystemStack} from "../coordinate-system-stack";

export class CanvasCoordinateSystemStack extends CoordinateSystemStack<CanvasScreenSystem, CanvasCanvasContextSystem> implements CoordinateSystems{
    public withUserTransformation(transformation: Transformation): CanvasCoordinateSystemStack{
        return new CanvasCoordinateSystemStack(this.screen.withUserTransformation(transformation, transformation.inverse()));
    }
    public withScreenTransformation(screenTransformation: Transformation, inverseScreenTransformation: Transformation): CanvasCoordinateSystemStack{
        return new CanvasCoordinateSystemStack(this.screen.withBase(screenTransformation, inverseScreenTransformation));
    }
    public static create(measurement: RectangleMeasurement): CanvasCoordinateSystemStack{
        return new CanvasCoordinateSystemStack(
            CanvasScreenSystem.create(measurement)
        )
    }
}
