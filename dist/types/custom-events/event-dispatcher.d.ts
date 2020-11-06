import { EventListener } from "./event-listener";
import { InfiniteCanvasAddEventListenerOptions } from "./infinite-canvas-add-event-listener-options";
import { Event } from "./event";
export declare class EventDispatcher<TEvent> implements Event<TEvent> {
    private listeners;
    private onceListeners;
    dispatchEvent(event: TEvent): void;
    addListener(listener: EventListener<TEvent>, options?: InfiniteCanvasAddEventListenerOptions): void;
    removeListener(listener: EventListener<TEvent>): void;
    private notifyListener;
}
