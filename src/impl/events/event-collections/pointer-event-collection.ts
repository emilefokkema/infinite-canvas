import { EventCollection } from "./event-collection";
import { InfiniteCanvas } from "api/infinite-canvas";

import { isHandledOrFilteredEventKey, PointerEventMap, MappedPointerEventMap, HandledOrFilteredEventMap } from "../infinite-canvas-event-map";

export class PointerEventCollection implements EventCollection<PointerEventMap>{
    constructor(
        private readonly handledOrFilteredEventCollection: EventCollection<HandledOrFilteredEventMap>,
        private readonly mappingCollection: EventCollection<MappedPointerEventMap>
    ){
        
    }
    public setOn(type: keyof PointerEventMap, listener: (this: InfiniteCanvas, ev: PointerEventMap[keyof PointerEventMap]) => any): void{
        if(isHandledOrFilteredEventKey(type)){
            this.handledOrFilteredEventCollection.setOn(type, listener)
        }else{
            this.mappingCollection.setOn(type, listener);
        }
    }
    public getOn(type: keyof PointerEventMap): (this: InfiniteCanvas, ev: PointerEventMap[keyof PointerEventMap]) => any{
        if(isHandledOrFilteredEventKey(type)){
            return this.handledOrFilteredEventCollection.getOn(type);
        }else{
            return this.mappingCollection.getOn(type);
        }
    }
    public addEventListener(type: keyof PointerEventMap, listener: ((this: InfiniteCanvas, ev: PointerEventMap[keyof PointerEventMap]) => any) | EventListenerObject, options?: boolean | AddEventListenerOptions): void{
        if(isHandledOrFilteredEventKey(type)){
            this.handledOrFilteredEventCollection.addEventListener(type, listener, options);
        }else{
            this.mappingCollection.addEventListener(type, listener, options);
        }
    }
    public removeEventListener(type: keyof PointerEventMap, listener: ((this: InfiniteCanvas, ev: PointerEventMap[keyof PointerEventMap]) => any) | EventListenerObject, options?: boolean | EventListenerOptions): void{
        if(isHandledOrFilteredEventKey(type)){
            this.handledOrFilteredEventCollection.removeEventListener(type, listener, options);
        }else{
            this.mappingCollection.removeEventListener(type, listener, options);
        }
    }
}