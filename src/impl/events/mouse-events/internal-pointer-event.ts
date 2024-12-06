import { EventBasedInternalEvent } from "../internal-events/event-based-internal-event";
import { InfiniteCanvasEventWithDefaultBehavior } from "../../api-surface/infinite-canvas-event-with-default-behavior";
import { PointerEventPropertiesImpl } from "./pointer-event-properties-impl";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { PointerEventImpl } from "./pointer-event-impl";

export class InternalPointerEvent extends EventBasedInternalEvent<PointerEvent, PointerEvent & InfiniteCanvasEventWithDefaultBehavior>{
    private readonly props: PointerEventPropertiesImpl;
    constructor(event: PointerEvent, defaultBehavior?: boolean){
        super(event, defaultBehavior);
        this.props = PointerEventPropertiesImpl.create(event);
    }
    protected createResultEvent(rectangle: CanvasRectangle): PointerEvent & InfiniteCanvasEventWithDefaultBehavior{
        return new PointerEventImpl(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(rectangle));
    }
}