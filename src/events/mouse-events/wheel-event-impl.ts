import { MouseEventImpl } from "./mouse-event-impl";
import { InternalEvent } from "../internal-events/internal-event";
import { WheelEventProperties } from "./wheel-event-properties";
import { MappedEventPreventableDefault } from "../preventable-default/mapped-event-preventable-default";

export class WheelEventImpl extends MouseEventImpl<WheelEvent> implements WheelEvent {
    public readonly deltaX: number;
    public readonly deltaY: number;
    constructor(canvasEvent: InternalEvent, preventableDefault: MappedEventPreventableDefault, event: WheelEvent, props: WheelEventProperties){
        super(canvasEvent, preventableDefault, event, props);
        this.deltaX = props.deltaX;
        this.deltaY = props.deltaY;
    }
    public get deltaMode(): number{return this.event.deltaMode;}
    public get deltaZ(): number{return this.event.deltaZ;}
    public DOM_DELTA_LINE = 1 as const
    public DOM_DELTA_PAGE = 2 as const
    public DOM_DELTA_PIXEL = 0 as const
}
