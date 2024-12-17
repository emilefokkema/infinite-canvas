import { EventEmitter } from "./event-emitter";
import { EventSource } from "./event-source";

export function getEventsOfType<TType extends string, TEvent>(
    emitter: EventEmitter<TType, TEvent>,
    type: TType
): EventSource<TEvent>{
    return {
        addListener(listener: (e: TEvent) => void): void {
            emitter.addEventListener(type, listener);
        },
        removeListener(listener: (e: TEvent) => void): void {
            emitter.removeEventListener(type, listener);
        }
    }
}