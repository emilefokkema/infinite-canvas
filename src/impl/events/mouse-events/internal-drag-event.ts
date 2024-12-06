import { EventBasedInternalEvent } from "../internal-events/event-based-internal-event";
import { InfiniteCanvasEventWithDefaultBehavior } from "api/infinite-canvas-event-with-default-behavior";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { MouseEventPropertiesImpl } from "./mouse-event-properties-impl";
import { DragEventImpl } from "./drag-event-impl";

export class InternalDragEvent extends EventBasedInternalEvent<DragEvent, DragEvent & InfiniteCanvasEventWithDefaultBehavior>{
    private readonly props: MouseEventPropertiesImpl;
    constructor(event: DragEvent, defaultBehavior?: boolean){
        super(event, defaultBehavior);
        this.props = MouseEventPropertiesImpl.create(event);
    }
    protected createResultEvent(rectangle: CanvasRectangle): DragEvent & InfiniteCanvasEventWithDefaultBehavior{
        return new DragEventImpl(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(rectangle));
    }
}