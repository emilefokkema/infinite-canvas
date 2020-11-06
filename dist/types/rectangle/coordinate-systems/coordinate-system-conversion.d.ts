import { CanvasCoordinateSystemStack } from "./canvas/canvas-coordinate-system-stack";
import { CssCoordinateSystemStack } from "./css/css-coordinate-system-stack";
export declare function convertToStackForCssUnits(stackForCanvasUnits: CanvasCoordinateSystemStack): CssCoordinateSystemStack;
export declare function convertToStackForCanvasUnits(stackForCssUnits: CssCoordinateSystemStack): CanvasCoordinateSystemStack;
