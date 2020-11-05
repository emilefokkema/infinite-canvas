import {EventListener} from "./event-listener";
import {InfiniteCanvasAddEventListenerOptions} from "./infinite-canvas-add-event-listener-options";

export interface Event<TEvent> {
    addListener(listener: EventListener<TEvent>, options?: InfiniteCanvasAddEventListenerOptions): void;
    removeListener(listener: EventListener<TEvent>): void;
}
