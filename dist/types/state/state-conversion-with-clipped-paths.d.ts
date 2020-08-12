import { StateConversion } from "./state-conversion";
import { InfiniteCanvasStateInstance } from "./infinite-canvas-state-instance";
export declare class StateConversionWithClippedPaths extends StateConversion {
    changeCurrentInstanceTo(instance: InfiniteCanvasStateInstance): void;
    private convertToState;
    private static canConvert;
}
