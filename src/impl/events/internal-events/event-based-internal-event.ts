import { EventBasedNormalPreventableDefault } from "../preventable-default/event-based-normal-preventable-default";
import { EventBasedInfiniteCanvasPreventableDefault } from "../preventable-default/event-based-infinite-canvas-preventable-default";
import { MappableInternalEventImpl } from "./mappable-internal-event-impl";
import { MappedEventPreventableDefault } from "../preventable-default/mapped-event-preventable-default";

export abstract class EventBasedInternalEvent<TEvent extends Event, TResultEvent extends Event> extends MappableInternalEventImpl<TResultEvent, MappedEventPreventableDefault>{
   
    constructor(public readonly event: TEvent, defaultBehavior?: boolean){
        super(defaultBehavior ? new EventBasedInfiniteCanvasPreventableDefault(event) : new EventBasedNormalPreventableDefault(event));
    }
    public stopPropagation(): void{
        super.stopPropagation();
        if(this.event){
            this.event.stopPropagation();
        }
    }
    public stopImmediatePropagation(): void{
        super.stopImmediatePropagation();
        if(this.event){
            this.event.stopImmediatePropagation();
        }
    }
}
