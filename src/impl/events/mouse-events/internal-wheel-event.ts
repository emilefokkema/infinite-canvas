import { EventBasedInternalEvent } from "../internal-events/event-based-internal-event";
import { WheelEventPropertiesImpl } from "./wheel-event-properties-impl";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { InfiniteCanvasEventWithDefaultBehavior } from "../../api-surface/infinite-canvas-event-with-default-behavior";
import { WheelEventImpl } from "./wheel-event-impl";

export class InternalWheelEvent extends EventBasedInternalEvent<WheelEvent, WheelEvent & InfiniteCanvasEventWithDefaultBehavior>{
    private readonly props: WheelEventPropertiesImpl
    constructor(event: WheelEvent, defaultBehavior?: boolean){
        super(event, defaultBehavior);
        this.props = WheelEventPropertiesImpl.create(event);
    }
    protected createResultEvent(rectangle: CanvasRectangle): WheelEvent & InfiniteCanvasEventWithDefaultBehavior{
        return new WheelEventImpl(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(rectangle));
    }
}