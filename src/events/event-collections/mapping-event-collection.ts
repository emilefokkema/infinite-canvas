import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { fromType } from "./from-type";
import { InfiniteCanvasEventSource } from "../infinite-canvas-event-source";
import { InfiniteCanvas } from "../../api-surface/infinite-canvas";
import { BaseEventCollection } from "./base-event-collection";
import { EventListenerCollection } from "./event-collection";
import { MappableInternalEvent } from "../internal-events/mappable-internal-event";

export class MappingEventCollection<TKey extends keyof HTMLElementEventMap, TEventMap extends {[K in TKey]: Event}> extends BaseEventCollection<TKey, TEventMap>{
    constructor(
        private readonly canvasEl: EventListenerCollection<HTMLElementEventMap>,
        private readonly createInternalEvent: (event: HTMLElementEventMap[TKey]) => MappableInternalEvent<TEventMap[TKey]>,
        rectangle: CanvasRectangle,
        infiniteCanvas: InfiniteCanvas){
            super(rectangle, infiniteCanvas);
            this.cache = {};
    }
    protected getEventSource(type: TKey): InfiniteCanvasEventSource<TEventMap[TKey]>{
        if(!this.cache[type]){
            this.cache[type] = this.createEventSource(type)
        }
        return this.cache[type];
    }
    private createEventSource(type: TKey): InfiniteCanvasEventSource<TEventMap[TKey]>{
        return this.map(fromType(this.canvasEl, type), e => this.createInternalEvent(e))
    }
}