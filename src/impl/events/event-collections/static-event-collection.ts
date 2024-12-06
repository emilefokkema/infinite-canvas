import {InfiniteCanvasEventSource} from "../infinite-canvas-event-source";
import { BaseEventCollection } from "./base-event-collection";

export abstract class StaticEventCollection<TEventMap extends {[K in keyof TEventMap]: Event}> extends BaseEventCollection<keyof TEventMap, TEventMap>{
    protected abstract createEvents(): {[K in keyof TEventMap]: InfiniteCanvasEventSource<TEventMap[K]>};
    protected getEventSource(type: keyof TEventMap): InfiniteCanvasEventSource<TEventMap[keyof TEventMap]>{
        if(!this.cache || !this.cache[type]){
            this.cache = this.createEvents();
        }
        return this.cache[type];
    }
}
