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
    public get DOM_DELTA_LINE(): number{return this.event.DOM_DELTA_LINE;}
    public get DOM_DELTA_PAGE(): number{return this.event.DOM_DELTA_PAGE;}
    public get DOM_DELTA_PIXEL(): number{return this.event.DOM_DELTA_PIXEL;}
}
