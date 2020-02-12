import { InfiniteCanvasStateInstance } from "../infinite-canvas-state-instance";
import { StateInstanceDimension } from "./state-instance-dimension";

export interface TypedStateInstanceDimension<T> extends StateInstanceDimension{
    changeInstanceValue(instance: InfiniteCanvasStateInstance, newValue: T): InfiniteCanvasStateInstance;
}