import { EventSource } from "./event-source";
import { transform } from "./transform";

export function once<TEvent>(source: EventSource<TEvent>): EventSource<TEvent>{
    const result: EventSource<TEvent> = transform(source, (listener: (ev: TEvent) => void) => (ev: TEvent) => {
        listener(ev);
        result.removeListener(listener);
    });
    return result;
}