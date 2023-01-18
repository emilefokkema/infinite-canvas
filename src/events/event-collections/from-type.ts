import {EventSource} from "../../event-utils/event-source";
import { EventListenerCollection } from "./event-collection";

export function fromType<TEventMap, K extends keyof TEventMap>(dispatcher: EventListenerCollection<TEventMap>, type: K): EventSource<TEventMap[K]>{
    return {
        addListener(listener: (event: TEventMap[K]) => void): void{
            dispatcher.addEventListener(type, listener);
        },
        removeListener(listener: (event: TEventMap[K]) => void): void{
            dispatcher.removeEventListener(type, listener);
        }
    };
}
