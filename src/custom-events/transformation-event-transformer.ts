import {EventTransformer} from "./event-transformer";
import {TransformationEvent} from "../api-surface/transformation-event";
import { Event } from "./event";
import {CanvasRectangle} from "../rectangle/canvas-rectangle";
import {representTransformation} from "../transformer/represent-transformation";

export class TransformationEventTransformer extends EventTransformer<void, TransformationEvent>{
    constructor(sourceEvent: Event<void>, private readonly rectangle: CanvasRectangle) {
        super(sourceEvent);
    }
    protected transformEvent(): TransformationEvent {
        return {
            transformation: representTransformation(this.rectangle.inverseInfiniteCanvasContextBase),
            inverseTransformation: representTransformation(this.rectangle.infiniteCanvasContextBase)
        };
    }
}
