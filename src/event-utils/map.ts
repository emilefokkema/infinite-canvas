import {EventSource} from "./event-source";
import {transform} from "./transform";

export function map<TOldEvent, TNewEvent>(old: EventSource<TOldEvent>, mapFn: (ev: TOldEvent) => TNewEvent): EventSource<TNewEvent>{
    return transform(old, (newListener: (ev: TNewEvent) => void) => (ev: TOldEvent) => {newListener(mapFn(ev));});
}
