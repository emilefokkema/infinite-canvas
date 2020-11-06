import { Event } from "./event";
import { EventListener } from "./event-listener";
import { InfiniteCanvasAddEventListenerOptions } from "./infinite-canvas-add-event-listener-options";
export declare abstract class EventTransformer<TSourceEvent, TTargetEvent> implements Event<TTargetEvent> {
    private readonly sourceEvent;
    private _wrappers;
    protected constructor(sourceEvent: Event<TSourceEvent>);
    addListener(listener: EventListener<TTargetEvent>, options?: InfiniteCanvasAddEventListenerOptions): void;
    removeListener(listener: EventListener<TTargetEvent>): void;
    protected abstract transformEvent(source: TSourceEvent): TTargetEvent;
    private removeWrapper;
    private makeOnce;
    private wrapEventListener;
}
