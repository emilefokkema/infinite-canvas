import { Transformation } from "../../../transformation";
import {CoordinateSystem} from "../coordinate-system";
import {CanvasContextSystem} from "../canvas-context-system";

export class CanvasCanvasContextSystem extends CanvasContextSystem{
    public changeUserTransformation(userTransformationChange: Transformation, newUserTransformation: Transformation, newInverseUserTransformation: Transformation): CanvasCanvasContextSystem{
        const old: Transformation = this.infiniteCanvasContext.base.before(this.base);
        const _new: Transformation = old.before(userTransformationChange);
        const newCanvasContextBase: Transformation = newInverseUserTransformation.before(_new);
        return new CanvasCanvasContextSystem(newCanvasContextBase, newCanvasContextBase.inverse(), new CoordinateSystem(newUserTransformation, newInverseUserTransformation));
    }
    public static create(): CanvasCanvasContextSystem{
        return new CanvasCanvasContextSystem(
            Transformation.identity,
            Transformation.identity,
            CoordinateSystem.identity
        );
    }
}
