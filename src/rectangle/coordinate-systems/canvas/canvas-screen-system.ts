import { Transformation } from "../../../transformation";
import { CanvasCanvasContextSystem } from "./canvas-canvas-context-system";
import {ScreenSystem} from "../screen-system";
import { RectangleMeasurement } from "../../rectangle-measurement";

export class CanvasScreenSystem extends ScreenSystem<CanvasCanvasContextSystem>{
    public withBase(base: Transformation, inverseBase: Transformation): CanvasScreenSystem{
        return new CanvasScreenSystem(base, inverseBase, this.canvasContextSystem);
    }
    public withUserTransformation(newUserTransformation: Transformation, newInverseUserTransformation: Transformation): CanvasScreenSystem{
        const userTransformationChange: Transformation = this.userTransformation.inverse().before(newUserTransformation);
        const rebasedUserTransformationChange: Transformation = this.representTransformation(userTransformationChange);
        return new CanvasScreenSystem(this.base, this.inverseBase, this.canvasContextSystem.changeUserTransformation(rebasedUserTransformationChange, newUserTransformation, newInverseUserTransformation));
    }
    public static create(measurement: RectangleMeasurement): CanvasScreenSystem{
        return new CanvasScreenSystem(
            measurement.screenTransformation,
            measurement.inverseScreenTransformation,
            CanvasCanvasContextSystem.create()
        );
    }
}
