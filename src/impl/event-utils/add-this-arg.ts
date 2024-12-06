import { EventSource } from "./event-source";
import { transform } from "./transform";

export function addThisArg<TEvent, TThisArg>(
    source: EventSource<TEvent>,
    thisArg: TThisArg
): EventSource<TEvent>{
    return transform(source, listener => ev => {
        listener.apply(thisArg, [ev]);
    });
}