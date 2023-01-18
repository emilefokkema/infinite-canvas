import {EventSource} from "./event-source";
import {transform} from "./transform";

export function filter<TEvent>(source: EventSource<TEvent>, predicate: (ev: TEvent) => boolean): EventSource<TEvent>{
    return transform(source, (listener: (ev: TEvent) => void) => (ev: TEvent) => {
        if(!predicate(ev)){
            return;
        }
        listener(ev);
    });
}
