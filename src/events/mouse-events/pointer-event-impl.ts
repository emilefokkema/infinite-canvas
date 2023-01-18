import { MouseEventImpl } from "./mouse-event-impl";
import { PointerEventProperties } from "./pointer-event-properties";
import { InternalEvent } from "../internal-events/internal-event";
import { MappedEventPreventableDefault } from "../preventable-default/mapped-event-preventable-default";

export class PointerEventImpl extends MouseEventImpl<PointerEvent> implements PointerEvent{
    public readonly width: number;
    public readonly height: number;
    constructor(canvasEvent: InternalEvent, preventableDefault: MappedEventPreventableDefault, event: PointerEvent, props: PointerEventProperties){
        super(canvasEvent, preventableDefault, event, props);
    }
    public get isPrimary(): boolean{return this.event.isPrimary;}
    public get pointerId(): number{return this.event.pointerId;}
    public get pointerType(): string{return this.event.pointerType;}
    public get pressure(): number{return this.event.pressure;}
    public get tangentialPressure(): number{return this.event.tangentialPressure;}
    public get tiltX(): number{return this.event.tiltX;}
    public get tiltY(): number{return this.event.tiltY;}
    public get twist(): number{return this.event.twist;}

    public getCoalescedEvents(): PointerEvent[]{
        console.warn('`PointerEvent.getCoalescedEvents()` is currently not supported by InfiniteCanvas')
        return [];
    }
    public getPredictedEvents(): PointerEvent[]{
        console.warn('`PointerEvent.getPredictedEvents()` is currently not supported by InfiniteCanvas')
        return [];
    }
}