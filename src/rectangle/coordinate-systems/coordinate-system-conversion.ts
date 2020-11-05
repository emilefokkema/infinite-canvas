import {CanvasCoordinateSystemStack} from "./canvas/canvas-coordinate-system-stack";
import {CssCoordinateSystemStack} from "./css/css-coordinate-system-stack";
import {CssScreenSystem} from "./css/css-screen-system";
import {CssCanvasContextSystem} from "./css/css-canvas-context-system";
import {CanvasScreenSystem} from "./canvas/canvas-screen-system";
import {CanvasCanvasContextSystem} from "./canvas/canvas-canvas-context-system";
import {Transformation} from "../../transformation";

export function convertToStackForCssUnits(stackForCanvasUnits: CanvasCoordinateSystemStack): CssCoordinateSystemStack{
    return new CssCoordinateSystemStack(
        new CssScreenSystem(
            stackForCanvasUnits.screen.base,
            stackForCanvasUnits.screen.inverseBase,
            new CssCanvasContextSystem(
                stackForCanvasUnits.screen.inverseBase,
                stackForCanvasUnits.screen.base,
                stackForCanvasUnits.screen.canvasContextSystem.infiniteCanvasContext))
    );
}

export function convertToStackForCanvasUnits(stackForCssUnits: CssCoordinateSystemStack): CanvasCoordinateSystemStack{
    return new CanvasCoordinateSystemStack(
        new CanvasScreenSystem(
            stackForCssUnits.screen.base,
            stackForCssUnits.screen.inverseBase,
            new CanvasCanvasContextSystem(
                Transformation.identity,
                Transformation.identity,
                stackForCssUnits.screen.canvasContextSystem.infiniteCanvasContext
            )
        )
    )
}
