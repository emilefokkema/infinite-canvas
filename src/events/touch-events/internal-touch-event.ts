import { EventBasedInternalEvent } from "../internal-events/event-based-internal-event";
import { TouchEventPropertiesImpl } from "./touch-event-properties-impl";
import { InfiniteCanvasTouchEvent } from "../../api-surface/infinite-canvas-touch-event";
import { InfiniteCanvasEventWithDefaultBehavior } from "../../api-surface/infinite-canvas-event-with-default-behavior";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { TouchEventImpl } from "./touch-event-impl";

export class InternalTouchEvent extends EventBasedInternalEvent<TouchEvent, InfiniteCanvasTouchEvent & InfiniteCanvasEventWithDefaultBehavior>{
    constructor(
        event: TouchEvent,
        private readonly props: TouchEventPropertiesImpl,
        defaultBehavior?: boolean){
            super(event, defaultBehavior);
    }
    protected createResultEvent(rectangle: CanvasRectangle): InfiniteCanvasTouchEvent & InfiniteCanvasEventWithDefaultBehavior{
        return new TouchEventImpl(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(rectangle));
    }
    public static create(
        rectangle: CanvasRectangle,
        event: TouchEvent,
        touches: Touch[],
        changedTouches: Touch[],
        defaultBehavior?: boolean): InternalTouchEvent{
            const props = TouchEventPropertiesImpl.create(rectangle, touches, changedTouches);
            return new InternalTouchEvent(event, props, defaultBehavior);
    }
}