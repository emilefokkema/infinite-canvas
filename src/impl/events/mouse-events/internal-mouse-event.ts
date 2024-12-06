import { EventBasedInternalEvent } from "../internal-events/event-based-internal-event";
import { MouseEventPropertiesImpl } from "./mouse-event-properties-impl";
import { InfiniteCanvasEventWithDefaultBehavior } from "../../api-surface/infinite-canvas-event-with-default-behavior";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { MouseEventImpl } from "./mouse-event-impl";

export class InternalMouseEvent extends EventBasedInternalEvent<MouseEvent, MouseEvent & InfiniteCanvasEventWithDefaultBehavior>{
    private readonly props: MouseEventPropertiesImpl;
    constructor(event: MouseEvent, defaultBehavior?: boolean){
        super(event, defaultBehavior);
        this.props = MouseEventPropertiesImpl.create(event);
    }
    protected createResultEvent(rectangle: CanvasRectangle): MouseEvent & InfiniteCanvasEventWithDefaultBehavior{
        return new MouseEventImpl(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(rectangle));
    }
}