import { EventTransformer } from "./event-transformer";
import { InfiniteCanvasTransformationEvent } from "./infinite-canvas-transformation-event";
import { Event } from "./event";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";
export declare class TransformationEventTransformer extends EventTransformer<void, InfiniteCanvasTransformationEvent> {
    private readonly rectangle;
    constructor(sourceEvent: Event<void>, rectangle: CanvasRectangle);
    protected transformEvent(): InfiniteCanvasTransformationEvent;
}
