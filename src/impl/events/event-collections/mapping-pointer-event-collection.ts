import { EventCollection } from "./event-collection";
import { InfiniteCanvas } from "api/infinite-canvas";
import { isMappedMouseEventKey, isMappedTouchEventKey, isMappedOnlyPointerEventKey, isMappedDragEventKey, MappedMouseEventMap, MappedPointerEventMap, MappedTouchEventMap, MappedOnlyPointerEventMap, MappedDragEventMap } from "../infinite-canvas-event-map";

export class MappingPointerEventCollection implements EventCollection<MappedPointerEventMap>{
    constructor(
        private readonly mappedMouseEventCollection: EventCollection<MappedMouseEventMap>,
        private readonly mappedTouchEventCollection: EventCollection<MappedTouchEventMap>,
        private readonly mappedOnlyPointerEventCollection: EventCollection<MappedOnlyPointerEventMap>,
        private readonly mappedDragEventCollection: EventCollection<MappedDragEventMap>){
    }
    public setOn(type: keyof MappedPointerEventMap, listener: (this: InfiniteCanvas, ev: MappedPointerEventMap[keyof MappedPointerEventMap]) => any): void{
        if(isMappedMouseEventKey(type)){
            this.mappedMouseEventCollection.setOn(type, listener)
        }else if(isMappedTouchEventKey(type)){
            this.mappedTouchEventCollection.setOn(type, listener);
        }else if(isMappedOnlyPointerEventKey(type)){
            this.mappedOnlyPointerEventCollection.setOn(type, listener);
        }else if(isMappedDragEventKey(type)){
            this.mappedDragEventCollection.setOn(type, listener);
        }
    }
    public getOn(type: keyof MappedPointerEventMap): (this: InfiniteCanvas, ev: MappedPointerEventMap[keyof MappedPointerEventMap]) => any{
        if(isMappedMouseEventKey(type)){
            return this.mappedMouseEventCollection.getOn(type);
        }else if(isMappedTouchEventKey(type)){
            return this.mappedTouchEventCollection.getOn(type);
        }else if(isMappedOnlyPointerEventKey(type)){
            return this.mappedOnlyPointerEventCollection.getOn(type);
        }else if(isMappedDragEventKey(type)){
            return this.mappedDragEventCollection.getOn(type);
        }
    }
    public addEventListener(type: keyof MappedPointerEventMap, listener: ((this: InfiniteCanvas, ev: MappedPointerEventMap[keyof MappedPointerEventMap]) => any) | EventListenerObject, options?: boolean | AddEventListenerOptions){
        if(isMappedMouseEventKey(type)){
            this.mappedMouseEventCollection.addEventListener(type, listener, options)
        }else if(isMappedTouchEventKey(type)){
            this.mappedTouchEventCollection.addEventListener(type, listener, options);
        }else if(isMappedOnlyPointerEventKey(type)){
            this.mappedOnlyPointerEventCollection.addEventListener(type, listener, options);
        }else if(isMappedDragEventKey(type)){
            this.mappedDragEventCollection.addEventListener(type, listener, options);
        }
    }
    public removeEventListener(type: keyof MappedPointerEventMap, listener: ((this: InfiniteCanvas, ev: MappedPointerEventMap[keyof MappedPointerEventMap]) => any) | EventListenerObject, options?: boolean | EventListenerOptions){
        if(isMappedMouseEventKey(type)){
            this.mappedMouseEventCollection.removeEventListener(type, listener, options);
        }else if(isMappedTouchEventKey(type)){
            this.mappedTouchEventCollection.removeEventListener(type, listener, options);
        }else if(isMappedOnlyPointerEventKey(type)){
            this.mappedOnlyPointerEventCollection.removeEventListener(type, listener, options);
        }else if(isMappedDragEventKey(type)){
            this.mappedDragEventCollection.removeEventListener(type, listener, options);
        }
    }
}