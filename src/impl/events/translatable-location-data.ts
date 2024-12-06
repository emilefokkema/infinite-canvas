import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export interface TranslatableLocationData<TData>{
    toInfiniteCanvasCoordinates(rectangle: CanvasRectangle): TData;
}