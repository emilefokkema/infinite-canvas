import { EventBasedInternalEvent } from "./event-based-internal-event";

export class InternalUnmappedEvent<TEvent extends Event> extends EventBasedInternalEvent<TEvent, TEvent>{

    protected createResultEvent(): TEvent{
        return this.event;
    }
}