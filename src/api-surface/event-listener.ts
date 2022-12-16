import { EventMap } from "./event-map";


export declare type EventListener<K extends keyof EventMap> = (ev: EventMap[K]) => void;
