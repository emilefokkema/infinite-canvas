import {AddEventListenerOptions} from "../api-surface/add-event-listener-options";

export interface Event<TEvent> {
    addListener(listener: (ev: TEvent) => void, options?: AddEventListenerOptions): void;
    removeListener(listener: (ev: TEvent) => void): void;
}
