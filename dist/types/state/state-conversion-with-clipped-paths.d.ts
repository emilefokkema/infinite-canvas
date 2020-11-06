import { StateConversion } from "./state-conversion";
import { InfiniteCanvasStateInstance } from "./infinite-canvas-state-instance";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";
export declare class StateConversionWithClippedPaths extends StateConversion {
    changeCurrentInstanceTo(instance: InfiniteCanvasStateInstance, rectangle: CanvasRectangle): void;
    private convertToState;
    private static canConvert;
}
