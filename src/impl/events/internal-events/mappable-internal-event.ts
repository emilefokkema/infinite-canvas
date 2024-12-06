import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { InternalEvent } from "./internal-event";

export interface MappableInternalEvent<TEvent extends Event> extends InternalEvent{
    getResultEvent(rectangle: CanvasRectangle): TEvent;
}